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
import AddressInput from '@/components/AddressInput/AddressInput.vue';
import { StandardValidationRules } from '@/core/validation/StandardValidationRules';
import i18n from '@/language/index';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { createLocalVue, mount } from '@vue/test-utils';
import { Address, NetworkType } from 'symbol-sdk';
import { ValidationProvider } from 'vee-validate';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

StandardValidationRules.register();

describe('components/AddressInput', () => {
    const networkType = NetworkType.TEST_NET;
    const mockNetworkStore = {
        namespaced: true,
        state: { networkType },
        getters: {
            networkType: (state) => {
                return state.networkType;
            },
        },
    };

    const getAddressInputWrapper = (value?: string, label?: string) => {
        const localVue = createLocalVue();
        localVue.component('ValidationProvider', ValidationProvider);
        localVue.use(Vuex);
        localVue.use(VueI18n);
        const store = new Vuex.Store({
            modules: {
                network: mockNetworkStore,
            },
        });
        const options = {
            localVue,
            i18n,
            store,
            propsData: { value, label },
            stubs: ['Tooltip'],
            sync: false,
        };
        const wrapper = mount(AddressInput, options);
        return wrapper;
    };

    test('renders component', async () => {
        // Arrange + Act:
        const wrapper = getAddressInputWrapper();

        // Assert:
        expect(wrapper.find('input[type="text"]')).toBeDefined();
    });

    test('value is emitted when set', async () => {
        // Arrange:
        const address = Address.createFromRawAddress(WalletsModel1.address);

        // Act:
        const wrapper = getAddressInputWrapper();
        wrapper.find('input[type="text"]').setValue(address.plain());

        // Assert:
        expect(wrapper.emitted('input')[0][0]).toBe(address.plain());
    });
});
