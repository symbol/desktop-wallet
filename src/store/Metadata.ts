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

import { Address, Deadline, MetadataType, MosaicId, NamespaceId, Transaction, UInt64 } from 'symbol-sdk';
import Vue from 'vue';

// internal dependencies
import { AwaitLock } from './AwaitLock';
import { MetadataService } from '@/services/MetadataService';
import { MetadataModel } from '@/core/database/entities/MetadataModel';

import * as _ from 'lodash';

const Lock = AwaitLock.create();

interface MetadataFormState {
    targetAddress: Address;
    metadataValue: string;
    scopedKey: string;
    targetId: string;
    maxFee: number;
}

interface MetadataState {
    initialized: boolean;
    accountMetadataList: MetadataModel[];
    mosaicMetadataList: MetadataModel[];
    namespaceMetadataList: MetadataModel[];
    isFetchingMetadata: boolean;
    transactions: Transaction[];
    metadataType: MetadataType;
    metadataForm: MetadataFormState;
}

const metadataState: MetadataState = {
    initialized: false,
    accountMetadataList: [],
    mosaicMetadataList: [],
    namespaceMetadataList: [],
    isFetchingMetadata: false,
    transactions: [],
    metadataType: MetadataType.Account,
    metadataForm: {
        targetAddress: null,
        scopedKey: '',
        metadataValue: '',
        targetId: '',
        maxFee: 0,
    },
};

export default {
    namespaced: true,
    state: metadataState,
    getters: {
        getInitialized: (state: MetadataState) => state.initialized,
        accountMetadataList: (state: MetadataState) =>
            state.accountMetadataList.filter((metadata) => metadata.metadataType === MetadataType.Account),
        mosaicMetadataList: (state: MetadataState, mosaicId: MosaicId) =>
            state.accountMetadataList.filter(
                (metadataModel) => metadataModel.targetId === mosaicId.toHex() && metadataModel.metadataType === MetadataType.Mosaic,
            ),
        namespaceMetadataList: (state: MetadataState, namespaceId: NamespaceId) =>
            state.accountMetadataList.filter(
                (metadataModel) => metadataModel.targetId === namespaceId.toHex() && metadataModel.metadataType === MetadataType.Namespace,
            ),
        isFetchingMetadata: (state: MetadataState) => state.isFetchingMetadata,
        metadataType: (state: MetadataState) => state.metadataType,
        metadataForm: (state: MetadataState) => state.metadataForm,
        transactions: (state: MetadataState) => state.transactions,
    },
    mutations: {
        setInitialized: (state: MetadataState, initialized) => {
            state.initialized = initialized;
        },
        accountMetadataList: (state: MetadataState, metadataList: MetadataModel[]) => {
            const uniqueMetadataList = _.uniqBy(metadataList, (n) => n.metadataId);
            Vue.set(state, 'accountMetadataList', uniqueMetadataList);
        },
        mosaicMetadataList: (state: MetadataState, metadataList: MetadataModel[]) => {
            const uniqueMetadataList = _.uniqBy(metadataList, (n) => n.metadataId);
            Vue.set(state, 'mosaicMetadataList', uniqueMetadataList);
        },
        namespaceMetadataList: (state: MetadataState, metadataList: MetadataModel[]) => {
            const uniqueMetadataList = _.uniqBy(metadataList, (n) => n.metadataId);
            Vue.set(state, 'namespaceMetadataList', uniqueMetadataList);
        },
        isFetchingMetadata: (state: MetadataState, isFetchingMetadata: boolean) => Vue.set(state, 'isFetchingMetadata', isFetchingMetadata),
        metadataType: (state: MetadataState, metadataType: MetadataType) => {
            Vue.set(state, 'metadataType', metadataType);
        },
        metadataForm: (state: MetadataState, metadataForm: MetadataFormState) => {
            Vue.set(state, 'metadataForm', metadataForm);
        },
        transactions: (state: MetadataState, transactions: Transaction[]) => {
            Vue.set(state, 'transactions', transactions);
        },
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

        async SET_METADATA_FORM_STATE({ commit }, metadataForm: MetadataFormState) {
            commit('metadataForm', metadataForm);
        },

        async SIGNER_CHANGED({ dispatch }) {
            await dispatch('LOAD_METADATA_LIST');
        },

        async LOAD_METADATA_LIST(
            { commit, rootGetters },
            metadataType: MetadataType = MetadataType.Account,
            targetId: MosaicId | NamespaceId = undefined,
        ) {
            const repositoryFactory = rootGetters['network/repositoryFactory'];
            const generationHash = rootGetters['network/generationHash'];
            const metadataService = new MetadataService();
            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            if (!currentSignerAddress) {
                return;
            }
            commit('isFetchingMetadata', true);
            metadataService
                .getMetadataList(repositoryFactory, generationHash, currentSignerAddress, metadataType, targetId)
                .subscribe((metadataList) => {
                    if (metadataType === MetadataType.Account) {
                        commit('accountMetadataList', metadataList);
                    } else if (metadataType === MetadataType.Mosaic) {
                        commit('mosaicMetadataList', metadataList);
                    } else {
                        commit('namespaceMetadataList', metadataList);
                    }
                })
                .add(() => commit('isFetchingMetadata', false));
        },

        async RESOLVE_METADATA_TRANSACTIONS({ commit, rootGetters }, metadataType: MetadataType) {
            const currentSignerAddress = rootGetters['account/currentSignerAddress'];
            const repositoryFactory = rootGetters['network/repositoryFactory'];
            const epochAdjustment = rootGetters['network/epochAdjustment'];
            const networkType = rootGetters['network/networkType'];
            const metadataForm: MetadataFormState = rootGetters['metadata/metadataForm'];

            if (!currentSignerAddress) {
                return;
            }

            const metadataService = new MetadataService();
            const metadataTransaction = await metadataService
                .metadataTransactionObserver(
                    repositoryFactory,
                    Deadline.create(epochAdjustment),
                    networkType,
                    currentSignerAddress,
                    metadataForm.targetAddress,
                    metadataForm.scopedKey,
                    metadataForm.metadataValue,
                    metadataForm.targetId,
                    metadataType,
                    UInt64.fromUint(metadataForm.maxFee),
                )
                .toPromise();
            commit('transactions', [metadataTransaction]);
        },
    },
};
