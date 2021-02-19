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
// internal dependencies
import app from '@/main';
import { AwaitLock } from './AwaitLock';
import { FilterHelpers } from '../core/utils/FilterHelpers';
import { TYPE } from 'vue-toastification';

const Lock = AwaitLock.create();

interface HistoryItem {
    level: 'success' | 'warning' | 'error' | 'info';
    message: string;
}

export default {
    namespaced: true,
    state: {
        initialized: false,
        history: new Array<HistoryItem>(),
    },
    getters: {
        getInitialized: (state) => state.initialized,
        history: (state) => state.history,
        lastNotification: (state) => state.history.pop(),
        successes: (state: { history: HistoryItem[] }) => {
            return state.history.filter((row) => row.level === 'success').map((log) => log.message);
        },
        warnings: (state: { history: HistoryItem[] }) => {
            return state.history.filter((row) => row.level === 'warning').map((log) => log.message);
        },
        errors: (state: { history: HistoryItem[] }) => {
            return state.history.filter((row) => row.level === 'error').map((log) => log.message);
        },
        infos: (state: { history: HistoryItem[] }) => {
            return state.history.filter((row) => row.level === 'info').map((log) => log.message);
        },
    },
    mutations: {
        setInitialized: (state, initialized) => {
            state.initialized = initialized;
        },
        add: (state, payload: HistoryItem) => {
            // strip tags to remove XSS vulnerability
            const level = payload.level || 'warning';
            const message = FilterHelpers.stripFilter(payload.message);
            const history = state.history;
            history.push({ level: level, message: message });
            Vue.set(state, 'history', history);

            /// region trigger notice UI
            app.$toast(app.$t(message), { type: level as TYPE, timeout: level === 'error' ? 6000 : undefined });
            /// end-region trigger notice UI
        },
    },
    actions: {
        async initialize({ commit, getters }) {
            const callback = async () => {
                // update store
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
        /// region scoped actions
        async ADD_SUCCESS({ commit, dispatch }, message) {
            commit('add', { level: 'success', message });
            dispatch('diagnostic/ADD_INFO', `Notification (Success): ${message}`, {
                root: true,
            });
        },
        async ADD_WARNING({ commit, dispatch }, message) {
            commit('add', { level: 'warning', message });
            dispatch('diagnostic/ADD_WARNING', `Notification (Warning): ${message}`, {
                root: true,
            });
        },
        async ADD_ERROR({ commit, dispatch }, message) {
            commit('add', { level: 'error', message });
            dispatch('diagnostic/ADD_ERROR', `Notification (Error): ${message}`, {
                root: true,
            });
        },
        async ADD_INFO({ commit, dispatch }, message) {
            commit('add', { level: 'info', message });
            dispatch('diagnostic/ADD_INFO', `Notification (Info): ${message}`, {
                root: true,
            });
        },
        /// end-region scoped actions
    },
};
