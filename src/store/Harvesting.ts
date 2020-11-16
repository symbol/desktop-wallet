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
import {
    AccountInfo,
    Address,
    BalanceChangeReceipt,
    Order,
    ReceiptPaginationStreamer,
    ReceiptType,
    RepositoryFactory,
    UInt64,
} from 'symbol-sdk';
import Vue from 'vue';
import { map, reduce } from 'rxjs/operators';
// internal dependencies
import { AwaitLock } from './AwaitLock';
import { PageInfo } from '@/store/Transaction';

const Lock = AwaitLock.create();

export type HarvestedBlock = {
    blockNo: UInt64;
    fee: UInt64;
};

export type HarvestedBlockStats = {
    totalBlockCount: number;
    totalFeesEarned: UInt64;
};

export enum HarvestingStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    INPROGRESS_ACTIVATION = 'INPROGRESS_ACTIVATION',
    INPROGRESS_DEACTIVATION = 'INPROGRESS_DEACTIVATION',
}
interface HarvestingState {
    initialized: boolean;
    harvestedBlocks: HarvestedBlock[];
    isFetchingHarvestedBlocks: boolean;
    harvestedBlocksPageInfo: PageInfo;
    status: HarvestingStatus;
    harvestedBlockStats: HarvestedBlockStats;
    isFetchingHarvestedBlockStats: boolean;
}

const initialState: HarvestingState = {
    initialized: false,
    harvestedBlocks: null,
    isFetchingHarvestedBlocks: false,
    harvestedBlocksPageInfo: { pageNumber: 1, isLastPage: false },
    status: HarvestingStatus.INACTIVE,
    harvestedBlockStats: {
        totalBlockCount: 0,
        totalFeesEarned: UInt64.fromUint(0),
    },
    isFetchingHarvestedBlockStats: false,
};

