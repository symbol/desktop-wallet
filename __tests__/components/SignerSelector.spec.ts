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
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
import { SignerSelectorTs } from '@/components/SignerSelector/SignerSelectorTs';
import { getComponent } from '@MOCKS/Components';
import { simpleWallet1, simpleWallet2 } from '@MOCKS/Accounts';
import SignerBaseFilter from '@/components/SignerBaseFilter/SignerBaseFilter.vue';

describe('components/SignerSelector', () => {
    const getSignerSelectorWrapper = (props = {}) =>
        getComponent(
            SignerSelector,
            {},
            {},
            {
                rootSigner: {
                    label: '',
                    address: simpleWallet1.address,
                    multisig: false,
                    requiredCosigApproval: 0,
                    requiredCosigRemoval: 0,
                },
                ...props,
            },
            {},
        );

    describe('sub components', () => {
        describe('SignerBaseFilter', () => {
            test('renders signer base filter component when parent signer exists', () => {
                // Arrange:
                const wrapper = getSignerSelectorWrapper({
                    rootSigner: {
                        label: '',
                        address: simpleWallet1.address,
                        multisig: false,
                        requiredCosigApproval: 0,
                        parentSigners: [
                            {
                                label: 'label',
                                address: simpleWallet2.address,
                                multisig: false,
                                requiredCosigApproval: 0,
                            },
                        ],
                    },
                });

                // Act + Assert:
                expect(wrapper.findComponent(SignerBaseFilter).exists()).toBe(true);
            });

            test('hides signer base filter component when parent signer does not exist', () => {
                // Arrange:
                const wrapper = getSignerSelectorWrapper();

                // Act + Assert:
                expect(wrapper.findComponent(SignerBaseFilter).exists()).toBe(false);
            });

            test('displays label when root signer is multisig and parent signer does not exist', () => {
                // Arrange:
                const wrapper = getSignerSelectorWrapper({
                    rootSigner: {
                        label: 'label',
                        address: simpleWallet1.address,
                        multisig: true,
                        requiredCosigApproval: 0,
                        requiredCosigRemoval: 0,
                    },
                });

                // Act + Assert:
                expect(wrapper.find('.signer-selector-single-signer-container').text()).toContain('label');
                expect(wrapper.find('.signer-selector-single-signer-container').text()).toContain('(Multisig)');
            });
        });
    });

    describe('chosenSigner', () => {
        test('returns current signer', () => {
            // Arrange:
            const wrapper = getSignerSelectorWrapper({
                value: simpleWallet1.address.plain(),
            });

            const vm = wrapper.vm as SignerSelectorTs;

            // Act + Assert:
            expect(vm.chosenSigner).toEqual(simpleWallet1.address.plain());
        });

        test('sets new chosen signer when new signer provided', async () => {
            // Arrange:
            const newSigner = simpleWallet2.address.plain();

            const wrapper = getSignerSelectorWrapper();

            const vm = wrapper.vm as SignerSelectorTs;

            // Act:
            vm.onSignerSelectorChange(newSigner);

            // Assert:
            expect(wrapper.emitted('input')).toEqual([[newSigner]]);
        });
    });
});
