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
import {AccountInfo, Address, AggregateTransaction, CosignatureSignedTransaction, IListener, MultisigAccountInfo, NetworkType, QueryParams, RepositoryFactory, SignedTransaction, Transaction, TransactionType} from 'symbol-sdk'
import {of, Subscription} from 'rxjs'
// internal dependencies
import {$eventBus} from '../events'
import {RESTService} from '@/services/RESTService'
import {AwaitLock} from './AwaitLock'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'
import {WalletModel} from '@/core/database/entities/WalletModel'
import {RESTDispatcher} from '@/core/utils/RESTDispatcher'
import {MultisigService} from '@/services/MultisigService'
import * as _ from 'lodash'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletService} from '@/services/WalletService'
import {catchError, map} from 'rxjs/operators'

/**
 * Helper to format transaction group in name of state variable.
 *
 * @internal
 * @param {string} group
 * @return {string} One of 'confirmedTransactions', 'unconfirmedTransactions' or
 *   'partialTransactions'
 */
const transactionGroupToStateVariable = (
  group: string,
): string => {
  let transactionGroup = group.toLowerCase()
  if (transactionGroup === 'unconfirmed'
    || transactionGroup === 'confirmed'
    || transactionGroup === 'partial') {
    transactionGroup = transactionGroup + 'Transactions'
  } else {
    throw new Error('Unknown transaction group \'' + group + '\'.')
  }

  return transactionGroup
}


/// region globals
const Lock = AwaitLock.create()
/// end-region globals

/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {
  listener: IListener
  subscriptions: Subscription[]
}

export type Signer = { label: string, publicKey: string, address: Address, multisig: boolean }

// wallet state typing
interface WalletState {
  initialized: boolean
  currentWallet: WalletModel
  currentWalletAddress: Address
  currentWalletMultisigInfo: MultisigAccountInfo
  isCosignatoryMode: boolean
  signers: Signer[]
  currentSigner: Signer
  currentSignerAddress: Address
  currentSignerMultisigInfo: MultisigAccountInfo
  // Known wallet database identifiers
  knownWallets: string[]
  knownAddresses: Address[]
  accountsInfo: AccountInfo[]
  multisigAccountsInfo: MultisigAccountInfo[]
  transactionHashes: string[]
  confirmedTransactions: Transaction[]
  unconfirmedTransactions: Transaction[]
  partialTransactions: Transaction[]
  stageOptions: { isAggregate: boolean, isMultisig: boolean }
  stagedTransactions: Transaction[]
  signedTransactions: SignedTransaction[]
  // Subscriptions to webSocket channels
  subscriptions: Record<string, SubscriptionType[][]>
}

// Wallet state initial definition
const walletState: WalletState = {
  initialized: false,
  currentWallet: null,
  currentWalletAddress: null,
  currentWalletMultisigInfo: null,
  isCosignatoryMode: false,
  signers: [],
  currentSigner: null,
  currentSignerAddress: null,
  currentSignerMultisigInfo: null,
  knownWallets: [],
  knownAddresses: [],
  accountsInfo: [],
  multisigAccountsInfo: [],
  transactionHashes: [],
  confirmedTransactions: [],
  unconfirmedTransactions: [],
  partialTransactions: [],
  stageOptions: {
    isAggregate: false,
    isMultisig: false,
  },
  stagedTransactions: [],
  signedTransactions: [],
  // Subscriptions to websocket channels.
  subscriptions: {},
}

/**
 * Wallet Store
 */
