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
import Vue from 'vue';
import {
    BlockInfo,
    IListener,
    Listener,
    NetworkType,
    RepositoryFactory,
    TransactionFees,
    RentalFees,
    RepositoryFactoryHttp,
    NodeInfo,
} from 'symbol-sdk';
import { Subscription } from 'rxjs';
import _ from 'lodash';
// internal dependencies
import { $eventBus } from '../events';
import { URLHelpers } from '@/core/utils/URLHelpers';
import app from '@/main';
import { AwaitLock } from './AwaitLock';
// configuration
import { UrlValidator } from '@/core/validation/validators';
import { NetworkModel } from '@/core/database/entities/NetworkModel';
import { NetworkService } from '@/services/NetworkService';
import { NodeService } from '@/services/NodeService';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { URLInfo } from '@/core/utils/URLInfo';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { networkConfig } from '@/config';
const Lock = AwaitLock.create();

/// region custom types
/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {
    listener: IListener | undefined;
    subscriptions: Subscription[];
};

/**
 * Type BlockRangeType for Wallet Store
 * @type {BlockRangeType}
 */
type BlockRangeType = { start: number };

/// end-region custom types

const staticPeerNodes: NodeInfo[] = [
    {
        nodePublicKey: 'BE60BE426872B3CB46FE2C9BAA521731EA52C0D57E004FC7C84293887AC3BAD0',
        host: 'beacon-01.ap-northeast-1.0.10.0.x.symboldev.network',
    },
    {
        nodePublicKey: 'EE356A555802003C5666D8485185CDC3844F9502FAF24B589BDC4D6E9148022F',
        host: 'beacon-01.eu-central-1.0.10.0.x.symboldev.network',
    },
    {
        nodePublicKey: '81890592F960AAEBDA7612C8917FA9C267A845D78D74D4B3651AF093E6775001',
        host: 'beacon-01.us-west-2.0.10.0.x.symboldev.network',
    },
    {
        nodePublicKey: '2AF52C5AA9A5E13DD548A577DEBF21E7D3CC285A1B0798F4D450239CDDE5A169',
        host: 'beacon-01.ap-southeast-1.0.10.0.x.symboldev.network',
    },
    {
        nodePublicKey: 'D74B89EE9378DEBD510A4139F8E8B10B878E12956059CD9E13253CF3AD73BDEB',
        host: 'beacon-01.us-west-1.0.10.0.x.symboldev.network',
    },
    {
        nodePublicKey: '938D6C1BBDB09F3F1B9D95D2D902A94C95E3AA6F1069A805831D9E272DCF927F',
        host: 'beacon-01.eu-west-1.0.10.0.x.symboldev.network',
    },
    {
        nodePublicKey: '2A40F7895F56389BE40C063B897E9E66E64705D55B19FC43C8CEB5F7F14ABE59',
        host: 'beacon-01.us-east-1.0.10.0.x.symboldev.network',
    },
] as NodeInfo[];

interface NetworkState {
    initialized: boolean;
    currentPeer: URLInfo;
    currentPeerInfo: NodeModel;
    networkModel: NetworkModel;
    networkConfiguration: NetworkConfigurationModel;
    repositoryFactory: RepositoryFactory;
    listener: Listener;
    generationHash: string;
    networkType: NetworkType;
    epochAdjustment: number;
    isConnected: boolean;
    knowNodes: NodeModel[];
    currentHeight: number;
    subscriptions: Subscription[];
    transactionFees: TransactionFees;
    rentalFeeEstimation: RentalFees;
    networkIsNotMatchingProfile: boolean;
    peerNodes: NodeInfo[];
    selectedPeerNode: NodeInfo;
}

const defaultPeer = URLHelpers.formatUrl(networkConfig.defaultNodeUrl);

const networkState: NetworkState = {
    initialized: false,
    currentPeer: defaultPeer,
    currentPeerInfo: new NodeModel(defaultPeer.url, defaultPeer.url, true),
    networkType: networkConfig.defaultNetworkType,
    generationHash: undefined,
    networkModel: undefined,
    networkConfiguration: networkConfig.networkConfigurationDefaults,
    repositoryFactory: NetworkService.createRepositoryFactory(networkConfig.defaultNodeUrl),
    listener: undefined,
    transactionFees: undefined,
    isConnected: false,
    knowNodes: [],
    currentHeight: 0,
    subscriptions: [],
    rentalFeeEstimation: undefined,
    epochAdjustment: networkConfig.networkConfigurationDefaults.epochAdjustment,
    networkIsNotMatchingProfile: false,
    peerNodes: [],
    selectedPeerNode: null,
};

