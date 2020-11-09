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

import { Address } from 'symbol-sdk';
import Vue from 'vue';

// internal dependencies
import { AwaitLock } from './AwaitLock';
import { MetadataService } from '@/services/MetadataService';
import { MetadataModel } from '@/core/database/entities/MetadataModel';

import * as _ from 'lodash';

const Lock = AwaitLock.create();

interface MetadataState {
    initialized: boolean;
    metadatas: MetadataModel[];
    ownedMetadatas: MetadataModel[];
    isFetchingMetadatas: boolean;
}

const metadataState: MetadataState = {
    initialized: false,
    metadatas: [],
    ownedMetadatas: [],
    isFetchingMetadatas: false,
};

export default {
    namespaced: true,
    state: metadataState,
    getters: {
        getInitialized: (state: MetadataState) => state.initialized,
        metadatas: (state: MetadataState) => state.metadatas,
        ownedMetadatas: (state: MetadataState) => state.ownedMetadatas,
        isFetchingMetadatas: (state: MetadataState) => state.isFetchingMetadatas,
    },
    mutations: {
        setInitialized: (state: MetadataState, initialized) => {
            state.initialized = initialized;
        },
        metadatas: (
            state: MetadataState,
            { metadatas, currentSignerAddress }: { metadatas: MetadataModel[]; currentSignerAddress: Address },
        ) => {
            const uniqueMetadatas = _.uniqBy(metadatas, (n) => n.metadataId);
            Vue.set(state, 'metadatas', uniqueMetadatas);
            Vue.set(
                state,
                'ownedMetadatas',
                uniqueMetadatas.filter((n) => n.sourceAddress === currentSignerAddress.plain()),
            );
        },
        isFetchingMetadatas: (state: MetadataState, isFetchingMetadatas: boolean) =>
            Vue.set(state, 'isFetchingMetadatas', isFetchingMetadatas),
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

        async LOAD_METADATAS({ commit, rootGetters }) {
            const repositoryFactory = rootGetters['network/repositoryFactory'];
            const generationHash = rootGetters['network/generationHash'];
            const metadataType = rootGetters['metadata/type'];
            const metadataService = new MetadataService();
            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            if (!currentSignerAddress) {
                return;
            }
            commit('isFetchingMetadatas', true);
            metadataService
                .getMetadataList(repositoryFactory, generationHash, currentSignerAddress, metadataType)
                .subscribe((metadatas) => {
                    commit('metadatas', { metadatas, currentSignerAddress });
                })
                .add(() => commit('isFetchingMetadatas', false));
        },

        async AssignMetadata({ commit, rootGetters }) {
            const repositoryFactory = rootGetters['network/repositoryFactory'];
            
            
        }
    },
};
