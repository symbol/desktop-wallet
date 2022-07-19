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
import AddCosignatoryInput from '@/components/AddCosignatoryInput/AddCosignatoryInput.vue';
import { AddCosignatoryInputTs } from '@/components/AddCosignatoryInput/AddCosignatoryInputTs';
import { AddressValidator } from '@/core/validation/validators';
import i18n from '@/language/index';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { createLocalVue, mount } from '@vue/test-utils';
import { Address, NetworkType } from 'symbol-sdk';
import { extend, ValidationProvider } from 'vee-validate';
import VueI18n, { Values } from 'vue-i18n';
import Vuex from 'vuex';

extend('addressOrPublicKey', {
    validate: (value) => {
        return AddressValidator.validate(value);
    },
    message: (_, values: Values) => `${i18n.t('address_not_valid', values)}`,
});

describe('components/AddCosignatoryInput', () => {
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

    const getAddCosignatoryInputWrapper = () => {
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
            propsData: {},
            stubs: ['Tooltip'],
            sync: false,
        };
        const wrapper = mount(AddCosignatoryInput, options);
        return wrapper;
    };

    test('renders component', async () => {
        // Arrange + Act:
        const wrapper = getAddCosignatoryInputWrapper();

        // Assert:
        expect(wrapper.find('input[type="text"]')).toBeDefined();
    });

    test('a valid address added', async () => {
        // Arrange:
        const address = Address.createFromRawAddress(WalletsModel1.address);

        // Act:
        const wrapper = getAddCosignatoryInputWrapper();
        const component = wrapper.vm as AddCosignatoryInputTs;
        await wrapper.find('input[type="text"]').setValue(address.plain());
        // @ts-ignore for protected method access
        component.onAddCosignatory();
        await wrapper.vm.$nextTick();

        // Assert:
        expect(wrapper.emitted('added')[0][0]).toStrictEqual(address);
    });

    test('a valid public key added', async () => {
        // Arrange:
        const publicKey = WalletsModel1.publicKey;
        const address = Address.createFromRawAddress(WalletsModel1.address);

        // Act:
        const wrapper = getAddCosignatoryInputWrapper();
        const component = wrapper.vm as AddCosignatoryInputTs;
        await wrapper.find('input[type="text"]').setValue(publicKey);
        // @ts-ignore for protected method access
        component.onAddCosignatory();
        await wrapper.vm.$nextTick();

        // Assert:
        expect(wrapper.emitted('added')[0][0]).toStrictEqual(address);
    });

    test('an invalid public key added', async () => {
        // Arrange:
        const invalidPublicKey = WalletsModel1.publicKey.slice(0, -1);

        // Act:
        const wrapper = getAddCosignatoryInputWrapper();
        const component = wrapper.vm as AddCosignatoryInputTs;
        await wrapper.find('input[type="text"]').setValue(invalidPublicKey);
        wrapper.vm.$store.dispatch = jest.fn();
        // @ts-ignore for protected method access
        component.onAddCosignatory();
        await wrapper.vm.$nextTick();

        // Assert:
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('notification/ADD_ERROR', 'address_not_valid');
    });
});
