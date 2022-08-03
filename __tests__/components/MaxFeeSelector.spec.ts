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
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
import { MaxFeeSelectorTs } from '@/components/MaxFeeSelector/MaxFeeSelectorTs';
import { getComponent } from '@MOCKS/Components';
import { networkMock } from '@MOCKS/network';
import { TransactionFees } from 'symbol-sdk';

const maxFeeSelectorTs = new MaxFeeSelectorTs();
type Props = typeof maxFeeSelectorTs.$props;

describe('components/MaxFeeSelector', () => {
    const getMaxFeeSelectorWrapper = (props: Props, isNetworkCurrencyLoaded = true, path?: string) => {
        const defaultFee = networkMock.fees.fast;
        const networkMosaicName = networkMock.currency.name;
        const networkCurrency = {
            ...networkMock.currency,
            ticker: networkMock.currency.name,
        };
        const transactionFees = new TransactionFees(10, 10, 20, 5, 1);
        const feesConfig = networkMock.fees;
        const mockStore = {
            app: {
                namespaced: true,
                state: { defaultFee },
                getters: {
                    defaultFee: (state) => state.defaultFee,
                },
            },
            mosaic: {
                namespaced: true,
                state: {
                    networkMosaicName,
                    networkCurrency: isNetworkCurrencyLoaded ? networkCurrency : undefined,
                },
                getters: {
                    networkMosaicName: (state) => state.networkMosaicName,
                    networkCurrency: (state) => state.networkCurrency,
                },
            },
            network: {
                namespaced: true,
                state: {
                    transactionFees,
                    feesConfig,
                },
                getters: {
                    transactionFees: (state) => state.transactionFees,
                    feesConfig: (state) => state.feesConfig,
                },
            },
        };
        const mocks = {
            $route: {
                fullPath: path
            }
        };

        return getComponent(MaxFeeSelector, mockStore, {}, props, {}, null, mocks);
    };

    describe('dropdown fees options', () => {
        test('render options with lables and values', () => {
            // Arrange:
            const props = {};
            const expectedOptions = [
                {
                    label: 'Average',
                    value: '10',
                },
                {
                    label: 'No Fee: 0 symbol.xym',
                    value: '0',
                },
                {
                    label: 'Slow',
                    value: '5',
                },
                {
                    label: 'Slowest',
                    value: '1',
                },
                {
                    label: 'Fast',
                    value: '20',
                },
            ];

            // Act:
            const wrapper = getMaxFeeSelectorWrapper(props);
            const options = wrapper.findAll('option');

            // Assert:
            options.wrappers.forEach((option, index) => {
                expect(option.text()).toBe(expectedOptions[index].label);
                expect(option.text()).toBe(expectedOptions[index].label);
            });
        });

        test('emit input event', () => {
            // Arrange:
            const props = {};
            const expectedEventToBeEmmited = 'input';
            const expectedValueToBeEmmited = 5;

            // Act:
            const wrapper = getMaxFeeSelectorWrapper(props);
            const componrnt = wrapper.vm as MaxFeeSelectorTs;
            componrnt.chosenMaxFee = expectedValueToBeEmmited;

            // Assert:
            expect(wrapper.emitted()[expectedEventToBeEmmited][0]).toEqual([expectedValueToBeEmmited]);
        });
    });

    describe('network currency info', () => {
        const runLabelAmountTest = (isNetworkCurrencyLoaded: boolean, expectedLabel: string) => {
            // Arrange:
            const averageFee = 20;
            const props = { averageFee };

            // Act:
            const wrapper = getMaxFeeSelectorWrapper(props, isNetworkCurrencyLoaded);
            const valueElement = wrapper.find('option');

            // Assert:
            expect(valueElement.text()).toBe(expectedLabel);
        };

        test('render label with relative amount when info is loaded', () => {
            // Arrange:
            const isNetworkCurrencyLoaded = true;
            const expectedLabel = 'Average: 0.00002 symbol.xym';

            // Act + Assert:
            runLabelAmountTest(isNetworkCurrencyLoaded, expectedLabel);
        });

        test('render label without amount when info is not loaded', () => {
            // Arrange:
            const isNetworkCurrencyLoaded = false;
            const expectedLabel = 'Average';

            // Act + Assert:
            runLabelAmountTest(isNetworkCurrencyLoaded, expectedLabel);
        });
    });

    describe('offline transaction', () => {
        const runOfflineTransactionTest = async (routePath: string, isOfflineWarningShown: boolean) => {
            // Arrange:
            const props = {
                showLowFeeWarning: true,
            };

            // Act:
            const wrapper = getMaxFeeSelectorWrapper(props, true, routePath);
            await wrapper.vm.$nextTick();

            // Assert:
            expect(wrapper.find('.offline-warning-style').exists()).toBe(isOfflineWarningShown);
        };

        test('show warning when transaction is offline', async () => {
            // Arrange:
            const offlineTransactionRoutePath = '/offlineTransaction/simple';
            const isOfflineWarningShown = true;

            // Act + Assert:
            await runOfflineTransactionTest(offlineTransactionRoutePath, isOfflineWarningShown);
        });

        test('hide warning when transaction is not offline', async () => {
            // Arrange:
            const offlineTransactionRoutePath = '/';
            const isOfflineWarningShown = false;

            // Act + Assert:
            await runOfflineTransactionTest(offlineTransactionRoutePath, isOfflineWarningShown);
        });
    });

    describe('chosen max fee', () => {
        const runChosenMaxFeeTest = (value: any, expectedChosenMaxFee: number) => {
            // Arrange:
            const props = {
                value,
            };

            // Act:
            const vm = getMaxFeeSelectorWrapper(props).vm as MaxFeeSelectorTs;

            // Assert:
            expect(vm.chosenMaxFee).toBe(expectedChosenMaxFee);
        };

        test('return value when number passed as value', () => {
            // Arrange:
            const value = 10;
            const expectedChosenMaxFee = 10;

            // Act + Assert:
            runChosenMaxFeeTest(value, expectedChosenMaxFee);
        });

        test('return number from value when string passed as value', () => {
            // Arrange:
            const value = '10';
            const expectedChosenMaxFee = 10;

            // Act + Assert:
            runChosenMaxFeeTest(value, expectedChosenMaxFee);
        });

        test('return default fee when null passed as value', () => {
            // Arrange:
            const value = null;
            const expectedChosenMaxFee = 20;

            // Act + Assert:
            runChosenMaxFeeTest(value, expectedChosenMaxFee);
        });
    });
});