export default {
    namespaced: true,
    state: networkState,
    getters: {
        getInitialized: (state: NetworkState) => state.initialized,
        subscriptions: (state: NetworkState) => state.subscriptions,
        networkType: (state: NetworkState) => state.networkType,
        epochAdjustment: (state: NetworkState) => state.epochAdjustment,
        generationHash: (state: NetworkState) => state.generationHash,
        repositoryFactory: (state: NetworkState) => state.repositoryFactory,
        listener: (state: NetworkState) => state.listener,
        networkModel: (state: NetworkState) => state.networkModel,
        networkConfiguration: (state: NetworkState) => state.networkConfiguration,
        currentPeer: (state: NetworkState) => state.currentPeer,
        currentPeerInfo: (state: NetworkState) => state.currentPeerInfo,
        isConnected: (state: NetworkState) => state.isConnected,
        knowNodes: (state: NetworkState) => state.knowNodes,
        currentHeight: (state: NetworkState) => state.currentHeight,
        transactionFees: (state: NetworkState) => state.transactionFees,
        rentalFeeEstimation: (state: NetworkState) => state.rentalFeeEstimation,
        networkIsNotMatchingProfile: (state: NetworkState) => state.networkIsNotMatchingProfile,
        peerNodes: (state: NetworkState) => state.peerNodes,
    },
    mutations: {
        setInitialized: (state: NetworkState, initialized: boolean) => {
            state.initialized = initialized;
        },
        setConnected: (state: NetworkState, connected: boolean) => {
            state.isConnected = connected;
        },
        currentHeight: (state: NetworkState, currentHeight: number) => Vue.set(state, 'currentHeight', currentHeight),
        currentPeerInfo: (state: NetworkState, currentPeerInfo: NodeModel) => Vue.set(state, 'currentPeerInfo', currentPeerInfo),
        repositoryFactory: (state: NetworkState, repositoryFactory: RepositoryFactory) =>
            Vue.set(state, 'repositoryFactory', repositoryFactory),
        networkConfiguration: (state: NetworkState, networkConfiguration: NetworkConfigurationModel) =>
            Vue.set(state, 'networkConfiguration', networkConfiguration),
        listener: (state: NetworkState, listener: Listener) => Vue.set(state, 'listener', listener),
        networkModel: (state: NetworkState, networkModel: NetworkModel) => Vue.set(state, 'networkModel', networkModel),
        knowNodes: (state: NetworkState, knowNodes: NodeModel[]) => Vue.set(state, 'knowNodes', knowNodes),
        generationHash: (state: NetworkState, generationHash: string) => Vue.set(state, 'generationHash', generationHash),
        networkType: (state: NetworkState, networkType: NetworkType) => Vue.set(state, 'networkType', networkType),
        epochAdjustment: (state: NetworkState, epochAdjustment: number) => Vue.set(state, 'epochAdjustment', epochAdjustment),
        currentPeer: (state: NetworkState, currentPeer: URLInfo) => Vue.set(state, 'currentPeer', currentPeer),
        transactionFees: (state: NetworkState, transactionFees: TransactionFees) => {
            state.transactionFees = transactionFees;
        },
        rentalFeeEstimation: (state: NetworkState, amount: RentalFees) => {
            state.rentalFeeEstimation = amount;
        },
        networkIsNotMatchingProfile: (state: NetworkState, networkIsNotMatchingProfile: boolean) => {
            Vue.set(state, 'networkIsNotMatchingProfile', networkIsNotMatchingProfile);
        },

        addPeer: (state: NetworkState, peerUrl: string) => {
            const knowNodes: NodeModel[] = state.knowNodes;
            const existNode = knowNodes.find((p: NodeModel) => p.url === peerUrl);
            if (existNode) {
                return;
            }
            const newNodes = [...knowNodes, new NodeModel(peerUrl, '', false)];
            new NodeService().saveNodes(newNodes);
            Vue.set(state, 'knowNodes', newNodes);
        },
        removePeer: (state: NetworkState, peerUrl: string) => {
            const knowNodes: NodeModel[] = state.knowNodes;
            const toBeDeleted = knowNodes.find((p: NodeModel) => p.url === peerUrl);
            if (!toBeDeleted) {
                return;
            }
            const newNodes = knowNodes.filter((n) => n !== toBeDeleted);
            new NodeService().saveNodes(newNodes);
            Vue.set(state, 'knowNodes', newNodes);
        },
        updateNode: (state: NetworkState, node: NodeModel) => {
            const knowNodes: NodeModel[] = state.knowNodes;
            const toBeUpdated = knowNodes.find((p: NodeModel) => p.url === node.url);
            if (!toBeUpdated) {
                return;
            }
            const newNodes = knowNodes.map((n) => (n.url === node.url ? node : n));
            new NodeService().saveNodes(newNodes);
            Vue.set(state, 'knowNodes', newNodes);
        },
        subscriptions: (state: NetworkState, data) => Vue.set(state, 'subscriptions', data),
        addSubscriptions: (state: NetworkState, payload) => {
            const subscriptions = state.subscriptions;
            Vue.set(state, 'subscriptions', [...subscriptions, payload]);
        },
        peerNodes: (state: NetworkState, peerNodes: NodeInfo[]) => Vue.set(state, 'peerNodes', peerNodes),
    },
    actions: {
        async initialize({ commit, dispatch, getters }) {
            const callback = async () => {
                // commit('knowNodes', new NodeService().getKnowNodesOnly())
                await dispatch('CONNECT');
                dispatch('REST_NETWORK_RENTAL_FEES');
                // update store
                commit('setInitialized', true);
            };
            // acquire async lock until initialized
            await Lock.initialize(callback, { getters });
        },
        async uninitialize({ commit, dispatch, getters }) {
            const callback = async () => {
                dispatch('UNSUBSCRIBE');
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },

        async CONNECT({ commit, dispatch, getters, rootGetters }, newCandidate: string | undefined) {
            const currentProfile: ProfileModel = rootGetters['profile/currentProfile'];
            const networkService = new NetworkService();
            const nodeService = new NodeService();
            const networkModelResult = await networkService
                .getNetworkModel(newCandidate, (currentProfile && currentProfile.generationHash) || undefined)
                .toPromise();
            if (!networkModelResult) {
                throw new Error('Connect error, active peer cannot be found');
            }
            const { networkModel, repositoryFactory, fallback } = networkModelResult;
            if (fallback) {
                throw new Error('Connection Error.');
            }
            const oldGenerationHash = getters['generationHash'];
            const getNodesPromise = nodeService.getNodes(repositoryFactory, networkModel.url).toPromise();
            const getBlockchainHeightPromise = repositoryFactory.createChainRepository().getChainInfo().toPromise();
            const nodes = await getNodesPromise;
            const currentHeight = (await getBlockchainHeightPromise).height.compact();
            const listener = repositoryFactory.createListener();

            const currentPeer = URLHelpers.getNodeUrl(networkModel.url);
            commit('currentPeer', currentPeer);
            commit('networkModel', networkModel);
            commit('networkConfiguration', networkModel.networkConfiguration);
            commit('transactionFees', networkModel.transactionFees);
            commit('networkType', networkModel.networkType);
            commit('epochAdjustment', networkModel.networkConfiguration.epochAdjustment);
            commit('generationHash', networkModel.generationHash);
            commit('repositoryFactory', repositoryFactory);
            commit('knowNodes', nodes);
            commit('listener', listener);
            commit('currentHeight', currentHeight);
            commit(
                'currentPeerInfo',
                nodes.find((n) => n.url === networkModel.url),
            );
            commit('setConnected', true);
            $eventBus.$emit('newConnection', currentPeer);
            // subscribe to updates

            if (oldGenerationHash != networkModel.generationHash) {
                dispatch('account/NETWORK_CHANGED', {}, { root: true });
                dispatch('statistics/LOAD', {}, { root: true });

                // check if current profile network type and generation hash matches current network
                if (
                    currentProfile &&
                    (currentProfile.networkType !== networkModel.networkType ||
                        currentProfile.generationHash !== networkModel.generationHash)
                ) {
                    dispatch('SET_NETWORK_IS_NOT_MATCHING_PROFILE', true);
                } else {
                    dispatch('SET_NETWORK_IS_NOT_MATCHING_PROFILE', false);
                }
            }
            await dispatch('UNSUBSCRIBE');
            await listener.open();
            dispatch('SUBSCRIBE');
        },

        async SET_CURRENT_PEER({ dispatch }, currentPeerUrl) {
            if (!UrlValidator.validate(currentPeerUrl)) {
                throw Error('Cannot change node. URL is not valid: ' + currentPeerUrl);
            }

            // - show loading overlay
            dispatch(
                'app/SET_LOADING_OVERLAY',
                {
                    show: true,
                    message: `${app.$t('info_connecting_peer', {
                        peerUrl: currentPeerUrl,
                    })}`,
                    disableCloseButton: true,
                },
                { root: true },
            );

            dispatch('diagnostic/ADD_DEBUG', 'Store action network/SET_CURRENT_PEER dispatched with: ' + currentPeerUrl, {
                root: true,
            });

            try {
                // - disconnect from previous node

                await dispatch('CONNECT', currentPeerUrl);
            } catch (e) {
                console.log(e);
                dispatch(
                    'notification/ADD_ERROR',
                    `${app.$t('error_peer_connection_went_wrong', {
                        peerUrl: currentPeerUrl,
                    })}`,
                    { root: true },
                );
                dispatch('diagnostic/ADD_ERROR', 'Error with store action network/SET_CURRENT_PEER: ' + JSON.stringify(e), {
                    root: true,
                });
            } finally {
                // - hide loading overlay
                dispatch('app/SET_LOADING_OVERLAY', { show: false }, { root: true });
            }
        },

        REST_NETWORK_RENTAL_FEES({ rootGetters, dispatch }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            repositoryFactory
                .createNetworkRepository()
                .getRentalFees()
                .subscribe((rentalFee: RentalFees) => {
                    dispatch('SET_RENTAL_FEE_ESTIMATE', rentalFee);
                });
        },

        SET_RENTAL_FEE_ESTIMATE({ commit }, rentalFee) {
            commit('rentalFeeEstimation', rentalFee);
        },
        SET_NETWORK_IS_NOT_MATCHING_PROFILE({ commit }, networkIsNotMatchingProfile) {
            commit('networkIsNotMatchingProfile', networkIsNotMatchingProfile);
        },
        ADD_KNOWN_PEER({ commit }, peerUrl) {
            if (!UrlValidator.validate(peerUrl)) {
                throw Error('Cannot add node. URL is not valid: ' + peerUrl);
            }
            commit('addPeer', peerUrl);
        },
        REMOVE_KNOWN_PEER({ commit }, peerUrl) {
            commit('removePeer', peerUrl);
        },

        async UPDATE_PEER({ commit }, peerUrl) {
            const repositoryFactory = new RepositoryFactoryHttp(peerUrl);
            const nodeService = new NodeService();

            const knownNodes = await nodeService.getNodes(repositoryFactory, peerUrl).toPromise();
            commit('knowNodes', knownNodes);
        },

        async RESET_PEERS({ dispatch, getters }) {
            const nodeService = new NodeService();
            nodeService.reset();

            const networkService = new NetworkService();
            networkService.reset(getters['generationHash']);

            dispatch('SET_CURRENT_PEER', networkService.getDefaultUrl());
        },
        async LOAD_PEER_NODES({ commit, rootGetters }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            const nodeRepository = repositoryFactory.createNodeRepository();

            const peerNodes: NodeInfo[] = await nodeRepository.getNodePeers().toPromise();
            const allNodes = [...staticPeerNodes, ...peerNodes.sort((a, b) => a.host.localeCompare(b.host))];
            commit('peerNodes', _.uniqBy(allNodes, 'host'));
        },
        /**
         * Websocket API
         */
        // Subscribe to latest account transactions.
        async SUBSCRIBE({ commit, dispatch, getters }) {
            // use RESTService to open websocket channel subscriptions
            const listener = getters['listener'] as Listener;
            listener.open().then(() => {
                const subscription = listener.newBlock().subscribe((block: BlockInfo) => {
                    dispatch('SET_CURRENT_HEIGHT', block.height.compact());
                    dispatch('diagnostic/ADD_INFO', 'New block height: ' + block.height.compact(), { root: true });
                });
                // update state of listeners & subscriptions
                commit('addSubscriptions', subscription);
            });
        },

        // Unsubscribe from all open websocket connections
        async UNSUBSCRIBE({ commit, getters }) {
            const subscriptions: Subscription[] = getters.subscriptions;
            subscriptions.forEach((s) => s.unsubscribe());
            const listener: Listener = getters.listener;
            if (listener) {
                listener.close();
            }
            // update state
            commit('subscriptions', []);
        },

        SET_CURRENT_HEIGHT({ commit }, height) {
            commit('currentHeight', height);
        },

        LOAD_TRANSACTION_FEES({ commit, rootGetters }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            const networkRepository = repositoryFactory.createNetworkRepository();
            networkRepository.getTransactionFees().subscribe((fees: TransactionFees) => commit('transactionFees', fees));
        },
    },
};
