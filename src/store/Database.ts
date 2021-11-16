/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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
// internal dependencies
import { AwaitLock } from './AwaitLock';

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

export default {
    namespaced: true,
    state: {
        initialized: false,
    },
    getters: {
        getInitialized: (state) => state.initialized,
    },
    mutations: {
        setInitialized: (state, initialized) => {
            state.initialized = initialized;
        },
    },
    actions: {
        async initialize({ commit, getters }) {
            const callback = async () => {
                // MIGRATIONS COULD GO HERE!
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
    },
};
