/*
 * (C) Symbol Contributors 2022
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
import SignerListFilter from '@/components/SignerListFilter/SignerListFilter.vue';
import { SignerListFilterTs } from '@/components/SignerListFilter/SignerListFilterTs';
import { getComponent } from '@MOCKS/Components';
import { simpleWallet1, simpleWallet2 } from '@MOCKS/Accounts';

describe('components/SignerListFilter', () => {
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentSigner: null,
        },
        getters: {
            currentSigner: (state) => {
                return state.currentSigner;
            },
        },
    };

    const getSignerListFilterWrapper = () =>
        getComponent(
            SignerListFilter,
            {
                account: mockAccountStore,
            },
            {
                currentSigner: {
                    label: '',
                    address: simpleWallet1.address,
                    multisig: false,
                    requiredCosigApproval: 0,
                    requiredCosigRemoval: 0,
                },
            },
            {},
            {},
        );

    describe('onListSignerChange', () => {
        test('set new signer from the list', () => {
            // Arrange:
            const wrapper = getSignerListFilterWrapper();

            const vm = wrapper.vm as SignerListFilterTs;

            const newSigner = simpleWallet2.address.plain();

            vm.$set(vm, 'selectedSigner', simpleWallet1.address.plain());

            jest.spyOn(vm, 'onSignerChange');

            // Act:
            vm.onListSignerChange(newSigner);

            // Assert:
            expect(vm.selectedSigner).toBe(newSigner);
            expect(vm.onSignerChange).toHaveBeenCalled();
        });
    });
});
