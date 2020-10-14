/*
 * Copyright 2020 NEM Foundation (https://nem.io)
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
//external dependencies
import {
  Address,
  AggregateTransaction,
  CosignatureSignedTransaction,
  RepositoryFactory,
  Transaction,
  TransactionType,
  PublicAccount,
  AggregateTransactionCosignature,
  TransactionGroup,
  Page,
  TransactionStatus,
  Order,
} from 'symbol-sdk'
import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'

// internal dependencies
import { AwaitLock } from './AwaitLock'

const Lock = AwaitLock.create()

export enum TransactionGroupState {
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
  partial = 'partial',
  all = 'all',
}

/**
 * Helper to format transaction group in name of state variable.
 *
 * @internal
 * @param {string} group
 * @return {string} One of 'confirmedTransactions', 'unconfirmedTransactions' or
 *   'partialTransactions'
 */
const transactionGroupToStateVariable = (group: TransactionGroupState): string => {
  return group + 'Transactions'
}

const transactionComparator = (t1, t2) => {
  // - unconfirmed/partial sorted by index
  return t1.transactionInfo.index - t2.transactionInfo.index
}
const confirmedTransactionComparator = (t1, t2) => {
  const info1 = t1.transactionInfo
  const info2 = t2.transactionInfo
  // - confirmed sorted by height then index
  const diffHeight = info2.height.compact() - info1.height.compact()
  const diffIndex = info1.index - info2.index
  return diffHeight !== 0 ? diffHeight : diffIndex
}

function conditionalSort<T>(array: T[] | undefined, comparator: (a: T, b: T) => number): T[] | undefined {
  if (!array) {
    return array
  }
  return array.sort(comparator)
}

export interface PageInfo {
  pageNumber: number
  isLastPage: boolean
}
interface TransactionState {
  initialized: boolean
  isFetchingTransactions: boolean
  confirmedTransactions: Transaction[]
  unconfirmedTransactions: Transaction[]
  partialTransactions: Transaction[]
  displayedTransactionStatus: TransactionGroupState
  currentConfirmedPage: PageInfo
}

