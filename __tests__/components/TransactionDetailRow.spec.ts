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
});
