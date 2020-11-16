/*
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Address, NamespaceId, RepositoryFactory } from 'symbol-sdk';
import Vue from 'vue';
// internal dependencies
import { AwaitLock } from './AwaitLock';
import { NamespaceService } from '@/services/NamespaceService';
import { NamespaceModel } from '@/core/database/entities/NamespaceModel';

import * as _ from 'lodash';
import { MetadataModel } from '@/core/database/entities/MetadataModel';
import { MetadataService } from '@/services/MetadataService';

const Lock = AwaitLock.create();

interface NamespaceState {
    initialized: boolean;
    namespaces: NamespaceModel[];
    ownedNamespaces: NamespaceModel[];
    isFetchingNamespaces: boolean;
    linkedAddress: Address | null;
}

const namespaceState: NamespaceState = {
    initialized: false,
    namespaces: [],
    ownedNamespaces: [],
    isFetchingNamespaces: false,
    linkedAddress: null,
};

export default {
    namespaced: true,
    state: namespaceState,
    getters: {
        getInitialized: (state: NamespaceState) => state.initialized,
        namespaces: (state: NamespaceState) => state.namespaces,
        ownedNamespaces: (state: NamespaceState) => state.ownedNamespaces,
        isFetchingNamespaces: (state: NamespaceState) => state.isFetchingNamespaces,
        linkedAddress: (state: NamespaceState) => state.linkedAddress,
    },
    mutations: {
        setInitialized: (state: NamespaceState, initialized) => {
            state.initialized = initialized;
        },
        namespaces: (
            state: NamespaceState,
            {
                namespaces,
                currentSignerAddress,
                namespaceMetadataList,
            }: { namespaces: NamespaceModel[]; currentSignerAddress: Address; namespaceMetadataList: MetadataModel[] },
        ) => {
            const uniqueNamespaces = _.uniqBy(namespaces, (n) => n.namespaceIdHex).map((namespace) => {
                namespace.metadataList = MetadataService.getMosaicMetadataByTargetId(namespaceMetadataList, namespace.namespaceIdHex);
                return namespace;
            });
            Vue.set(state, 'namespaces', uniqueNamespaces);
            Vue.set(
                state,
                'ownedNamespaces',
                uniqueNamespaces.filter((n) => n.ownerAddressRawPlain === currentSignerAddress.plain()),
            );
        },
        isFetchingNamespaces: (state: NamespaceState, isFetchingNamespaces: boolean) =>
            Vue.set(state, 'isFetchingNamespaces', isFetchingNamespaces),
        linkedAddress: (state: NamespaceState, linkedAddress: Address | null) => Vue.set(state, 'linkedAddress', linkedAddress),
    },
    actions: {
        async initialize({ commit, getters }) {
            const callback = async () => {
                // Placeholder for initialization if necessary.
                commit('setInitialized', true);
            };
            // aquire async lock until initialized
            await Lock.initialize(callback, { getters });
        },

        async uninitialize({ commit, getters }) {
            const callback = async () => {
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },

        LOAD_NAMESPACES({ commit, rootGetters }) {
            const repositoryFactory = rootGetters['network/repositoryFactory'];
            const generationHash = rootGetters['network/generationHash'];
            const namespaceService = new NamespaceService();
            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            const namespaceMetadataList: MetadataModel[] = rootGetters['metadata/namespaceMetadataList'];
            if (!currentSignerAddress) {
                return;
            }
            commit('isFetchingNamespaces', true);
            namespaceService
                .getNamespaces(repositoryFactory, generationHash, [currentSignerAddress])
                .subscribe((namespaces) => {
                    commit('namespaces', { namespaces, currentSignerAddress, namespaceMetadataList });
                })
                .add(() => commit('isFetchingNamespaces', false));
        },

        RESET_NAMESPACES({ commit }) {
            const namespaces: NamespaceModel[] = [];
            commit('namespaces', { namespaces, undefined });
        },

        async GET_LINKED_ADDRESS({ commit, rootGetters }, namespaceId: NamespaceId) {
            const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory;
            const getLinkedAccountPromise = repositoryFactory
                .createNamespaceRepository()
                .getLinkedAddress(namespaceId)
                .toPromise()
                .catch(() => commit('linkedAddress', null));
            const linkedAddress = await getLinkedAccountPromise;

            commit('linkedAddress', linkedAddress);
        },

        SIGNER_CHANGED({ commit, rootGetters, getters }) {
            const namespaces: NamespaceModel[] = getters['namespaces'];
            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            if (!currentSignerAddress) {
                return;
            }
            commit('namespaces', { namespaces, currentSignerAddress });
        },

        async RESOLVE_NAME({ commit, getters, rootGetters }, namespaceId: NamespaceId): Promise<string> {
            if (!namespaceId) {
                return '';
            }

            if (namespaceId.fullName) {
                return namespaceId.fullName;
            }
            const namespaces: NamespaceModel[] = getters['namespaces'];
            const knownNamespace = namespaces.find((n) => n.namespaceIdHex === namespaceId.toHex());
            if (knownNamespace) {
                return knownNamespace.name;
            }
            const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory;
            const currentSignerAddress = rootGetters['account/currentSignerAddress'] as Address;
            const namespaceRepository = repositoryFactory.createNamespaceRepository();

            const namespaceInfo = await namespaceRepository.getNamespace(namespaceId).toPromise();

            // map by hex if names available
            const namespaceName = await namespaceRepository.getNamespacesNames([namespaceId]).toPromise();

            // Note, fullName may not be full. How can we load it without needing to load each parent recursively?.
            const model = new NamespaceModel(
                namespaceInfo,
                NamespaceService.getFullNameFromNamespaceNames(namespaceName[0], namespaceName),
            );
            namespaces.push(model);
            commit('namespaces', { namespaces, currentSignerAddress });
            return model.name;
        },
    },
};
