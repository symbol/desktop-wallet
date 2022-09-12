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
import ImportanceScoreDisplay from '@/components/ImportanceScoreDisplay/ImportanceScoreDisplay.vue';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { mosaicsMock } from '@MOCKS/mosaics';
import { Address, UInt64 } from 'symbol-sdk';

describe('components/ImportanceScoreDisplay', () => {
    const account = WalletsModel1;
    const networkCurrency = mosaicsMock[0];
    const networkConfiguration = { divisibility: 6 };
    const mockAccountStore = {
        namespaced: true,
        state: {
            accountsInfo: [],
        },
        getters: {
            accountsInfo: (state) => {
                return state.accountsInfo;
            },
        },
    };

    const mockMosaicStore = {
        namespaced: true,
        state: {
            networkCurrency: networkCurrency,
        },
        getters: {
            networkCurrency: (state) => {
                return state.networkCurrency;
            },
        },
    };

    const mockNetworkStore = {
        namespaced: true,
        state: {
            networkConfiguration: networkConfiguration,
        },
        getters: {
            networkConfiguration: (state) => {
                return state.networkConfiguration;
            },
        },
    };

    const getImportanceScoreDisplayWrapper = (address?: string, stateChanges?: { [field: string]: any }) => {
        const wrapper = getComponent(
            ImportanceScoreDisplay,
            { account: mockAccountStore, network: mockNetworkStore, mosaic: mockMosaicStore },
            stateChanges,
            { address },
        );
        return wrapper;
    };

    test('renders importance score display', () => {
        // Arrange + Act:
        const wrapper = getImportanceScoreDisplayWrapper();

        // Assert:
        expect(wrapper.find('div span.value').text()).toBe('0 %');
    });

    const testPresentsImportance = (networkCurrency, networkConfiguration, expectedPresentedValue, importance?: UInt64) => {
        // Arrange + Act:
        const address = account.address;
        const stateChanges = {
            accountsInfo: [{ address: Address.createFromRawAddress(address), importance }],
            networkConfiguration,
            networkCurrency,
        };
        const wrapper = getImportanceScoreDisplayWrapper(address, stateChanges);

        // Assert:
        expect(wrapper.find('div span.value').text()).toBe(expectedPresentedValue);
    };

    test('presents N/A given total chain importance but no divisibility', () => {
        testPresentsImportance({ divisibility: undefined }, { totalChainImportance: 10 }, 'N/A');
    });

    test('presents N/A given total chain importance but no network currency', () => {
        testPresentsImportance(undefined, { totalChainImportance: 10 }, 'N/A');
    });

    test('presents N/A given divisibility but no network configuration', () => {
        testPresentsImportance({ divisibility: 6 }, undefined, 'N/A');
    });

    test('presents N/A given divisibility but no total chain importance', () => {
        testPresentsImportance({ divisibility: 6 }, { totalChainImportance: undefined }, 'N/A');
    });

    test('presents zero importance', async () => {
        testPresentsImportance({ divisibility: 6 }, { totalChainImportance: 2 }, '0%', UInt64.fromNumericString('0'));
    });

    test('presents fractional relative importance', async () => {
        testPresentsImportance(
            { divisibility: 6 },
            { totalChainImportance: 7842_928_625_000_000 },
            '0.1%',
            UInt64.fromNumericString('7842928625001'),
        );
    });
});
