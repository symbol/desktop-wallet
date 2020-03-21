/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Vue from 'vue'
import {BlockInfo, IListener, Listener, NetworkType, RepositoryFactory, UInt64} from 'symbol-sdk'
import {Subscription} from 'rxjs'
// internal dependencies
import {$eventBus} from '../events'
import {RESTService} from '@/services/RESTService'
import {URLHelpers} from '@/core/utils/URLHelpers'
import app from '@/main'
import {AwaitLock} from './AwaitLock'
// configuration
import networkConfig from '../../config/network.conf.json'
import {UrlValidator} from '@/core/validation/validators'
import {NetworkModel} from '@/core/database/entities/NetworkModel'
import {NetworkService} from '@/services/NetworkService'
import {NodeService} from '@/services/NodeService'
import {NodeModel} from '@/core/database/entities/NodeModel'
import {URLInfo} from '@/core/utils/URLInfo'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'

const Lock = AwaitLock.create()

/// region internal helpers
/**
 * Recursive function helper to determine block ranges
 * needed to fetch data about all block \a heights
 * @param {number[]} heights
 * @return {BlockRangeType[]}
 */
const getBlockRanges = (heights: number[], ranges: BlockRangeType[] = []): BlockRangeType[] => {
  const pageSize: number = 100
  const min: number = Math.min(...heights)

  // - register first range
  ranges.push({start: min})

  // - take remaining block heights and run again
  heights = heights.filter(height => height > min + pageSize)
  if (heights.length) {
    return getBlockRanges(heights, ranges)
  }
  return ranges
}
/// end-region internal helpers

/// region custom types
/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = { listener: IListener | undefined, subscriptions: Subscription[] }

/**
 * Type BlockRangeType for Wallet Store
 * @type {BlockRangeType}
 */
type BlockRangeType = { start: number }

/// end-region custom types


interface NetworkState {
  initialized: boolean
  currentPeer: URLInfo
  currentPeerInfo: NodeModel
  networkModel: NetworkModel
  networkConfiguration: NetworkConfigurationModel
  repositoryFactory: RepositoryFactory
  listener: Listener
  generationHash: string
  networkType: NetworkType
  isConnected: boolean
  knowNodes: NodeModel[]
  currentHeight: number
  knownBlocks: Record<number, BlockInfo>
  subscriptions: Subscription[]
}

const defaultPeer = URLHelpers.formatUrl(networkConfig.defaultNodeUrl)

