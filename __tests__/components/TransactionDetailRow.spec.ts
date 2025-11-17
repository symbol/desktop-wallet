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
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue';
import { getComponent } from '@MOCKS/Components';
import { NetworkType } from 'symbol-sdk';
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
import AddressDisplay from '@/components/AddressDisplay/AddressDisplay.vue';
import PaidFeeDisplay from '@/components/PaidFeeDisplay/PaidFeeDisplay.vue';
import MessageDisplay from '@/components/MessageDisplay/MessageDisplay.vue';

describe('components/TransactionDetailRow', () => {
    const getTransactionDetailRowWrapper = (state = {}, props = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { networkType: undefined },
            getters: {
                networkType: (state) => {
                    return state.networkType;
                },
            },
        };

        return getComponent(
            TransactionDetailRow,
            {
                network: mockNetworkStore,
            },
            state,
            props,
            {
                Tooltip: true,
            },
            undefined,
        );
    };

    describe('label', () => {
        const runBasicLabelTests = (item, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item,
                },
            );

            // Act + Assert:
            // @ts-ignore
            expect(wrapper.vm.label).toBe(expectedResult);
        };

        test("returns key when label's key exists", () => {
            runBasicLabelTests(
                {
                    key: 'label',
                },
                'label',
            );
        });

        test("returns an empty string when item's key does not exist", () => {
            runBasicLabelTests({}, '');
        });
    });

    describe('sub components', () => {
        const runSubComponentTests = (component, flag, item) => {
            test(`display ${component.name} component when ${flag} is true`, () => {
                // Arrange:
                const wrapper = getTransactionDetailRowWrapper(
                    { networkType: NetworkType.TEST_NET },
                    {
                        item: {
                            ...item,
                            [flag]: true,
                        },
                    },
                );

                // Act + Assert:
                expect(wrapper.findComponent(component)).toBeDefined();
            });

            test(`hide ${component.name} component when ${flag} is false`, () => {
                // Arrange:
                const wrapper = getTransactionDetailRowWrapper(
                    { networkType: NetworkType.TEST_NET },
                    {
                        item: {
                            ...item,
                            [flag]: false,
                        },
                    },
                );

                // Act + Assert:
                expect(wrapper.findComponent(component).exists()).toBe(false);
            });
        };

        describe('MosaicAmountDisplay', () => {
            runSubComponentTests(MosaicAmountDisplay, 'isMosaic', {
                value: {
                    id: 1,
                    amount: 1,
                    color: 'green',
                },
            });
        });

        describe('PaidFeeDisplay', () => {
            runSubComponentTests(PaidFeeDisplay, 'isPaidFee', {
                value: 'message',
            });
        });

        describe('AddressDisplay', () => {
            runSubComponentTests(AddressDisplay, 'isAddress', {
                value: 'TDMYLKCTEVPSRPTG4UXW47IQPCYNLW2OVWZMLGY',
            });
        });

        describe('MessageDisplay', () => {
            runSubComponentTests(MessageDisplay, 'isMessage', {
                value: {
                    message: 'message',
                    incoming: 'incoming',
                    recipient: 'TDMYLKCTEVPSRPTG4UXW47IQPCYNLW2OVWZMLGY',
                    unannounced: 'unannounced',
                    signer: 'TDMYLKCTEVPSRPTG4UXW47IQPCYNLW2OVWZMLGY',
                },
            });
        });
    });

    describe('explorerUrl', () => {
        // Arrange:
        const mockTransactionHash = '3A332B36663CFE8EB4FE128E8322AA5E0E29B7B6978E232E7C59CE60927BDADA';

        const runBasicExplorerUrlTests = (value) => {
            test(`display explorer URL when label key is ${value}`, () => {
                // Arrange:
                const wrapper = getTransactionDetailRowWrapper(
                    { networkType: NetworkType.TEST_NET },
                    {
                        item: {
                            key: value,
                            value: mockTransactionHash,
                        },
                    },
                );

                // Act:
                const element = wrapper.find('.url_text');

                // Assert:
                expect(element.text()).toBe(mockTransactionHash);
                expect(element.attributes().href).toBe(`https://testnet.symbol.fyi/transactions/${mockTransactionHash}`);
            });
        };

        const items = ['hash', 'inner_transaction_hash'];

        // Act + Assert:
        items.forEach((item) => runBasicExplorerUrlTests(item));

        test('hide explorer URL when label key is other than hash or inner transaction hash', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'test',
                        value: mockTransactionHash,
                    },
                },
            );

            // Act:
            const element = wrapper.find('.url_text');

            // Assert:
            expect(element.exists()).toBe(false);
        });
    });

    describe('shouldShowCopyButton', () => {
        test('returns true when label is hash and value is ABC123', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: 'ABC123',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.shouldShowCopyButton;

            // Assert:
            expect(result).toBe(true);
        });

        test('returns true when label is sender and value is TALPBVKED...', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'sender',
                        value: 'TALPBVKED...',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.shouldShowCopyButton;

            // Assert:
            expect(result).toBe(true);
        });

        test('returns true when label is inner_transaction_hash and value is DEF456', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'inner_transaction_hash',
                        value: 'DEF456',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.shouldShowCopyButton;

            // Assert:
            expect(result).toBe(true);
        });

        test('returns false when label is recipient', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'recipient',
                        value: 'TALPBVKED...',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.shouldShowCopyButton;

            // Assert:
            expect(result).toBe(false);
        });

        test('returns false when label is hash and value is null', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: null,
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.shouldShowCopyButton;

            // Assert:
            expect(result).toBe(false);
        });

        test('returns false when label is hash and value is empty string', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: '',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.shouldShowCopyButton;

            // Assert:
            expect(result).toBe(false);
        });
    });

    describe('copyValue', () => {
        test('returns the item value as a string', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: 'ABC123',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.copyValue;

            // Assert:
            expect(result).toBe('ABC123');
        });
    });

    describe('copyTooltipText', () => {
        test('returns "copy" when label is "hash"', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: 'ABC123',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.copyTooltipText;

            // Assert:
            expect(result).toBe('copy');
        });

        test('returns "copy" when label is "sender"', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'sender',
                        value: 'TDMYLKCTEVPSRPTG4UXW47IQPCYNLW2OVWZMLGY',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.copyTooltipText;

            // Assert:
            expect(result).toBe('copy');
        });

        test('returns "copy" when label is "inner_transaction_hash"', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'inner_transaction_hash',
                        value: 'ABC123',
                    },
                },
            );

            // Act:
            // @ts-ignore
            const result = wrapper.vm.copyTooltipText;

            // Assert:
            expect(result).toBe('copy');
        });
    });

    describe('Copy button integration', () => {
        test('displays copy button when label is "hash" with value "ABC123"', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: 'ABC123',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(true);
        });

        test('copy button has Tooltip component when displayed', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: 'ABC123',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');
            const tooltip = copyButton.find('tooltip-stub');

            // Assert:
            expect(tooltip.exists()).toBe(true);
        });

        test('does not display copy button when label is "recipient"', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'recipient',
                        value: 'TDMYLKCTEVPSRPTG4UXW47IQPCYNLW2OVWZMLGY',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(false);
        });
    });

    describe('accessibility', () => {
        // Note: Tooltip component with transfer prop handles proper z-index and positioning.
        // Copy button is keyboard accessible through standard HTML click events.

        test('copy button is displayed for hash field', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: '3A332B36663CFE8EB4FE128E8322AA5E0E29B7B6978E232E7C59CE60927BDADA',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(true);
        });

        test('copy button is displayed for sender field', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'sender',
                        value: 'TDMYLKCTEVPSRPTG4UXW47IQPCYNLW2OVWZMLGY',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(true);
        });

        test('copy button is displayed for inner_transaction_hash field', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'inner_transaction_hash',
                        value: '3A332B36663CFE8EB4FE128E8322AA5E0E29B7B6978E232E7C59CE60927BDADA',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(true);
        });

        test('copy button is not rendered for non-copyable fields', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'other_field',
                        value: 'some value',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(false);
        });
    });

    describe('Copy functionality', () => {
        // Note: Copy functionality uses navigator.clipboard API and dispatches
        // notifications through the Vuex store in the handleCopy method.

        test('copy button exists when shouldShowCopyButton is true', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: '3A332B36663CFE8EB4FE128E8322AA5E0E29B7B6978E232E7C59CE60927BDADA',
                    },
                },
            );

            // Act:
            const copyButton = wrapper.find('.copy-button-right');

            // Assert:
            expect(copyButton.exists()).toBe(true);
        });

        test('copy icon is present in copy button', () => {
            // Arrange:
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: '3A332B36663CFE8EB4FE128E8322AA5E0E29B7B6978E232E7C59CE60927BDADA',
                    },
                },
            );

            // Act:
            const copyIcon = wrapper.find('.copy-icon');

            // Assert:
            expect(copyIcon.exists()).toBe(true);
        });
    });
});
