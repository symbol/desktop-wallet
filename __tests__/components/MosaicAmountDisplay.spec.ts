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
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
import { MosaicAmountDisplayTs } from '@/components/MosaicAmountDisplay/MosaicAmountDisplayTs';
import { mosaicsMock } from '@MOCKS/mosaics';
import { networkMock } from '@MOCKS/network';
import { getComponent } from '@MOCKS/Components';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
import { MosaicId, NamespaceId, NetworkType } from 'symbol-sdk';

type Props = InstanceType<typeof MosaicAmountDisplayTs>['$props'];

jest.mock('@/config', () => ({
    networkConfig: {
        152: {
            maxMosaicDivisibility: 100,
        },
    },
}));

describe('components/MosaicAmountDisplay', () => {
    const networkType = NetworkType.TEST_NET;
    const mockNetworkCurrency = {
        ...networkMock.currency,
        namespaceIdFullname: networkMock.currency.name,
        ticker: networkMock.currency.name,
    };

    const getMosaicAmountDisplayWrapper = (props: Props, stateChanges?: Record<string, any>) => {
        const mockStore = {
            mosaic: {
                namespaced: true,
                state: {
                    networkCurrency: mockNetworkCurrency,
                },
                getters: {
                    mosaics: () => mosaicsMock,
                    networkCurrency: (state) => state.networkCurrency,
                },
            },
            network: {
                namespaced: true,
                getters: {
                    networkType: () => networkType,
                },
            },
        };

        return getComponent(MosaicAmountDisplay, mockStore, stateChanges, props);
    };

    describe('render component', () => {
        // Arrange:
        const mosaic = mosaicsMock[1];
        const props = {
            id: new MosaicId(mosaic.mosaicIdHex),
            relativeAmount: 100,
            size: 'bigger',
            showTicker: true,
        };
        const expectedValueAttribute = '100';
        const expectedDecimalsAttribute = '0';
        const expectedSizeAttribute = 'bigger';
        const expectedShowTickerAttribute = 'true';
        const expectedTickerAttribute = '2C56C7D764F17B09';

        // Act:
        const wrapper = getMosaicAmountDisplayWrapper(props);
        const amountDisplayElement = wrapper.find('amountdisplay-stub');

        // Assert:
        expect(amountDisplayElement.attributes('value')).toBe(expectedValueAttribute);
        expect(amountDisplayElement.attributes('decimals')).toBe(expectedDecimalsAttribute);
        expect(amountDisplayElement.attributes('size')).toBe(expectedSizeAttribute);
        expect(amountDisplayElement.attributes('showticker')).toBe(expectedShowTickerAttribute);
        expect(amountDisplayElement.attributes('ticker')).toBe(expectedTickerAttribute);
    });

    describe('useNetwork()', () => {
        const runUseNetworkTest = (id: MosaicId | NamespaceId, networkCurrency: NetworkCurrencyModel, expectedResult: boolean) => {
            // Arrange:
            const props = {
                id,
            };
            const stateChanges = {
                networkCurrency,
            };

            // Act:
            const wrapper = getMosaicAmountDisplayWrapper(props, stateChanges);
            const component = wrapper.vm as MosaicAmountDisplayTs;
            const result = component['useNetwork']();

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('return true when id is not provided and network currency is loaded', () => {
            // Arrange:
            const id = null;
            const networkCurrency = mockNetworkCurrency;
            const expectedResult = true;

            // Act + Assert:
            runUseNetworkTest(id, networkCurrency, expectedResult);
        });

        test('return true when id is equal to network currency mosaicId', () => {
            // Arrange:
            const id = new MosaicId(mockNetworkCurrency.mosaicIdHex);
            const networkCurrency = mockNetworkCurrency;
            const expectedResult = true;

            // Act + Assert:
            runUseNetworkTest(id, networkCurrency, expectedResult);
        });

        test('return true when id is equal to network currency namespaceId', () => {
            // Arrange:
            const id = NamespaceId.createFromEncoded(mockNetworkCurrency.namespaceIdHex);
            const networkCurrency = mockNetworkCurrency;
            const expectedResult = true;

            // Act + Assert:
            runUseNetworkTest(id, networkCurrency, expectedResult);
        });

        test('return false when id is not belong to network currency', () => {
            // Arrange:
            const id = NamespaceId.createFromEncoded('E84B99BA41F4AFEE');
            const networkCurrency = mockNetworkCurrency;
            const expectedResult = false;

            // Act + Assert:
            runUseNetworkTest(id, networkCurrency, expectedResult);
        });

        test('return false when network currency is not loaded', () => {
            // Arrange:
            const id = NamespaceId.createFromEncoded('E84B99BA41F4AFEE');
            const networkCurrency = null;
            const expectedResult = false;

            // Act + Assert:
            runUseNetworkTest(id, networkCurrency, expectedResult);
        });
    });

    describe('get divisibility()', () => {
        const runGetDivisibilityTest = (id: MosaicId, useNetwork: boolean, expectedResult: number) => {
            // Arrange:
            const props = {
                id,
            };
            const mockUseNetwork = jest.fn().mockReturnValue(useNetwork);

            // Act:
            const wrapper = getMosaicAmountDisplayWrapper(props);
            const component = wrapper.vm as MosaicAmountDisplayTs;
            component['useNetwork'] = mockUseNetwork;
            const result = component['divisibility'];

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('return network currency divisibility when useNetwork() returns true', () => {
            // Arrange:
            const id = null;
            const useNetwork = true;
            const expectedResult = mockNetworkCurrency.divisibility;

            // Act + Assert:
            runGetDivisibilityTest(id, useNetwork, expectedResult);
        });

        test('return mosaic divisibility for given id when useNetwork() returns false', () => {
            // Arrange:
            const mosaic = mosaicsMock[1];
            const id = new MosaicId(mosaic.mosaicIdHex);
            const useNetwork = false;
            const expectedResult = mosaic.divisibility;

            // Act + Assert:
            runGetDivisibilityTest(id, useNetwork, expectedResult);
        });

        test('return divisibility from config for unknown mosaic when useNetwork() returns false', () => {
            // Arrange:
            const id = new MosaicId('100D8D4D98285200');
            const useNetwork = false;
            const expectedResult = 100;

            // Act + Assert:
            runGetDivisibilityTest(id, useNetwork, expectedResult);
        });
    });

    describe('get amount()', () => {
        const runGetAmountTest = (absoluteAmount: number, relativeAmount: number, expectedResult: number) => {
            // Arrange:
            const props = {
                absoluteAmount,
                relativeAmount,
            };

            // Act:
            const wrapper = getMosaicAmountDisplayWrapper(props);
            const component = wrapper.vm as MosaicAmountDisplayTs;
            const result = component.amount;

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('return calculated relative amount when absolute amount is provided', () => {
            // Arrange:
            const absoluteAmount = 10000000;
            const relativeAmount = null;
            const expectedResult = 10;

            // Act + Assert:
            runGetAmountTest(absoluteAmount, relativeAmount, expectedResult);
        });

        test('return relative amount when absolute amount is not provided', () => {
            // Arrange:
            const absoluteAmount = null;
            const relativeAmount = 20;
            const expectedResult = 20;

            // Act + Assert:
            runGetAmountTest(absoluteAmount, relativeAmount, expectedResult);
        });

        test('return 0 when neither relative amount nor absolute amount is provided', () => {
            // Arrange:
            const absoluteAmount = null;
            const relativeAmount = null;
            const expectedResult = 0;

            // Act + Assert:
            runGetAmountTest(absoluteAmount, relativeAmount, expectedResult);
        });
    });

    describe('get ticker()', () => {
        const runGetTickerTest = (
            showTicker: boolean,
            useNetwork: boolean,
            networkCurrency: NetworkCurrencyModel,
            id: MosaicId,
            expectedResult: string,
        ) => {
            // Arrange:
            const props = {
                showTicker,
                id,
            };
            const stateChanges = {
                networkCurrency,
            };
            const mockUseNetwork = jest.fn().mockReturnValue(useNetwork);

            // Act:
            const wrapper = getMosaicAmountDisplayWrapper(props, stateChanges);
            const component = wrapper.vm as MosaicAmountDisplayTs;
            component['useNetwork'] = mockUseNetwork;
            const result = component.ticker;

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('return empty string when showTicker property is false', () => {
            // Arrange:
            const showTicker = false;
            const useNetwork = false;
            const networkCurrency = mockNetworkCurrency;
            const id = null;
            const expectedResult = '';

            // Act + Assert:
            runGetTickerTest(showTicker, useNetwork, networkCurrency, id, expectedResult);
        });

        test('return network currency ticker when useNetwork is true', () => {
            // Arrange:
            const showTicker = true;
            const useNetwork = true;
            const networkCurrency = mockNetworkCurrency;
            const id = null;
            const expectedResult = mockNetworkCurrency.ticker;

            // Act + Assert:
            runGetTickerTest(showTicker, useNetwork, networkCurrency, id, expectedResult);
        });

        test('return empty string when when network currency ticker is unavailable', () => {
            // Arrange:
            const showTicker = true;
            const useNetwork = true;
            const networkCurrency = {
                ...mockNetworkCurrency,
                ticker: null,
            };
            const id = null;
            const expectedResult = '';

            // Act + Assert:
            runGetTickerTest(showTicker, useNetwork, networkCurrency, id, expectedResult);
        });

        test('return mosaic name by given id', () => {
            // Arrange:
            const mosaic = mosaicsMock[2];
            const showTicker = true;
            const useNetwork = true;
            const networkCurrency = mockNetworkCurrency;
            const id = new MosaicId(mosaic.mosaicIdHex);
            const expectedResult = mosaic.name;

            // Act + Assert:
            runGetTickerTest(showTicker, useNetwork, networkCurrency, id, expectedResult);
        });

        test('return mosaic id when mosaic name is unavailable', () => {
            // Arrange:
            const mosaic = mosaicsMock[1];
            const showTicker = true;
            const useNetwork = true;
            const networkCurrency = mockNetworkCurrency;
            const id = new MosaicId(mosaic.mosaicIdHex);
            const expectedResult = mosaic.mosaicIdHex;

            // Act + Assert:
            runGetTickerTest(showTicker, useNetwork, networkCurrency, id, expectedResult);
        });
    });
});