export default {
  namespaced: true,
  state: walletState,
  getters: {
    getInitialized: (state: WalletState) => state.initialized,
    currentWallet: (state: WalletState): WalletModel => {
      return state.currentWallet
    },
    signers: (state: WalletState): Signer[] => state.signers,
    currentSigner: (state: WalletState): Signer => state.currentSigner,
    currentWalletAddress: (state: WalletState) => state.currentWalletAddress,
    knownAddresses: (state: WalletState) => state.knownAddresses,
    currentWalletMultisigInfo: (state: WalletState) => state.currentWalletMultisigInfo,
    currentSignerMultisigInfo: (state: WalletState) => state.currentSignerMultisigInfo,
    isCosignatoryMode: (state: WalletState) => state.isCosignatoryMode,
    currentSignerAddress: (state: WalletState) => state.currentSignerAddress,
    knownWallets: (state: WalletState) => state.knownWallets,
    accountsInfo: (state: WalletState) => state.accountsInfo,
    multisigAccountsInfo: (state: WalletState) => state.multisigAccountsInfo,
    getSubscriptions: (state: WalletState) => state.subscriptions,
    transactionHashes: (state: WalletState) => state.transactionHashes,
    confirmedTransactions: (state: WalletState) => {
      return state.confirmedTransactions.sort((t1, t2) => {
        const info1 = t1.transactionInfo
        const info2 = t2.transactionInfo

        // - confirmed sorted by height then index
        const diffHeight = info1.height.compact() - info2.height.compact()
        const diffIndex = info1.index - info2.index
        return diffHeight !== 0 ? diffHeight : diffIndex
      })
    },
    unconfirmedTransactions: (state: WalletState) => {
      return state.unconfirmedTransactions.sort((t1, t2) => {
        // - unconfirmed/partial sorted by index
        return t1.transactionInfo.index - t2.transactionInfo.index
      })
    },
    partialTransactions: (state: WalletState) => {
      return state.partialTransactions.sort((t1, t2) => {
        // - unconfirmed/partial sorted by index
        return t1.transactionInfo.index - t2.transactionInfo.index
      })
    },
    stageOptions: (state: WalletState) => state.stageOptions,
    stagedTransactions: (state: WalletState) => state.stagedTransactions,
    signedTransactions: (state: WalletState) => state.signedTransactions,
  },
  mutations: {
    setInitialized: (state: WalletState, initialized: boolean) => { state.initialized = initialized },
    currentWallet: (state: WalletState, walletModel: WalletModel) => Vue.set(state, 'currentWallet',
      walletModel),
    currentWalletAddress: (state: WalletState, walletAddress: Address) => Vue.set(state,
      'currentWalletAddress', walletAddress),
    currentSigner: (state: WalletState, currentSigner: Signer) => Vue.set(state, 'currentSigner',
      currentSigner),
    signers: (state: WalletState, signers: Signer[]) => Vue.set(state, 'signers', signers),
    currentSignerAddress: (state: WalletState, signerAddress) => Vue.set(state,
      'currentSignerAddress', signerAddress),
    knownWallets: (state: WalletState, wallets) => Vue.set(state, 'knownWallets', wallets),
    knownAddresses: (state: WalletState, knownAddresses: Address[]) => Vue.set(state,
      'knownAddresses', knownAddresses),
    isCosignatoryMode: (state: WalletState, mode: boolean) => Vue.set(state, 'isCosignatoryMode',
      mode),
    accountsInfo: (state: WalletState, accountsInfo) => Vue.set(state, 'accountsInfo',
      accountsInfo),
    multisigAccountsInfo: (state: WalletState, multisigAccountsInfo) => Vue.set(state,
      'multisigAccountsInfo', multisigAccountsInfo),
    currentWalletMultisigInfo: (state: WalletState, currentWalletMultisigInfo) => Vue.set(state,
      'currentWalletMultisigInfo', currentWalletMultisigInfo),
    currentSignerMultisigInfo: (state: WalletState, currentSignerMultisigInfo) => Vue.set(state,
      'currentSignerMultisigInfo', currentSignerMultisigInfo),
    transactionHashes: (state: WalletState, hashes) => Vue.set(state, 'transactionHashes', hashes),
    confirmedTransactions: (state: WalletState, transactions) => Vue.set(state,
      'confirmedTransactions', transactions),
    unconfirmedTransactions: (state: WalletState, transactions) => Vue.set(state,
      'unconfirmedTransactions', transactions),
    partialTransactions: (state: WalletState, transactions) => Vue.set(state, 'partialTransactions',
      transactions),
    setSubscriptions: (state: WalletState, data) => Vue.set(state, 'subscriptions', data),
    addSubscriptions: (state: WalletState,
      payload: { address: string, subscriptions: SubscriptionType }) => {
      const {address, subscriptions} = payload
      // skip when subscriptions is an empty array
      if (!subscriptions.subscriptions.length) return
      // get current subscriptions from state
      const oldSubscriptions = state.subscriptions[address] || []
      // update subscriptions
      const newSubscriptions = [ ...oldSubscriptions, subscriptions ]
      // update state
      Vue.set(state.subscriptions, address, newSubscriptions)
    },

    stageOptions: (state: WalletState, options) => Vue.set(state, 'stageOptions', options),
    setStagedTransactions: (state: WalletState, transactions: Transaction[]) => Vue.set(state,
      'stagedTransactions', transactions),
    addStagedTransaction: (state: WalletState, transaction: Transaction) => {
      // - get previously staged transactions
      const staged = state.stagedTransactions

      // - push transaction on stage (order matters)
      staged.push(transaction)

      // - update state
      return Vue.set(state, 'stagedTransactions', staged)
    },
    clearStagedTransaction: (state) => Vue.set(state, 'stagedTransactions', []),
    addSignedTransaction: (state: WalletState, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions

      // - update state
      signed.push(transaction)
      return Vue.set(state, 'signedTransactions', signed)
    },
    removeSignedTransaction: (state: WalletState, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions

      // - find transaction by hash and delete
      const idx = signed.findIndex(tx => tx.hash === transaction.hash)
      if (undefined === idx) {
        return
      }

      // skip `idx`
      const remaining = signed.splice(0, idx).concat(
        signed.splice(idx + 1, signed.length - idx - 1),
      )

      // - use Array.from to reset indexes
      return Vue.set(state, 'signedTransactions', Array.from(remaining))
    },
  },
  actions: {
    /**
     * Possible `options` values include:
     * @type {
     *    skipTransactions: boolean,
     * }
     */
    async initialize({commit, dispatch, getters}, {address}) {
      const callback = async () => {
        if (!address || !address.length) {
          return
        }
        // open websocket connections
        dispatch('SUBSCRIBE', address)
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({commit, dispatch, getters}, {address, which}) {
      const callback = async () => {
        // close websocket connections
        await dispatch('UNSUBSCRIBE', address)
        await dispatch('RESET_BALANCES', which)
        await dispatch('RESET_MULTISIG')
        await dispatch('RESET_TRANSACTIONS')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    async REST_FETCH_WALLET_DETAILS({dispatch}, {address, options}) {
      const dispatcher = new RESTDispatcher(dispatch)


      if (!options || !options.skipTransactions) {
        dispatcher.add('REST_FETCH_TRANSACTIONS', {
          group: 'confirmed',
          pageSize: 100,
          address: address,
        })
      }
      // - delays of 1000ms will be added every second request
      dispatcher.throttle_dispatch()
    },
    /**
     * Possible `options` values include:
     * @type {
     *    isCosignatoryMode: boolean,
     * }
     */
    async SET_CURRENT_WALLET({commit, dispatch, getters}, currentWallet: WalletModel) {
      const previous: WalletModel = getters.currentWallet
      if (previous && previous.address === currentWallet.address) return

      const currentWalletAddress: Address = Address.createFromRawAddress(currentWallet.address)
      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/SET_CURRENT_WALLET dispatched with ' + currentWalletAddress.plain(),
        {root: true})

      // set current wallet
      commit('currentWallet', currentWallet)


      // reset current signer
      await dispatch('SET_CURRENT_SIGNER', {publicKey: currentWallet.publicKey})
      await dispatch('initialize', {address: currentWalletAddress.plain()})
      $eventBus.$emit('onWalletChange', currentWalletAddress.plain())
    },

    async RESET_CURRENT_WALLET({commit, dispatch}) {
      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/RESET_CURRENT_WALLET dispatched', {root: true})
      commit('currentWallet', null)
      commit('currentWalletAddress', null)
    },

    async SET_CURRENT_SIGNER({commit, dispatch, getters, rootGetters},
      {publicKey}: { publicKey: string }) {
      const networkType: NetworkType = rootGetters['network/networkType']
      const currentAccount: AccountModel = rootGetters['account/currentAccount']
      const currentWallet: WalletModel = getters.currentWallet
      const previousSignerAddress: Address = getters.currentSignerAddress
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory

      const currentSignerAddress: Address = Address.createFromPublicKey(publicKey, networkType)

      if (previousSignerAddress && previousSignerAddress.equals(currentSignerAddress)) return

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/SET_CURRENT_SIGNER dispatched with ' + currentSignerAddress.plain(),
        {root: true})

      const currentWalletAddress = Address.createFromRawAddress(currentWallet.address)
      const walletService = new WalletService()
      const knownWallets = walletService.getKnownWallets(currentAccount.wallets)
      const knownAddresses = _.uniqBy([ currentSignerAddress,
        ...knownWallets.map(w => Address.createFromRawAddress(w.address)) ].filter(a => a),
      'address')
      const accountsInfo = await repositoryFactory.createAccountRepository()
        .getAccountsInfo(knownAddresses).toPromise()
      const multisigAccountsInfo: MultisigAccountInfo[] =
        await repositoryFactory.createMultisigRepository()
          .getMultisigAccountGraphInfo(currentWalletAddress).pipe(map(g => {
            return MultisigService.getMultisigInfoFromMultisigGraphInfo(g)
          }), catchError(() => {
            return of([])
          })).toPromise()

      const currentWalletMultisigInfo = multisigAccountsInfo.find(
        m => m.account.address.equals(currentWalletAddress))
      const currentSignerMultisigInfo = multisigAccountsInfo.find(
        m => m.account.address.equals(currentSignerAddress))
      const multisigService = new MultisigService()
      const signers = multisigService.getSigners(networkType, knownWallets, currentWallet,
        currentWalletMultisigInfo)

      commit('currentSignerAddress', currentSignerAddress)
      commit('currentWalletAddress', currentWalletAddress)
      commit('isCosignatoryMode', !currentSignerAddress.equals(currentWalletAddress))
      commit('currentSigner', signers.find(s => s.address.equals(currentSignerAddress)))
      commit('signers', signers)
      commit('knownWallets', currentAccount.wallets)
      commit('knownAddresses', knownAddresses)
      commit('accountsInfo', accountsInfo)
      commit('multisigAccountsInfo', multisigAccountsInfo)
      commit('currentWalletMultisigInfo', currentWalletMultisigInfo)
      commit('currentSignerMultisigInfo', currentSignerMultisigInfo)


      // setting current signer should not fetch ALL data
      await dispatch('REST_FETCH_WALLET_DETAILS', {
        address: currentSignerAddress.plain(), options: {
          skipTransactions: true,
        },
      })

      dispatch('namespace/SIGNER_CHANGED', {}, {root: true})
      dispatch('mosaic/SIGNER_CHANGED', {}, {root: true})
    },

    SET_KNOWN_WALLETS({commit}, wallets: string[]) {
      commit('knownWallets', wallets)
    },

    RESET_TRANSACTIONS({commit}) {
      commit('confirmedTransactions', [])
      commit('unconfirmedTransactions', [])
      commit('partialTransactions', [])
    },

    ADD_COSIGNATURE({commit, getters}, cosignatureMessage) {
      if (!cosignatureMessage || !cosignatureMessage.parentHash) {
        throw Error('Missing mandatory field \'parentHash\' for action wallet/ADD_COSIGNATURE.')
      }

      const transactions = getters['partialTransactions']

      // return if no transactions
      if (!transactions.length) return

      const index = transactions.findIndex(
        t => t.transactionInfo.hash === cosignatureMessage.parentHash)

      // partial tx unknown, @TODO: handle this case (fetch partials)
      if (index === -1) return

      transactions[index] = transactions[index].addCosignatures(cosignatureMessage)
      commit('partialTransactions', transactions)
    },

    ADD_TRANSACTION({commit, getters}, transactionMessage) {
      if (!transactionMessage || !transactionMessage.group) {
        throw Error('Missing mandatory field \'group\' for action wallet/ADD_TRANSACTION.')
      }

      // format transactionGroup to store variable name
      const transactionGroup = transactionGroupToStateVariable(transactionMessage.group)

      // if transaction hash is known, do nothing
      const hashes = getters['transactionHashes']
      const transaction = transactionMessage.transaction
      const findIterator = hashes.find(hash => hash === transaction.transactionInfo.hash)

      // register transaction
      const transactions = getters[transactionGroup]
      const findTx = transactions.find(
        t => t.transactionInfo.hash === transaction.transactionInfo.hash)
      if (findTx === undefined) {
        transactions.push(transaction)
      }

      if (findIterator === undefined) {
        hashes.push(transaction.transactionInfo.hash)
      }

      // update state
      commit(transactionGroup, transactions)
      return commit('transactionHashes', hashes)
    },
    REMOVE_TRANSACTION({commit, getters}, transactionMessage) {

      if (!transactionMessage || !transactionMessage.group) {
        throw Error('Missing mandatory field \'group\' for action wallet/removeTransaction.')
      }

      // format transactionGroup to store variable name
      const transactionGroup = transactionGroupToStateVariable(transactionMessage.group)

      // read from store
      const transactions = getters[transactionGroup]

      // prepare search
      const transactionHash = transactionMessage.transaction

      // find transaction in storage
      const findIterator = transactions.findIndex(tx => tx.transactionInfo.hash === transactionHash)
      if (findIterator === undefined) {
        return // not found, do nothing
      }

      // commit empty array
      if (transactions.length === 1) {
        return commit(transactionGroup, [])
      }

      // skip `idx`
      const remaining = transactions.splice(0, findIterator).concat(
        transactions.splice(findIterator + 1, transactions.length - findIterator - 1),
      )

      commit(transactionGroup, Array.from(remaining))
    },
    ADD_STAGED_TRANSACTION({commit}, stagedTransaction: Transaction) {
      commit('addStagedTransaction', stagedTransaction)
    },
    CLEAR_STAGED_TRANSACTIONS({commit}) {
      commit('clearStagedTransaction')
    },
    RESET_TRANSACTION_STAGE({commit}) {
      commit('setStagedTransactions', [])
    },
    /**
     * Websocket API
     */
    // Subscribe to latest account transactions.
    async SUBSCRIBE({commit, dispatch, rootGetters}, address) {
      if (!address || !address.length) {
        return
      }

      // use RESTService to open websocket channel subscriptions
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const subscriptions: SubscriptionType = await RESTService.subscribeTransactionChannels(
        {commit, dispatch},
        repositoryFactory,
        address,
      )

      // update state of listeners & subscriptions
      commit('addSubscriptions', {address, subscriptions})
    },

    // Unsubscribe from all open websocket connections
    async UNSUBSCRIBE({dispatch, getters}, address) {
      const subscriptions = getters.getSubscriptions
      const currentWallet = getters.currentWallet

      if (!address) {
        address = currentWallet.address
      }

      const subsByAddress = subscriptions && subscriptions[address] ? subscriptions[address] : []
      for (let i = 0, m = subsByAddress.length; i < m; i ++) {
        const subscription = subsByAddress[i]

        // subscribers
        for (let j = 0, n = subscription.subscriptions; j < n; j ++) {
          await subscription.subscriptions[j].unsubscribe()
        }

        await subscription.listener.close()
      }

      // update state
      dispatch('RESET_SUBSCRIPTIONS', address)
    },
    /**
     * REST API
     */
    async REST_FETCH_TRANSACTIONS({dispatch, rootGetters},
      {group, address, id}) {
      dispatch('app/SET_FETCHING_TRANSACTIONS', true, {root: true})

      if (!group || ![ 'partial', 'unconfirmed', 'confirmed' ].includes(group)) {
        group = 'confirmed'
      }

      if (!address || address.length !== 40) {
        return
      }

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_FETCH_TRANSACTIONS dispatched with : ' + JSON.stringify({
          address: address,
          group,
        }), {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const queryParams = new QueryParams({pageSize: 100, id})
        const addressObject = Address.createFromRawAddress(address)

        // fetch transactions from REST gateway
        const accountHttp = repositoryFactory.createAccountRepository()
        let transactions: Transaction[] = []
        const blockHeights: number[] = []

        if ('confirmed' === group) {
          transactions = await accountHttp.getAccountTransactions(addressObject, queryParams)
            .toPromise()
          // - record block height to be fetched
          transactions.map(
            transaction => blockHeights.push(transaction.transactionInfo.height.compact()))
        } else if ('unconfirmed' === group) {
          transactions = await accountHttp.getAccountUnconfirmedTransactions(addressObject,
            queryParams).toPromise()
        } else if ('partial' === group) {
          transactions = await accountHttp.getAccountPartialTransactions(addressObject, queryParams)
            .toPromise()
        }

        dispatch('diagnostic/ADD_DEBUG',
          'Store action wallet/REST_FETCH_TRANSACTIONS numTransactions: ' + transactions.length,
          {root: true})

        // update store
        for (let i = 0, m = transactions.length; i < m; i ++) {
          const transaction = transactions[i]
          await dispatch('ADD_TRANSACTION', {address, group, transaction})
        }

        // fetch block information if necessary
        if (blockHeights.length) {
          // - non-blocking
          dispatch('network/REST_FETCH_BLOCKS', blockHeights, {root: true})
        }

        return transactions
      } catch (e) {
        dispatch('diagnostic/ADD_ERROR',
          'An error happened while trying to fetch transactions: ' + e, {root: true})
        return false
      } finally {
        dispatch('app/SET_FETCHING_TRANSACTIONS', false, {root: true})
      }
    },


    async REST_ANNOUNCE_PARTIAL(
      {commit, dispatch, rootGetters},
      {issuer, signedLock, signedPartial},
    ): Promise<BroadcastResult> {

      if (!issuer || issuer.length !== 40) {
        return
      }

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_ANNOUNCE_PARTIAL dispatched with: ' + JSON.stringify({
          issuer: issuer,
          signedLockHash: signedLock.hash,
          signedPartialHash: signedPartial.hash,
        }), {root: true})

      try {
        // - prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // - prepare scoped *confirmation listener*
        const listener = repositoryFactory.createListener()
        await listener.open()


        // - announce hash lock transaction and await confirmation
        transactionHttp.announce(signedLock)

        // - listen for hash lock confirmation
        return new Promise((resolve, reject) => {
          const address = Address.createFromRawAddress(issuer)
          return listener.confirmed(address).subscribe(
            async () => {
              // - hash lock confirmed, now announce partial
              await transactionHttp.announceAggregateBonded(signedPartial)
              commit('removeSignedTransaction', signedLock)
              commit('removeSignedTransaction', signedPartial)
              return resolve(new BroadcastResult(signedPartial, true))
            },
            () => {
              commit('removeSignedTransaction', signedLock)
              commit('removeSignedTransaction', signedPartial)
              reject(new BroadcastResult(signedPartial, false))
            },
          )
        })
      } catch (e) {
        return new BroadcastResult(signedPartial, false, e.toString())
      }
    },
    async REST_ANNOUNCE_TRANSACTION(
      {commit, dispatch, rootGetters},
      signedTransaction: SignedTransaction,
    ): Promise<BroadcastResult> {
      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_ANNOUNCE_TRANSACTION dispatched with: ' + JSON.stringify({
          hash: signedTransaction.hash,
          payload: signedTransaction.payload,
        }), {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // prepare symbol-sdk TransactionService
        await transactionHttp.announce(signedTransaction)
        commit('removeSignedTransaction', signedTransaction)
        return new BroadcastResult(signedTransaction, true)
      } catch (e) {
        commit('removeSignedTransaction', signedTransaction)
        return new BroadcastResult(signedTransaction, false, e.toString())
      }
    },
    async REST_ANNOUNCE_COSIGNATURE({dispatch, rootGetters}, cosignature: CosignatureSignedTransaction):
    Promise<BroadcastResult> {

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_ANNOUNCE_COSIGNATURE dispatched with: ' + JSON.stringify({
          hash: cosignature.parentHash,
          signature: cosignature.signature,
          signerPublicKey: cosignature.signerPublicKey,
        }), {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // prepare symbol-sdk TransactionService
        await transactionHttp.announceAggregateBondedCosignature(cosignature)
        return new BroadcastResult(cosignature, true)
      } catch (e) {
        return new BroadcastResult(cosignature, false, e.toString())
      }
    },
    ON_NEW_TRANSACTION({dispatch, rootGetters}, transaction: Transaction): void {
      if (!transaction) return

      // get current wallet address from store
      const address: Address = rootGetters['wallet/currentWalletAddress']
      if (!address) return
      const plainAddress = address.plain()

      // instantiate a dispatcher
      const dispatcher = new RESTDispatcher(dispatch)


      // extract transaction types from the transaction
      const transactionTypes: TransactionType[] = _.uniq(transaction instanceof AggregateTransaction
        ? transaction.innerTransactions
          .map(({type}) => type)
        : [transaction.type])

      // add actions to the dispatcher according to the transaction types
      if ([
        TransactionType.NAMESPACE_REGISTRATION,
        TransactionType.MOSAIC_ALIAS,
        TransactionType.ADDRESS_ALIAS,
      ].some(a => transactionTypes.some(b => b === a))) {
        dispatch('namespace/LOAD_NAMESPACES', {}, {root: true})
      }
      if ([
        TransactionType.MOSAIC_DEFINITION,
        TransactionType.MOSAIC_SUPPLY_CHANGE,
      ].some(a => transactionTypes.some(b => b === a))) {
        dispatch('mosaic/LOAD_MOSAICS', {}, {root: true})
      }

      if (transactionTypes.includes(TransactionType.MULTISIG_ACCOUNT_MODIFICATION)) {
        dispatcher.add('REST_FETCH_MULTISIG', plainAddress)
      }

      // dispatch actions
      dispatcher.throttle_dispatch()
    },
    /// end-region scoped actions
  },
}
