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
import SignerBaseFilter from '@/components/SignerBaseFilter/SignerBaseFilter.vue';
import { SignerBaseFilterTs } from '@/components/SignerBaseFilter/SignerBaseFilterTs';
import { getComponent } from '@MOCKS/Components';
import { simpleWallet1, simpleWallet2 } from '@MOCKS/Accounts';

describe('components/SignerBaseFilter', () => {
    const mockSigner = {
        label: 'wallet 1',
        address: simpleWallet1.address,
        multisig: false,
        requiredCosigApproval: 0,
        requiredCosigRemoval: 0,
        parentSigners: [],
    };

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

    const getSignerBaseFilterWrapper = (props = {}) =>
        getComponent(
            SignerBaseFilter,
            {
                account: mockAccountStore,
            },
            {
                currentSigner: {
                    ...mockSigner,
                },
            },
            {
                ...props,
            },
            {
                OptionGroup: true,
                Icon: true,
            },
        );

    describe('component', () => {
        const runBasicSelectedSignerInMountTests = (props, expectResult) => {
            // Arrange:
            const wrapper = getSignerBaseFilterWrapper({
                rootSigner: mockSigner,
                ...props,
            });

            const vm = wrapper.vm as SignerBaseFilterTs;

            // Act + Assert:
            expect(vm.selectedSigner).toBe(expectResult);
        };

        test('renders only account in the list when parent signer does not exist', () => {
            // Arrange:
            const wrapper = getSignerBaseFilterWrapper({
                rootSigner: {
                    label: 'wallet 1',
                    address: simpleWallet1.address,
                    multisig: false,
                    requiredCosigApproval: 0,
                    requiredCosigRemoval: 0,
                },
            });

            // Act + Assert:
            const options = wrapper.findAll('option');
            expect(options.length).toBe(1);
            expect(options.at(0).text()).toBe('wallet 1');
            expect(options.at(0).attributes().value).toBe(simpleWallet1.address.plain());
        });

        test('renders account and multisig address in the list when parent signer exists', () => {
            // Arrange:
            const wrapper = getSignerBaseFilterWrapper({
                rootSigner: {
                    ...mockSigner,
                    parentSigners: [
                        {
                            ...mockSigner,
                            label: 'wallet 2',
                            address: simpleWallet2.address,
                            multisig: true,
                        },
                    ],
                },
            });

            // Act + Assert:
            const options = wrapper.findAll('option');
            expect(options.length).toBe(2);
            expect(options.at(0).text()).toBe('wallet 1');
            expect(options.at(0).attributes().value).toBe(simpleWallet1.address.plain());
            expect(options.at(1).text()).toBe('(Multisig)wallet 2');
            expect(options.at(1).attributes().value).toBe(simpleWallet2.address.plain());
        });

        test('created set selected signer to chosen signer when isAggregate is true and chosen signer does not empty', () => {
            const chosenSigner = simpleWallet2.address.plain();
            runBasicSelectedSignerInMountTests({ isAggregate: true, chosenSigner }, chosenSigner);
        });

        test('created set selected signer to current signer when isAggregate is false and chosen signer is empty', () => {
            const chosenSigner = '';
            runBasicSelectedSignerInMountTests({ isAggregate: false, chosenSigner }, simpleWallet1.address.plain());
        });
    });

    describe('onSignerChange', () => {
        test('emit selected signer value when click on first option in selector list', () => {
            // Arrange:
            const wrapper = getSignerBaseFilterWrapper({
                rootSigner: mockSigner,
            });

            // Act:
            wrapper.findAll('option').at(0).trigger('input');

            // Assert:
            expect(wrapper.emitted('signer-change')).toEqual([[simpleWallet1.address.plain()]]);
        });
    });

    describe('onCurrentSignerChange', () => {
        test('set selected signer to current signer', () => {
            // Arrange:
            const wrapper = getSignerBaseFilterWrapper({
                rootSigner: mockSigner,
            });

            const vm = wrapper.vm as SignerBaseFilterTs;

            vm.$set(vm, 'selectedSigner', simpleWallet2.address.plain());

            // Act:
            vm.onCurrentSignerChange();

            // Assert:
            expect(vm.selectedSigner).toEqual(simpleWallet1.address.plain());
        });
    });
});
