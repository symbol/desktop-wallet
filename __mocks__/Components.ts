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
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { getStore } from '@MOCKS/Store';
import i18n from '@/language/index';
import clickOutsideDirective from '@/directives/clickOutside';

/// region globals
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.directive('click-outside', clickOutsideDirective);

/// end-region globals

/// region helpers
/**
 * Create and *shallow* mount a component injecting
 * store \a modules and \a state (namespaced).
 * @param component
 * @param modules
 * @param state
 */
export const getComponent = (
    component,
    storeModules: { [name: string]: any },
    stateChanges?: { [field: string]: any },
    propsData?: { [field: string]: any },
    stubsData?: { [field: string]: any },
    dispatch?: () => any,
    mocks?: { [field: string]: any },
    slots?: { [field: string]: any },
) => {
    const store = getStore(storeModules, stateChanges, dispatch);
    const params = {
        store,
        i18n,
        localVue,
        mocks,
        slots,
    };

    if (propsData && Object.keys(propsData).length) {
        params['propsData'] = propsData;
    }

    if (stubsData && Object.keys(stubsData).length) {
        params['stubs'] = stubsData;
    }

    // - mount component
    const wrapper = shallowMount(component, params);
    return wrapper;
};

/// end-region helpers