export default {
    namespaced: true,
    state: initialState,
    getters: {
        getInitialized: (state) => state.initialized,
        harvestedBlocks: (state) => state.harvestedBlocks,
        isFetchingHarvestedBlocks: (state) => state.isFetchingHarvestedBlocks,
        harvestedBlocksPageInfo: (state) => state.harvestedBlocksPageInfo,
        status: (state) => state.status,
        harvestedBlockStats: (state) => state.harvestedBlockStats,
        isFetchingHarvestedBlockStats: (state) => state.isFetchingHarvestedBlockStats,
    },
    mutations: {
        setInitialized: (state, initialized) => {
            state.initialized = initialized;
        },
        harvestedBlocks: (state, { harvestedBlocks, pageInfo }) => {
            Vue.set(state, 'harvestedBlocks', harvestedBlocks);
            Vue.set(state, 'harvestedBlocksPageInfo', pageInfo);
        },
        isFetchingHarvestedBlocks: (state, isFetchingHarvestedBlocks) =>
            Vue.set(state, 'isFetchingHarvestedBlocks', isFetchingHarvestedBlocks),
        status: (state, status) => Vue.set(state, 'status', status),
        harvestedBlockStats: (state, harvestedBlockStats) => Vue.set(state, 'harvestedBlockStats', harvestedBlockStats),
        isFetchingHarvestedBlockStats: (state, isFetchingHarvestedBlockStats) =>
            Vue.set(state, 'isFetchingHarvestedBlockStats', isFetchingHarvestedBlockStats),
    },
    actions: {
        async initialize({ commit, getters }) {
            const callback = async () => {
                // update store
                commit('setInitialized', true);
            };

            // acquire async lock until initialized
            await Lock.initialize(callback, { getters });
        },
        async uninitialize({ commit, getters }) {
            const callback = async () => {
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },
        /// region scoped actions
        RESET_STATE({ commit }) {
            commit('harvestedBlocks', { harvestedBlocks: null, pageInfo: { pageNumber: 1, isLastPage: false } });
            commit('isFetchingHarvestedBlocks', false);
        },
        async FETCH_STATUS({ commit, rootGetters }) {
            const currentSignerAccountInfo: AccountInfo = rootGetters['account/currentSignerAccountInfo'];
            // reset
            commit('status', HarvestingStatus.INACTIVE);
            if (!currentSignerAccountInfo) {
                return;
            }
            /* note: uncomment when SDK and REST is ready
            const knownNodes: NodeModel[] = rootGetters['network/knowNodes'];
            
            //find the node url from supplementalPublicKeys
            const nodePublicKey = currentSignerAccountInfo.supplementalPublicKeys?.node?.publicKey;
            const harvestingNodeUrl = knownNodes.find((n) => n.publicKey === nodePublicKey)?.url;
            if (!harvestingNodeUrl) {
                return;
            }
            const repositoryFactory = new RepositoryFactoryHttp(harvestingNodeUrl);
            const nodeRepository = repositoryFactory.createNodeRepository();
            let unlockedAccounts: string[] = await nodeRepository.getUnlockedAccount('to_be_replaced').toPromise();

            const allKeysLinked =
                currentSignerAccountInfo.supplementalPublicKeys?.linked &&
                currentSignerAccountInfo.supplementalPublicKeys?.node &&
                currentSignerAccountInfo.supplementalPublicKeys?.vrf;
            const accountUnlocked = unlockedAccounts?.some((publicKey) => publicKey === currentSignerAccountInfo.publicKey);
            if (allKeysLinked) {
                commit('status', accountUnlocked ? HarvestingStatus.ACTIVE : HarvestingStatus.INPROGRESS_ACTIVATION);
            } else {
                commit('status', accountUnlocked ? HarvestingStatus.INPROGRESS_DEACTIVATION : HarvestingStatus.INACTIVE);
            }
            */
            const allKeysLinked =
                currentSignerAccountInfo.supplementalPublicKeys?.linked &&
                currentSignerAccountInfo.supplementalPublicKeys?.node &&
                currentSignerAccountInfo.supplementalPublicKeys?.vrf;
            commit('status', allKeysLinked ? HarvestingStatus.ACTIVE : HarvestingStatus.INACTIVE);
        },
        LOAD_HARVESTED_BLOCKS({ commit, rootGetters }, { pageNumber, pageSize }: { pageNumber: number; pageSize: number }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            const receiptRepository = repositoryFactory.createReceiptRepository();

            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            if (!currentSignerAddress) {
                return;
            }

            const targetAddress = currentSignerAddress;
            // for testing => const targetAddress = Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY');

            commit('isFetchingHarvestedBlocks', true);

            receiptRepository
                .searchReceipts({
                    targetAddress: targetAddress,
                    receiptTypes: [ReceiptType.Harvest_Fee],
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    order: Order.Desc,
                })
                .pipe(
                    map((pageTxStatement) => {
                        const harvestedBlocks = pageTxStatement.data.map(
                            (t) =>
                                (({
                                    blockNo: t.height,
                                    fee: (t.receipts as BalanceChangeReceipt[]).find(
                                        (r) => r.targetAddress.plain() === targetAddress.plain(),
                                    )?.amount,
                                } as unknown) as HarvestedBlock),
                        );
                        const pageInfo = { isLastPage: pageTxStatement.isLastPage, pageNumber: pageTxStatement.pageNumber };

                        commit('harvestedBlocks', { harvestedBlocks, pageInfo });
                    }),
                )
                .subscribe({ complete: () => commit('isFetchingHarvestedBlocks', false) });
        },
        LOAD_HARVESTED_BLOCKS_STATS({ commit, rootGetters }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            const receiptRepository = repositoryFactory.createReceiptRepository();
            const streamer = ReceiptPaginationStreamer.transactionStatements(receiptRepository);

            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            if (!currentSignerAddress) {
                return;
            }

            const targetAddress = currentSignerAddress;
            // for testing => const targetAddress = Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY');

            commit('isFetchingHarvestedBlockStats', true);
            let counter = 0;
            streamer
                .search({
                    targetAddress: targetAddress,
                    receiptTypes: [ReceiptType.Harvest_Fee],
                    pageNumber: 1,
                    pageSize: 50,
                })
                .pipe(
                    map(
                        (t) =>
                            (({
                                blockNo: t.height,
                                fee: (t.receipts as BalanceChangeReceipt[]).find((r) => r.targetAddress.plain() === targetAddress.plain())
                                    .amount,
                            } as unknown) as HarvestedBlock),
                    ),
                    reduce(
                        (acc, harvestedBlock) => ({
                            totalBlockCount: ++counter,
                            totalFeesEarned: acc.totalFeesEarned.add(harvestedBlock.fee),
                        }),
                        {
                            totalBlockCount: 0,
                            totalFeesEarned: UInt64.fromUint(0),
                        },
                    ),
                )
                .subscribe({
                    next: (harvestedBlockStats) => {
                        commit('harvestedBlockStats', harvestedBlockStats);
                    },
                    complete: () => commit('isFetchingHarvestedBlockStats', false),
                });
        },
        /// end-region scoped actions
    },
};
