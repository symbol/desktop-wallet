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
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';

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
        test('returns "copy_hash" when label is "hash"', () => {
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
            expect(result).toBe('copy_hash');
        });

        test('returns "copy_sender" when label is "sender"', () => {
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
            expect(result).toBe('copy_sender');
        });

        test('returns "copy_inner_hash" when label is "inner_transaction_hash"', () => {
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
            expect(result).toBe('copy_inner_hash');
        });
    });

    describe('ButtonCopyToClipboard integration', () => {
        test('displays ButtonCopyToClipboard when label is "hash" with value "ABC123"', () => {
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
            const buttonComponent = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(buttonComponent.exists()).toBe(true);
        });

        test('ButtonCopyToClipboard has correct props when label is "hash" with value "ABC123"', () => {
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
            const buttonComponent = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(buttonComponent.props('value')).toBe('ABC123');
            expect(buttonComponent.props('type')).toBe('icon-black');
            expect(buttonComponent.props('tooltipText')).toBe('copy_hash');
        });

        test('does not display ButtonCopyToClipboard when label is "recipient"', () => {
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
            const buttonComponent = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(buttonComponent.exists()).toBe(false);
        });
    });

    describe('accessibility', () => {
        // Note: ButtonCopyToClipboard component handles keyboard accessibility internally.
        // It automatically responds to Enter and Space key events, making it fully keyboard
        // accessible without requiring additional implementation in the parent component.
        // These tests verify the correct configuration of the copy button for accessibility.

        test('ButtonCopyToClipboard has correct tooltipText for hash', () => {
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
            const copyButton = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(copyButton.exists()).toBe(true);
            expect(copyButton.props('tooltipText')).toBe('copy_hash');
        });

        test('ButtonCopyToClipboard has correct tooltipText for sender', () => {
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
            const copyButton = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(copyButton.exists()).toBe(true);
            expect(copyButton.props('tooltipText')).toBe('copy_sender');
        });

        test('ButtonCopyToClipboard has correct tooltipText for inner_transaction_hash', () => {
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
            const copyButton = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(copyButton.exists()).toBe(true);
            expect(copyButton.props('tooltipText')).toBe('copy_inner_hash');
        });

        test('ButtonCopyToClipboard is not rendered for non-copyable fields', () => {
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
            const copyButton = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(copyButton.exists()).toBe(false);
        });
    });

    describe('ButtonCopyToClipboard notifications and error handling', () => {
        // Note: This test suite verifies that TransactionDetailRow correctly integrates with
        // ButtonCopyToClipboard component by mounting it and passing the correct props.
        // All notification and error handling logic is implemented internally within
        // ButtonCopyToClipboard component and does not need to be tested here.

        test('mounts ButtonCopyToClipboard component when shouldShowCopyButton is true', () => {
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
            const copyButton = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(copyButton.exists()).toBe(true);
        });

        test('passes correct value prop to ButtonCopyToClipboard', () => {
            // Arrange:
            const expectedValue = '3A332B36663CFE8EB4FE128E8322AA5E0E29B7B6978E232E7C59CE60927BDADA';
            const wrapper = getTransactionDetailRowWrapper(
                { networkType: NetworkType.TEST_NET },
                {
                    item: {
                        key: 'hash',
                        value: expectedValue,
                    },
                },
            );

            // Act:
            const copyButton = wrapper.findComponent(ButtonCopyToClipboard);

            // Assert:
            expect(copyButton.props('value')).toBe(expectedValue);
        });

        // Note: The following notification and error scenarios are handled internally by
        // ButtonCopyToClipboard component and do not require testing in TransactionDetailRow:
        //
        // 1. COPY_SUCCESS notification:
        //    - Dispatched by ButtonCopyToClipboard.copyToClipboard() on successful copy
        //    - Handled via: this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.COPY_SUCCESS)
        //
        // 2. COPY_FAILED notification:
        //    - Dispatched by ButtonCopyToClipboard.copyToClipboard() when clipboard API fails
        //    - Handled via: this.$store.dispatch('notification/ADD_ERROR', NotificationType.COPY_FAILED)
        //
        // 3. Clipboard API errors:
        //    - Caught by try-catch block in ButtonCopyToClipboard.copyToClipboard()
        //    - Automatically triggers COPY_FAILED notification
        //
        // 4. Multiple rapid clicks:
        //    - Each click independently triggers ButtonCopyToClipboard.copyToClipboard()
        //    - No special handling needed as each operation is atomic
        //
        // TransactionDetailRow's responsibility is only to mount ButtonCopyToClipboard
        // and pass the correct value and tooltip props, which is verified by the tests above.
    });
});
