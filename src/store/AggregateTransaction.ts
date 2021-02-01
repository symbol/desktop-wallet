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

import _ from 'lodash';
import { Component } from 'vue';

type AggregateTransactionState = {
    simpleAggregateTransaction: [];
    aggregateTransactionIndex: number;
};

const aggregateTransactionState: AggregateTransactionState = {
    simpleAggregateTransaction: [],
    aggregateTransactionIndex: 1,
};

/**
 * Aggregate Store
 */
export default {
    namespaced: true,
    state: aggregateTransactionState,
    getters: {
        simpleAggregateTransaction: (state: AggregateTransactionState) => state.simpleAggregateTransaction,
        aggregateTransactionIndex: (state: AggregateTransactionState) => state.aggregateTransactionIndex,
    },
    mutations: {
        simpleAggregateTransaction: (state: AggregateTransactionState, simpleAggregateTransaction: []) => {
            state.simpleAggregateTransaction = simpleAggregateTransaction;
        },
        aggregateTransactionIndex: (state: AggregateTransactionState, aggregateTransactionIndex: number) => {
            state.aggregateTransactionIndex = aggregateTransactionIndex;
        },
    },
    actions: {
        ON_SAVE_TRANSACTION({ commit, getters }, transaction: { title: string; formItems: {}; component: Component }) {
            const transactionClone = _.cloneDeep(transaction);
            const transactions: { title: string; formItems: {} }[] = getters['simpleAggregateTransaction'];
            let transactionIndex = getters['aggregateTransactionIndex'];
            if (transactions.length == 0) {
                transactions.push(transactionClone);
                transactionIndex += 1;
                commit('aggregateTransactionIndex', transactionIndex);
            } else {
                const storedTransaction = transactions.find((tx) => tx.title === transaction.title);
                if (storedTransaction) {
                    storedTransaction.formItems = transactionClone.formItems;
                } else {
                    transactions.push(transactionClone);
                    transactionIndex += 1;
                    commit('aggregateTransactionIndex', transactionIndex);
                }
            }
            commit('simpleAggregateTransaction', transactions);
        },
        ON_DELETE_TRANSACTION({ commit, getters }, title: string): void {
            let transactions = getters['simpleAggregateTransaction'];
            if (transactions.length !== 0) {
                transactions = transactions.filter((item) => item.title !== title);
                if (transactions.length == 0) {
                    commit('aggregateTransactionIndex', 1);
                }
            }
            commit('simpleAggregateTransaction', transactions);
        },
        GET_TRANSACTION_FROM_AGGREGATE_ARRAY({ getters }, title: string) {
            const transactions: { title: string }[] = getters['simpleAggregateTransaction'];
            const transaction = transactions.find((item) => item.title == title);
            if (transaction) {
                return _.cloneDeep(transaction);
            }
            return transaction;
        },
        CLEAR_AGGREGATE_TRANSACTIONS_LIST({ commit }) {
            commit('simpleAggregateTransaction', []);
            commit('aggregateTransactionIndex', 1);
        },
    },
};
