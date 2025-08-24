/*
 * (C) Symbol Contributors 2021
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
import { HarvestingModel } from '@/core/database/entities/HarvestingModel';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { URLHelpers } from '@/core/utils/URLHelpers';
import { HarvestingService } from '@/services/HarvestingService';
import { NodeService } from '@/services/NodeService';
import { PageInfo } from '@/store/Transaction';
import { map, reduce } from 'rxjs/operators';
import {
    AccountInfo,
    Address,
    BalanceChangeReceipt,
    NetworkType,
    Order,
    ReceiptPaginationStreamer,
    ReceiptType,
    RepositoryFactory,
    RepositoryFactoryHttp,
    SignedTransaction,
    UInt64,
} from 'symbol-sdk';
import Vue from 'vue';
// internal dependencies
import { AwaitLock } from './AwaitLock';

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
    KEYS_LINKED = 'KEYS_LINKED',
    INPROGRESS_ACTIVATION = 'INPROGRESS_ACTIVATION',
    INPROGRESS_DEACTIVATION = 'INPROGRESS_DEACTIVATION',
    FAILED = 'FAILED',
}

export enum LedgerHarvestingMode {
    DELEGATED_HARVESTING_START_OR_SWAP = 'DELEGATED_HARVESTING_START_OR_SWAP',
    DELEGATED_HARVESTING_STOP = 'DELEGATED_HARVESTING_STOP',
    MULTISIG_DELEGATED_HARVESTING_START_OR_SWAP = 'MULTISIG_DELEGATED_HARVESTING_START_OR_SWAP',
    MULTISIG_DELEGATED_HARVESTING_STOP = 'MULTISIG_DELEGATED_HARVESTING_STOP',
}
interface HarvestingState {
    initialized: boolean;
    harvestedBlocks: HarvestedBlock[];
    isFetchingHarvestedBlocks: boolean;
    harvestedBlocksPageInfo: PageInfo;
    status: HarvestingStatus;
    harvestedBlockStats: HarvestedBlockStats;
    isFetchingHarvestedBlockStats: boolean;
    currentSignerHarvestingModel: HarvestingModel;
    pollingTrials: number;
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
    currentSignerHarvestingModel: null,
    pollingTrials: 1,
};

export const HARVESTING_STATUS_POLLING_TRIAL_LIMIT = 60;
export const HARVESTING_STATUS_POLLING_INTERVAL_SECS = 10;
export const HARVESTING_BLOCKS_POLLING_INTERVAL_SECS = 30;

const harvestingService = new HarvestingService();

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
        currentSignerHarvestingModel: (state) => state.currentSignerHarvestingModel,
        pollingTrials: (state) => state.pollingTrials,
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
        currentSignerHarvestingModel: (state, currentSignerHarvestingModel) =>
            Vue.set(state, 'currentSignerHarvestingModel', currentSignerHarvestingModel),
        setPollingTrials: (state, pollingTrials) => {
            Vue.set(state, 'pollingTrials', pollingTrials);
        },
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
        SET_POLLING_TRIALS({ commit }, pollingTrials) {
            commit('setPollingTrials', pollingTrials);
        },
        async FETCH_STATUS({ commit, rootGetters, dispatch }, node?: [string, NodeModel]) {
            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            const currentSignerHarvestingModel: HarvestingModel = rootGetters['harvesting/currentSignerHarvestingModel'];
            if (
                currentSignerHarvestingModel?.accountAddress &&
                currentSignerAddress.plain() !== currentSignerHarvestingModel.accountAddress
            ) {
                return;
            }
            const repositoryFactory = rootGetters['network/repositoryFactory'];
            const currentSignerAccountInfo = (
                await repositoryFactory.createAccountRepository().getAccountsInfo([currentSignerAddress]).toPromise()
            )[0];

            // reset
            let status: HarvestingStatus;
            if (!currentSignerAccountInfo) {
                commit('status', HarvestingStatus.INACTIVE);
                return;
            }
            let accountUnlocked = false;
            const accountNodePublicKey = currentSignerAccountInfo?.supplementalPublicKeys?.node?.publicKey;
            const accountRemotePublicKey = currentSignerAccountInfo?.supplementalPublicKeys?.linked?.publicKey;

            if (currentSignerHarvestingModel) {
                // To verify local account key link info
                dispatch('UPDATE_LOCAL_ACCOUNT_LINK_PRIVATE_KEY', {
                    currentSignerAccountInfo,
                    currentSignerHarvestingModel,
                });

                // Update selectedHarvestingNode to empty, if account node & remote public key not existing
                if (!accountNodePublicKey && !accountRemotePublicKey) {
                    dispatch('UPDATE_ACCOUNT_SELECTED_HARVESTING_NODE', {
                        accountAddress: currentSignerHarvestingModel.accountAddress,
                        selectedHarvestingNode: { nodePublicKey: '' } as NodeModel,
                    });
                } else {
                    // if selectedHarvestingNode empty update with newSelectedHarvestingNode
                    if (currentSignerHarvestingModel.selectedHarvestingNode?.nodePublicKey === '') {
                        const harvestingModel = harvestingService.getHarvestingModel(currentSignerHarvestingModel.accountAddress);
                        dispatch('UPDATE_ACCOUNT_SELECTED_HARVESTING_NODE', {
                            accountAddress: currentSignerHarvestingModel.accountAddress,
                            selectedHarvestingNode: harvestingModel.newSelectedHarvestingNode,
                        });
                    }
                }
            }
            //find the node url from currentSignerHarvestingModel (localStorage)
            const selectedNode = currentSignerHarvestingModel?.selectedHarvestingNode;
            const nodeService = new NodeService();
            const networkType: NetworkType = rootGetters['network/networkType'];
            // try to find owned node with currentSignerAccountInfo.publicKey
            let nodeInfo = await nodeService.getNodeFromNodeWatchServiceByMainPublicKey(networkType, currentSignerAccountInfo.publicKey);

            // try to find a linked node if it is not an owned node
            if (!nodeInfo && accountNodePublicKey) {
                nodeInfo = await nodeService.getNodeFromNodeWatchServiceByNodePublicKey(networkType, accountNodePublicKey);
            }
            let unlockedAccounts: string[] = [];

            // set the harvesting node url, first try linked or owned node url if not available try stored url info and lastly the passed parameter node[0]
            const harvestingNodeUrl = nodeInfo?.url || selectedNode?.url || (node && !!node.length ? node[0] : '');
            if (harvestingNodeUrl) {
                const repositoryFactory = new RepositoryFactoryHttp(URLHelpers.getNodeUrl(harvestingNodeUrl));
                const nodeRepository = repositoryFactory.createNodeRepository();
                try {
                    unlockedAccounts = await nodeRepository.getUnlockedAccount().toPromise();
                } catch (error) {
                    // proceed
                }
            }
            accountUnlocked = unlockedAccounts?.some((publicKey) => publicKey === accountRemotePublicKey);

            const allKeysLinked =
                currentSignerAccountInfo.supplementalPublicKeys?.linked &&
                currentSignerAccountInfo.supplementalPublicKeys?.node &&
                currentSignerAccountInfo.supplementalPublicKeys?.vrf;
            if (allKeysLinked || accountUnlocked) {
                const pollingTrials = rootGetters['harvesting/pollingTrials'];
                status = accountUnlocked
                    ? HarvestingStatus.ACTIVE
                    : currentSignerHarvestingModel?.isPersistentDelReqSent
                    ? pollingTrials === HARVESTING_STATUS_POLLING_TRIAL_LIMIT ||
                      currentSignerHarvestingModel?.delegatedHarvestingRequestFailed
                        ? HarvestingStatus.FAILED
                        : HarvestingStatus.INPROGRESS_ACTIVATION
                    : HarvestingStatus.KEYS_LINKED;
                if (status === HarvestingStatus.ACTIVE && node && node[1]) {
                    // @ts-ignore
                    dispatch('UPDATE_ACCOUNT_SELECTED_HARVESTING_NODE', {
                        accountAddress: currentSignerHarvestingModel.accountAddress,
                        // @ts-ignore
                        selectedHarvestingNode: node[1],
                    });
                }
            } else {
                status = accountUnlocked ? HarvestingStatus.INPROGRESS_DEACTIVATION : HarvestingStatus.INACTIVE;
            }
            commit('status', status);
        },
        LOAD_HARVESTED_BLOCKS({ commit, rootGetters }, { pageNumber, pageSize }: { pageNumber: number; pageSize: number }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            const receiptRepository = repositoryFactory.createReceiptRepository();

            const currentSignerAddress: Address = rootGetters['account/currentSignerAddress'];
            if (!currentSignerAddress) {
                return;
            }

            const targetAddress = currentSignerAddress;

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
                                    fee: (t.receipts as BalanceChangeReceipt[]).reduce((acc, r) => {
                                        if (r.targetAddress && r.targetAddress.plain() === targetAddress.plain()) {
                                            return acc.add(r.amount);
                                        } else {
                                            return acc;
                                        }
                                    }, UInt64.fromUint(0)),
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
        SET_CURRENT_SIGNER_HARVESTING_MODEL({ commit }, currentSignerAddress) {
            let harvestingModel = harvestingService.getHarvestingModel(currentSignerAddress);
            if (!harvestingModel) {
                harvestingModel = { accountAddress: currentSignerAddress };
                harvestingService.saveHarvestingModel(harvestingModel);
            }
            commit('currentSignerHarvestingModel', harvestingModel);
        },
        UPDATE_ACCOUNT_SIGNED_PERSISTENT_DEL_REQ_TXS(
            { commit },
            { accountAddress, signedPersistentDelReqTxs }: { accountAddress: string; signedPersistentDelReqTxs: SignedTransaction[] },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateSignedPersistentDelReqTxs(harvestingModel, signedPersistentDelReqTxs);
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_ACCOUNT_IS_PERSISTENT_DEL_REQ_SENT(
            { commit },
            { accountAddress, isPersistentDelReqSent }: { accountAddress: string; isPersistentDelReqSent: boolean },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateIsPersistentDelReqSent(harvestingModel, isPersistentDelReqSent);
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_ACCOUNT_SELECTED_HARVESTING_NODE(
            { commit },
            { accountAddress, selectedHarvestingNode }: { accountAddress: string; selectedHarvestingNode: NodeModel },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateSelectedHarvestingNode(harvestingModel, selectedHarvestingNode);
                commit('currentSignerHarvestingModel', harvestingModel);
                harvestingService.updateDelegatedHarvestingRequestFailed(harvestingModel, false);
                commit('setPollingTrials', 1);
            }
        },
        UPDATE_ACCOUNT_NEW_SELECTED_HARVESTING_NODE(
            { commit },
            { accountAddress, newSelectedHarvestingNode }: { accountAddress: string; newSelectedHarvestingNode: NodeModel },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateNewSelectedHarvestingNode(harvestingModel, newSelectedHarvestingNode);
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_REMOTE_ACCOUNT_PRIVATE_KEY(
            { commit },
            { accountAddress, encRemotePrivateKey }: { accountAddress: string; encRemotePrivateKey: string },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateRemoteKey(harvestingModel, encRemotePrivateKey);
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_NEW_REMOTE_KEY_INFO(
            { commit },
            {
                accountAddress,
                newEncRemotePrivateKey,
                newRemotePublicKey,
            }: { accountAddress: string; newEncRemotePrivateKey: string; newRemotePublicKey: string },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            harvestingService.updateNewAccountLinkKeyInfo(harvestingModel, {
                newEncRemotePrivateKey,
                newRemotePublicKey,
            });
            commit('currentSignerHarvestingModel', harvestingModel);
        },
        UPDATE_VRF_ACCOUNT_PRIVATE_KEY(
            { commit },
            { accountAddress, encVrfPrivateKey }: { accountAddress: string; encVrfPrivateKey: string },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateVrfKey(harvestingModel, encVrfPrivateKey);
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_NEW_VRF_KEY_INFO(
            { commit },
            {
                accountAddress,
                newEncVrfPrivateKey,
                newVrfPublicKey,
            }: { accountAddress: string; newEncVrfPrivateKey: string; newVrfPublicKey: string },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateNewAccountLinkKeyInfo(harvestingModel, { newEncVrfPrivateKey, newVrfPublicKey });
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_HARVESTING_REQUEST_STATUS(
            { commit },
            { accountAddress, delegatedHarvestingRequestFailed }: { accountAddress: string; delegatedHarvestingRequestFailed: boolean },
        ) {
            const harvestingModel = harvestingService.getHarvestingModel(accountAddress);
            if (harvestingModel) {
                harvestingService.updateDelegatedHarvestingRequestFailed(harvestingModel, delegatedHarvestingRequestFailed);
                commit('currentSignerHarvestingModel', harvestingModel);
            }
        },
        UPDATE_LOCAL_ACCOUNT_LINK_PRIVATE_KEY(
            { dispatch },
            {
                currentSignerAccountInfo,
                currentSignerHarvestingModel,
            }: { currentSignerAccountInfo: AccountInfo; currentSignerHarvestingModel: HarvestingModel },
        ) {
            const { address, supplementalPublicKeys } = currentSignerAccountInfo;
            const accountAddress = address.plain();
            const { linked, vrf } = supplementalPublicKeys;
            const {
                newEncRemotePrivateKey,
                newEncVrfPrivateKey,
                newRemotePublicKey,
                newVrfPublicKey,
                encRemotePrivateKey,
                encVrfPrivateKey,
            } = currentSignerHarvestingModel;

            // If remote key link not exist from network or local
            // Set local encRemotePrivateKey to null
            if (!linked || !newRemotePublicKey) {
                dispatch('UPDATE_REMOTE_ACCOUNT_PRIVATE_KEY', {
                    accountAddress,
                    encRemotePrivateKey: null,
                });
            }

            if (newRemotePublicKey && linked?.publicKey) {
                if (newRemotePublicKey === linked.publicKey) {
                    dispatch('UPDATE_REMOTE_ACCOUNT_PRIVATE_KEY', {
                        accountAddress,
                        encRemotePrivateKey: newEncRemotePrivateKey || encRemotePrivateKey,
                    });
                }
            }

            // If vrf key link not exist from network or local
            // Set local encVrfPrivateKey to null
            if (!vrf || !newVrfPublicKey) {
                dispatch('UPDATE_VRF_ACCOUNT_PRIVATE_KEY', {
                    accountAddress,
                    encVrfPrivateKey: null,
                });
            }

            if (newVrfPublicKey && vrf?.publicKey) {
                if (newVrfPublicKey === vrf?.publicKey) {
                    dispatch('UPDATE_VRF_ACCOUNT_PRIVATE_KEY', {
                        accountAddress,
                        encVrfPrivateKey: newEncVrfPrivateKey || encVrfPrivateKey,
                    });
                }
            }
        },
        /// end-region scoped actions
    },
};
