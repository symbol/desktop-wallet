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
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

/**
 * Create a fake store
 * @internal
 * @param {any} storeOptions
 * @param {any} dispatch
 * @param {boolean} doMockDispatch
 * @param {any} commit
 * @param {boolean} doMockCommit
 */
export const createStore = (storeOptions?: any, dispatch?: any, doMockDispatch = true, commit?: any, doMockCommit = true) => {
    const store = new Vuex.Store(storeOptions);
    if (doMockDispatch) {
        store.dispatch = dispatch ?? jest.fn();
    }
    if (doMockCommit) {
        store.commit = commit ?? jest.fn();
    }
    return store;
};

/**
 * Create a fake store with store changes
 * @internal
 * @param {any} storeModules
 * @param {any} stateChanges
 * @param {any} dispatch
 * @param {boolean} doMockDispatch
 * @param {any} commit
 * @param {boolean} doMockCommit
 */
export const getStore = (
    storeModules: { [name: string]: any },
    stateChanges?: { [field: string]: any },
    dispatch?: any,
    doMockDispatch = true,
    commit?: any,
    doMockCommit = true,
) => {
    // - format store module overwrites
    const modules = Object.keys(storeModules)
        .map((k) => ({
            [k]: Object.assign({}, storeModules[k], {
                // - map state overwrites to store module
                state: Object.assign({}, storeModules[k].state, stateChanges),
                // - map unmodified getters
                getters: storeModules[k].getters,
                mutations: storeModules[k].mutations,
                actions: storeModules[k].actions,
            }),
        }))
        .reduce((obj, item) => {
            // - reducer to get {profile: x, account: y} format
            const key = Object.keys(item).shift();
            obj[key] = item[key];
            return obj;
        }, {});

    // - create store
    return createStore({ modules }, dispatch, doMockDispatch, commit, doMockCommit);
};
