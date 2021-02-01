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
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
// @ts-ignore
import MultisigCosignatoriesDisplay from '@/components/MultisigCosignatoriesDisplay/MultisigCosignatoriesDisplay';
import { MultisigAccountInfo, NetworkType, PublicAccount } from 'symbol-sdk';
import i18n from '@/language/index';

const networkType = NetworkType.MAIN_NET;
const account1 = PublicAccount.createFromPublicKey('B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D', networkType);
const account2 = PublicAccount.createFromPublicKey('CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB', networkType);
const account3 = PublicAccount.createFromPublicKey('DAB1C38C3E1642494FCCB33138B95E81867B5FB59FC4277A1D53761C8B9F6D14', networkType);
const account4 = PublicAccount.createFromPublicKey('1674016C27FE2C2EB5DFA73996FA54A183B38AED0AA64F756A3918BAF08E061B', networkType);
const multisigInfo = new MultisigAccountInfo(1, account1.address, 1, 1, [account2.address, account3.address], []);

describe('MultisigCosignatoriesDisplay', () => {
    test('Getters should return correct values when no modifications', () => {
        const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
            i18n,
            propsData: {
                multisig: multisigInfo,
                modifiable: true,
                cosignatoryModifications: {},
            },
        });

        const component = wrapper.vm as MultisigCosignatoriesDisplay;

        expect(component.addModifications).toEqual([]);
        expect(component.removeModifications).toEqual([]);
        expect(component.cosignatories).toEqual([{ address: account2.address }, { address: account3.address }]);

        wrapper.destroy();
    });

    test('Getters should return correct values when there are modifications', () => {
        const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
            i18n,
            propsData: {
                multisig: multisigInfo,
                modifiable: true,
                cosignatoryModifications: {
                    [account4.address.plain()]: { cosignatory: account4.address, addOrRemove: 'add' },
                    [account3.address.plain()]: { cosignatory: account3.address, addOrRemove: 'remove' },
                },
            },
        });

        const component = wrapper.vm as MultisigCosignatoriesDisplay;

        expect(component.addModifications).toEqual([{ address: account4.address }]);
        expect(component.removeModifications).toEqual([{ address: account3.address }]);
        expect(component.cosignatories).toEqual([{ address: account2.address }]);

        wrapper.destroy();
    });

    test('Should dispatch an error when adding a cosigner that is already one', () => {
        const mockStoreDispatch = jest.fn();

        const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
            i18n,
            propsData: {
                multisig: multisigInfo,
                modifiable: true,
                cosignatoryModifications: {},
            },
            mocks: {
                $store: {
                    dispatch: mockStoreDispatch,
                },
            },
        });

        const component = wrapper.vm as MultisigCosignatoriesDisplay;

        component.onAddCosignatory(account2.address);

        expect(mockStoreDispatch).toHaveBeenCalledWith('notification/ADD_WARNING', 'warning_already_a_cosignatory');
        wrapper.destroy();
    });

    test('Should dispatch an error when adding a cosigner has already been added', () => {
        const mockStoreDispatch = jest.fn();

        const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
            i18n,
            propsData: {
                multisig: multisigInfo,
                modifiable: true,
                cosignatoryModifications: {
                    [account4.address.plain()]: { cosignatory: account4.address, addOrRemove: 'add' },
                },
            },
            mocks: {
                $store: {
                    dispatch: mockStoreDispatch,
                },
            },
        });

        const component = wrapper.vm as MultisigCosignatoriesDisplay;

        component.onAddCosignatory(account4.address);

        expect(mockStoreDispatch).toHaveBeenCalledWith('notification/ADD_WARNING', 'warning_already_a_cosignatory');
        wrapper.destroy();
    });

    test('Should emit when adding a cosigner', async () => {
        const vue = createLocalVue();
        vue.use(Vuex);

        const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
            i18n,
            propsData: {
                multisig: multisigInfo,
                modifiable: true,
                cosignatoryModifications: {},
            },
            mocks: {
                $store: {
                    dispatch: jest.fn(() => true),
                },
            },
        });

        const component = wrapper.vm as MultisigCosignatoriesDisplay;

        component.onAddCosignatory(account4.address);

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('add')).toBeTruthy();
        expect(wrapper.emitted().add[0]).toEqual([account4.address]);
        wrapper.destroy();
    });

    test('Should emit when removing a cosigner', () => {
        const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
            i18n,
            propsData: {
                multisig: multisigInfo,
                modifiable: true,
                cosignatoryModifications: {},
            },
        });

        const component = wrapper.vm as MultisigCosignatoriesDisplay;

        component.onRemoveCosignatory(account2.address);
        expect(wrapper.emitted('remove')).toBeTruthy();
        expect(wrapper.emitted().remove[0]).toEqual([account2.address]);
        wrapper.destroy();
    });
});