const transactionState: TransactionState = {
  initialized: false,
  isFetchingTransactions: false,
  confirmedTransactions: [],
  unconfirmedTransactions: [],
  partialTransactions: [],
  displayedTransactionStatus: TransactionGroupState.all,
  currentConfirmedPage: { pageNumber: 1, isLastPage: false },
}
export default {
  namespaced: true,
  state: transactionState,
  getters: {
    getInitialized: (state: TransactionState) => state.initialized,
    isFetchingTransactions: (state: TransactionState) => state.isFetchingTransactions,
    confirmedTransactions: (state: TransactionState) => state.confirmedTransactions,
    unconfirmedTransactions: (state: TransactionState) => state.unconfirmedTransactions,
    partialTransactions: (state: TransactionState) => state.partialTransactions,
    displayedTransactionStatus: (state: TransactionState) => state.displayedTransactionStatus,
    currentConfirmedPage: (state: TransactionState) => state.currentConfirmedPage,
  },
  mutations: {
    setInitialized: (state: TransactionState, initialized: boolean) => {
      state.initialized = initialized
    },
    isFetchingTransactions: (state: TransactionState, isFetchingTransactions: boolean) => {
      state.isFetchingTransactions = isFetchingTransactions
    },
    confirmedTransactions: (
      state: TransactionState,
      { transactions, refresh, pageInfo }: { transactions: Transaction[]; refresh: boolean; pageInfo: PageInfo },
    ) => {
      // if it's a refresh request then refresh the list, else concat the new items to the list
      if (refresh) {
        state.confirmedTransactions = conditionalSort(transactions, confirmedTransactionComparator)
      } else {
        state.confirmedTransactions = conditionalSort(
          state.confirmedTransactions.concat(transactions),
          confirmedTransactionComparator,
        )
      }
      state.currentConfirmedPage = pageInfo
    },
    unconfirmedTransactions: (
      state: TransactionState,
      { transactions }: { transactions: Transaction[]; refresh: boolean; pageInfo: PageInfo },
    ) => {
      state.unconfirmedTransactions = conditionalSort(transactions, transactionComparator)
    },
    partialTransactions: (
      state: TransactionState,
      { transactions }: { transactions: Transaction[]; refresh: boolean; pageInfo: PageInfo },
    ) => {
      state.partialTransactions = conditionalSort(transactions, transactionComparator)
    },
    setDisplayedTransactionStatus: (state: TransactionState, displayedTransactionStatus: TransactionGroupState) => {
      state.displayedTransactionStatus = displayedTransactionStatus
    },
  },
  actions: {
    async initialize({ commit, getters }) {
      const callback = async () => {
        // Placeholder for initialization if necessary.
        commit('setInitialized', true)
      }
      // aquire async lock until initialized
      await Lock.initialize(callback, { getters })
    },

    async uninitialize({ commit, getters, dispatch }) {
      const callback = async () => {
        await dispatch('RESET_TRANSACTIONS')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, { getters })
    },

    LOAD_TRANSACTIONS(
      { commit, rootGetters },
      { group, pageSize, pageNumber }: { group: TransactionGroupState; pageSize: number; pageNumber: number } = {
        group: TransactionGroupState.all,
        pageSize: 20,
        pageNumber: 1,
      },
    ) {
      const currentSignerAddress: Address = rootGetters['account/currentSignerAddress']
      if (!currentSignerAddress) {
        return
      }
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const transactionRepository = repositoryFactory.createTransactionRepository()
      const subscribeTransactions = (
        group: TransactionGroupState,
        transactionCall: Observable<Page<Transaction>>,
      ): Observable<Transaction[]> => {
        const attributeName = transactionGroupToStateVariable(group)
        //commit(attributeName, [])
        return transactionCall.pipe(
          map((transactionsPage) => {
            commit(attributeName, {
              transactions: transactionsPage.data || [],
              refresh: transactionsPage.pageNumber === 1,
              pageInfo: {
                pageNumber: transactionsPage.pageNumber,
                isLastPage: transactionsPage.isLastPage,
              },
            })
            return transactionsPage.data
          }),
        )
      }

      const subscriptions: Observable<Transaction[]>[] = []
      commit('isFetchingTransactions', true)

      if (group == undefined || group === TransactionGroupState.all || group === TransactionGroupState.confirmed) {
        subscriptions.push(
          subscribeTransactions(
            TransactionGroupState.confirmed,
            transactionRepository.search({
              group: TransactionGroup.Confirmed,
              address: currentSignerAddress,
              pageSize,
              pageNumber,
              order: Order.Desc,
            }),
          ),
        )
      }

      // all of the unconfirmed+partial transactions goes in the first page and they are not subject to pagination
      if (pageNumber === 1) {
        if (group == undefined || group === TransactionGroupState.all || group === TransactionGroupState.unconfirmed) {
          subscriptions.push(
            subscribeTransactions(
              TransactionGroupState.unconfirmed,
              transactionRepository.search({
                group: TransactionGroup.Unconfirmed,
                address: currentSignerAddress,
                pageSize: 100,
                pageNumber: 1, // not paginating
              }),
            ),
          )
        }

        if (group == undefined || group === TransactionGroupState.all || group === TransactionGroupState.partial) {
          subscriptions.push(
            subscribeTransactions(
              TransactionGroupState.partial,
              transactionRepository.search({
                group: TransactionGroup.Partial,
                address: currentSignerAddress,
                pageSize: 100,
                pageNumber: 1, // not paginating
              }),
            ),
          )
        }
      }

      combineLatest(subscriptions).subscribe({
        complete: () => commit('isFetchingTransactions', false),
      })
    },

    LOAD_TRANSACTION_DETAILS(
      { rootGetters },
      { group, transactionHash }: { group: TransactionGroupState; transactionHash: string },
    ): Promise<Transaction | AggregateTransaction> {
      if (!group) {
        throw Error("Missing mandatory field 'group' for action transaction/LOAD_TRANSACTION_DETAILS.")
      }

      if (!transactionHash) {
        throw Error("Missing mandatory field 'transactionHash' for action transaction/LOAD_TRANSACTION_DETAILS.")
      }

      // prepare
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const transactionRepository = repositoryFactory.createTransactionRepository()

      let sdkGroup = TransactionGroup.Confirmed
      if (![TransactionGroupState.all, TransactionGroupState.confirmed].includes(group)) {
        sdkGroup = group === TransactionGroupState.partial ? TransactionGroup.Partial : TransactionGroup.Unconfirmed
      }

      // fetch transaction details
      return transactionRepository.getTransaction(transactionHash, sdkGroup).toPromise()
    },

    FETCH_TRANSACTION_STATUS(
      { rootGetters },
      { transactionHash }: { transactionHash: string },
    ): Promise<Transaction | TransactionStatus> {
      if (!transactionHash) {
        throw Error("Missing mandatory field 'transactionHash' for action transaction/FETCH_TRANSACTION_STATUS.")
      }

      // prepare
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const transactionStatusRepository = repositoryFactory.createTransactionStatusRepository()

      // fetch transaction status
      return transactionStatusRepository.getTransactionStatus(transactionHash).toPromise()
    },

    SIGNER_CHANGED({ dispatch }) {
      dispatch('LOAD_TRANSACTIONS')
    },

    RESET_TRANSACTIONS({ commit }) {
      Object.keys(TransactionGroupState).forEach((group: TransactionGroupState) => {
        if (group !== TransactionGroupState.all) {
          commit(transactionGroupToStateVariable(group), {
            transactions: [],
            pageInfo: { pageNumber: 1, isLastPage: false },
          })
        }
      })
    },

    ADD_TRANSACTION(
      { commit, getters },
      { group, transaction }: { group: TransactionGroupState; transaction: Transaction },
    ) {
      if (!group) {
        throw Error("Missing mandatory field 'group' for action transaction/ADD_TRANSACTION.")
      }

      if (!transaction) {
        throw Error("Missing mandatory field 'transaction' for action transaction/ADD_TRANSACTION.")
      }
      // format transactionAttribute to store variable name
      const transactionAttribute = transactionGroupToStateVariable(group)

      // register transaction
      const transactions = getters[transactionAttribute] || []
      if (!transactions.find((t) => t.transactionInfo.hash === transaction.transactionInfo.hash)) {
        // update state
        commit(transactionAttribute, {
          transactions: [transaction, ...transactions],
          refresh: true,
          pageInfo: getters['currentConfirmedPage'],
        })
      }
    },

    REMOVE_TRANSACTION(
      { commit, getters },
      { group, transactionHash }: { group: TransactionGroupState; transactionHash: string },
    ) {
      if (!group) {
        throw Error("Missing mandatory field 'group' for action transaction/REMOVE_TRANSACTION.")
      }

      if (!transactionHash) {
        throw Error("Missing mandatory field 'transactionHash' for action transaction/REMOVE_TRANSACTION.")
      }
      // format transactionAttribute to store variable name
      const transactionAttribute = transactionGroupToStateVariable(group)

      // register transaction
      const transactions = getters[transactionAttribute] || []
      commit(transactionAttribute, {
        transactions: transactions.filter((t) => t.transactionInfo.hash !== transactionHash),
        refresh: true,
        pageInfo: getters['currentConfirmedPage'],
      })
    },

    async ON_NEW_TRANSACTION({ dispatch }, transaction: Transaction) {
      if (!transaction) return

      // extract transaction types from the transaction
      const transactionTypes: TransactionType[] = _.uniq(
        transaction instanceof AggregateTransaction
          ? transaction.innerTransactions.map(({ type }) => type)
          : [transaction.type],
      )

      // add actions to the dispatcher according to the transaction types
      if (
        [
          TransactionType.NAMESPACE_REGISTRATION,
          TransactionType.MOSAIC_ALIAS,
          TransactionType.ADDRESS_ALIAS,
        ].some((a) => transactionTypes.some((b) => b === a))
      ) {
        dispatch('namespace/LOAD_NAMESPACES', {}, { root: true })
      }
      // Reloading Balances
      await dispatch('account/LOAD_ACCOUNT_INFO', {}, { root: true })
      dispatch('mosaic/LOAD_MOSAICS', {}, { root: true })
    },
    /// end-region scoped actions

    ADD_COSIGNATURE({ commit, getters, rootGetters }, transaction: CosignatureSignedTransaction) {
      if (!transaction || !transaction.parentHash) {
        throw Error("Missing mandatory field 'parentHash' for action transaction/ADD_COSIGNATURE.")
      }
      const transactionAttribute = transactionGroupToStateVariable(TransactionGroupState.partial)
      const transactions: AggregateTransaction[] = getters[transactionAttribute] || []

      // return if no transactions
      if (!transactions.length) return

      const index = transactions.findIndex((t) => t.transactionInfo.hash === transaction.parentHash)

      // partial tx unknown, @TODO: handle this case (fetch partials)
      if (index === -1) return

      // convert CosignatureSignedTransaction to AggregateTransactionCosignature
      const generationHash = rootGetters['network/generationHash']
      const cosigner = PublicAccount.createFromPublicKey(transaction.signerPublicKey, generationHash)
      const cosignature = new AggregateTransactionCosignature(transaction.signature, cosigner)

      // update the partial transaction cosignatures
      transactions[index] = transactions[index].addCosignatures([cosignature])
      commit('partialTransactions', transactions)
    },
  },
}