const networkState: NetworkState = {
  initialized: false,
  currentPeer: defaultPeer,
  currentPeerInfo: new NodeModel(defaultPeer.url, defaultPeer.url),
  networkType: undefined,
  generationHash: undefined,
  networkModel: undefined,
  networkConfiguration: networkConfig.networkConfigurationDefaults,
  repositoryFactory: RESTService.createRepositoryFactory(networkConfig.defaultNodeUrl),
  listener: undefined,
  isConnected: false,
  knowNodes: [],
  currentHeight: 0,
  knownBlocks: {},
  subscriptions: [],
}
export default {
  namespaced: true,
  state: networkState,
  getters: {
    getInitialized: (state: NetworkState) => state.initialized,
    subscriptions: (state: NetworkState) => state.subscriptions,
    networkType: (state: NetworkState) => state.networkType,
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
    knownBlocks: (state: NetworkState) => state.knownBlocks,
  },
  mutations: {
    setInitialized: (state: NetworkState,
      initialized: boolean) => { state.initialized = initialized },
    setConnected: (state: NetworkState, connected: boolean) => { state.isConnected = connected },
    currentHeight: (state: NetworkState, currentHeight: number) => Vue.set(state, 'currentHeight',
      currentHeight),
    currentPeerInfo: (state: NetworkState, currentPeerInfo: NodeModel) => Vue.set(state,
      'currentPeerInfo', currentPeerInfo),
    repositoryFactory: (state: NetworkState, repositoryFactory: RepositoryFactory) => Vue.set(state,
      'repositoryFactory', repositoryFactory),
    networkConfiguration: (state: NetworkState,
      networkConfiguration: NetworkConfigurationModel) => Vue.set(state,
      'networkConfiguration', networkConfiguration),
    listener: (state: NetworkState, listener: Listener) => Vue.set(state, 'listener', listener),
    networkModel: (state: NetworkState, networkModel: NetworkModel) => Vue.set(state,
      'networkModel', networkModel),
    knowNodes: (state: NetworkState, knowNodes: NodeModel[]) => Vue.set(state, 'knowNodes',
      knowNodes),
    generationHash: (state: NetworkState, generationHash: string) => Vue.set(state,
      'generationHash', generationHash),
    networkType: (state: NetworkState, networkType: NetworkType) => Vue.set(state, 'networkType',
      networkType),
    currentPeer: (state: NetworkState, currentPeer: URLInfo) => Vue.set(state, 'currentPeer',
      currentPeer),

    addPeer: (state: NetworkState, peerUrl: string) => {
      const knowNodes: NodeModel[] = state.knowNodes
      const existNode = knowNodes.find((p: NodeModel) => p.url === peerUrl)
      if (existNode) {
        return
      }
      const newNodes = [ ...knowNodes, new NodeModel(peerUrl, '') ]
      new NodeService().saveNodes(newNodes)
      Vue.set(state, 'knowNodes', newNodes)
    },
    removePeer: (state: NetworkState, peerUrl: string) => {
      const knowNodes: NodeModel[] = state.knowNodes
      const toBeDeleted = knowNodes.find((p: NodeModel) => p.url === peerUrl)
      if (!toBeDeleted) {
        return
      }
      const newNodes = knowNodes.filter(n => n !== toBeDeleted)
      new NodeService().saveNodes(newNodes)
      Vue.set(state, 'knowNodes', newNodes)
    },
    addBlock: (state: NetworkState, block: BlockInfo) => {
      const knownBlocks = state.knownBlocks
      knownBlocks[block.height.compact()] = block
      Vue.set(state, 'knownBlocks', knownBlocks)
    },
    subscriptions: (state: NetworkState, data) => Vue.set(state, 'subscriptions', data),
    addSubscriptions: (state: NetworkState, payload) => {
      const subscriptions = state.subscriptions
      Vue.set(state, 'subscriptions', [ ...subscriptions, payload ])
    },
  },
  actions: {
    async initialize({commit, dispatch, getters}) {
      const callback = async () => {
        const networkService = new NetworkService()
        await dispatch('CONNECT', networkService.getDefaultUrl())
        // update store
        commit('setInitialized', true)
      }
      // acquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({commit, dispatch, getters}) {
      const callback = async () => {
        dispatch('UNSUBSCRIBE')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },


    async CONNECT({commit, dispatch}, rawUrl: string) {
      const networkService = new NetworkService()
      const currentPeer = URLHelpers.formatUrl(rawUrl)
      const url = currentPeer.url
      const {networkModel, repositoryFactory} = await networkService.getNetworkModel(url)
        .toPromise()
      const getNodesPromise = new NodeService().getNodes(repositoryFactory, url).toPromise()
      const getBlockchainHeightPromise = repositoryFactory.createChainRepository()
        .getBlockchainHeight().toPromise()
      const nodes = await getNodesPromise
      const currentHeight = (await getBlockchainHeightPromise).compact()
      const listener = repositoryFactory.createListener()
      await listener.open()

      commit('currentPeer', currentPeer)
      commit('networkModel', networkModel)
      commit('networkConfiguration', networkModel.networkConfiguration)
      commit('networkType', networkModel.networkType)
      commit('generationHash', networkModel.generationHash)
      commit('repositoryFactory', repositoryFactory)
      commit('knowNodes', nodes)
      commit('listener', listener)
      commit('currentHeight', currentHeight)
      commit('currentPeerInfo', nodes.find(n => n.url === url))
      commit('setConnected', true)
      $eventBus.$emit('newConnection', currentPeer)
      // subscribe to updates
      dispatch('SUBSCRIBE')
    },


    async SET_CURRENT_PEER({dispatch, rootGetters}, currentPeerUrl) {
      if (!UrlValidator.validate(currentPeerUrl)) {
        throw Error('Cannot change node. URL is not valid: ' + currentPeerUrl)
      }

      // - show loading overlay
      dispatch('app/SET_LOADING_OVERLAY', {
        show: true,
        message: `${app.$t('info_connecting_peer', {peerUrl: currentPeerUrl})}`,
        disableCloseButton: true,
      }, {root: true})

      dispatch('diagnostic/ADD_DEBUG',
        'Store action network/SET_CURRENT_PEER dispatched with: ' + currentPeerUrl, {root: true})

      try {
        // - disconnect from previous node
        await dispatch('UNSUBSCRIBE')

        await dispatch('CONNECT', currentPeerUrl)

        const currentWallet = rootGetters['wallet/currentWallet']

        // - re-open listeners
        dispatch('wallet/initialize', {address: currentWallet.address}, {root: true})

      } catch (e) {
        dispatch(
          'notification/ADD_ERROR',
          `${app.$t('error_peer_connection_went_wrong', {peerUrl: currentPeerUrl})}`,
          {root: true},
        )
        dispatch('diagnostic/ADD_ERROR',
          'Error with store action network/SET_CURRENT_PEER: ' + JSON.stringify(e), {root: true})
      } finally {
        // - hide loading overlay
        dispatch('app/SET_LOADING_OVERLAY', {show: false}, {root: true})
      }
    },
    ADD_KNOWN_PEER({commit}, peerUrl) {
      if (!UrlValidator.validate(peerUrl)) {
        throw Error('Cannot add node. URL is not valid: ' + peerUrl)
      }
      commit('addPeer', peerUrl)
    },
    REMOVE_KNOWN_PEER({commit}, peerUrl) {
      commit('removePeer', peerUrl)
    },

    async RESET_PEERS({dispatch}) {
      try {

        const nodeService = new NodeService()
        nodeService.reset()

        const networkService = new NetworkService()
        networkService.reset()

        const defaultUrl = networkService.getDefaultUrl()
        dispatch('app/SET_LOADING_OVERLAY', {
          show: true,
          message: `${app.$t('info_connecting_peer', {peerUrl: defaultUrl})}`,
          disableCloseButton: true,
        }, {root: true})

        await dispatch('SET_CURRENT_PEER', defaultUrl)
      } finally {
        dispatch('app/SET_LOADING_OVERLAY', {show: false}, {root: true})
      }
    },

    ADD_BLOCK({commit}, block: BlockInfo) {
      commit('addBlock', block)
    },
    /**
     * Websocket API
     */
    // Subscribe to latest account transactions.
    async SUBSCRIBE({commit, dispatch, getters}) {
      // use RESTService to open websocket channel subscriptions
      const listener = getters['listener'] as Listener
      const subscription = listener.newBlock().subscribe((block: BlockInfo) => {
        dispatch('SET_CURRENT_HEIGHT', block.height.compact())
        dispatch('ADD_BLOCK', block)
        dispatch('diagnostic/ADD_INFO', 'New block height: ' + block.height.compact(), {root: true})
      })
      // update state of listeners & subscriptions
      commit('addSubscriptions', subscription)
    },

    // Unsubscribe from all open websocket connections
    async UNSUBSCRIBE({commit, getters}) {
      const subscriptions: Subscription[] = getters.subscriptions
      subscriptions.forEach(s => s.unsubscribe())
      const listener: Listener = getters.listener
      if (listener) {listener.close()}
      // update state
      commit('subscriptions', [])
    },

    SET_CURRENT_HEIGHT({commit}, height) {
      commit('currentHeight', height)
    },

    async REST_FETCH_BLOCKS({commit, dispatch, getters, rootGetters}, blockHeights: number[]) {

      // - filter out known blocks
      const knownBlocks: {[h: number]: BlockInfo} = getters['knownBlocks']
      const unknownHeights = blockHeights.filter(height => !knownBlocks || !knownBlocks[height])
      const knownHeights = blockHeights.filter(height => knownBlocks && knownBlocks[height])

      // - initialize blocks list with known blocks
      let blocks: BlockInfo[] = knownHeights.map(known => knownBlocks[known])
      if (!unknownHeights.length) {
        return blocks
      }

      // - use block ranges helper to minimize number of requests (recent blocks first)
      const ranges: {start: number}[] = getBlockRanges(unknownHeights).reverse()

      try {
        // - prepare REST gateway connection
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const blockHttp = repositoryFactory.createBlockRepository()

        // - fetch blocks information per-range (wait 3 seconds every 4th block)
        ranges.slice(0, 3).map(({start}) => {
          blockHttp.getBlocksByHeightWithLimit(UInt64.fromUint(start), 100).subscribe(
            (infos: BlockInfo[]) => {
              infos.map(b => commit('addBlock', b))
              blocks = blocks.concat(infos)
            })
        })

        const nextHeights = ranges.slice(3).map(r => r.start)
        if (nextHeights.length) {
          setTimeout(() => {
            dispatch('diagnostic/ADD_DEBUG',
              'Store action network/REST_FETCH_BLOCKS delaying heights discovery for 2 seconds: ' + JSON.stringify(
                nextHeights), {root: true})
            return dispatch('REST_FETCH_BLOCKS', nextHeights)
          }, 2000)
        }
      } catch (e) {
        dispatch('diagnostic/ADD_ERROR',
          'An error happened while trying to fetch blocks information: ' + e, {root: true})
        return false
      }
    },
  },
}
