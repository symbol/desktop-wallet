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
import i18n from '@/language/index';
import HarvestedBlocksList from '@/views/pages/harvesting/HarvestedBlocksList/HarvestedBlocksList.vue';
import { simpleWallet2 } from '@MOCKS/Accounts';
import { mosaicsMock } from '@MOCKS/mosaics';
import { getStore } from '@MOCKS/Store';
import { render } from '@testing-library/vue';
import { createLocalVue } from '@vue/test-utils';
import { UInt64 } from 'symbol-sdk';
import iView from 'view-design';
import Vue from 'vue';
import Vuex from 'vuex';

describe('components/HarvestedBlocksList', () => {
    const defaultCurrentSignerAccountInfo = undefined;
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentSignerAccountInfo: defaultCurrentSignerAccountInfo,
        },
        getters: {
            currentSignerAccountInfo: (state) => state.currentSignerAccountInfo,
        },
        mutations: {
            currentSignerAccountInfo: (state, currentSignerAccountInfo) => (state.currentSignerAccountInfo = currentSignerAccountInfo),
        },
    };

    const harvestedBlocksPageInfo = { pageNumber: 1, isLastPage: false };
    const mockHarvestingStore = {
        namespaced: true,
        state: {
            harvestedBlocks: undefined,
            isFetchingHarvestedBlocks: false,
            harvestedBlocksPageInfo: harvestedBlocksPageInfo,
        },
        getters: {
            harvestedBlocks: (state) => state.harvestedBlocks,
            isFetchingHarvestedBlocks: (state) => state.isFetchingHarvestedBlocks,
            harvestedBlocksPageInfo: (state) => state.harvestedBlocksPageInfo,
        },
        mutations: {
            harvestedBlocks: (state, harvestedBlocks) => (state.harvestedBlocks = harvestedBlocks),
            harvestedBlocksPageInfo: (state, harvestedBlocksPageInfo) => (state.harvestedBlocksPageInfo = harvestedBlocksPageInfo),
        },
    };
    const networkCurrency = mosaicsMock[0];
    const mockMosaicStore = {
        namespaced: true,
        state: {
            networkCurrency: networkCurrency,
        },
        getters: {
            networkCurrency: (state) => state.networkCurrency,
        },
    };

    const renderComponent = (stateChanges?: { [field: string]: any }, dispatch?: () => any) => {
        const localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(iView);
        const store = getStore(
            {
                account: mockAccountStore,
                harvesting: mockHarvestingStore,
                mosaic: mockMosaicStore,
            },
            stateChanges,
            dispatch,
            true,
            undefined,
            false,
        );

        return {
            ...render(HarvestedBlocksList, {
                store,
                i18n,
                localVue,
            }),
            store,
        };
    };

    test('renders table with no data', async () => {
        // Arrange + Act:
        const { getByText } = renderComponent();

        // Assert:
        expect(getByText(i18n.t('block').toString())).toBeDefined();
        expect(getByText(i18n.t('fees_earned').toString())).toBeDefined();
        expect(getByText(i18n.t('no_harvested_blocks_yet').toString())).toBeDefined();
    });

    test('renders table with block rewards data', async () => {
        // Arrange + Act:
        const harvestedBlocks = [{ blockNo: UInt64.fromUint(2_000), fee: UInt64.fromUint(1_000_000) }];
        const { getByText } = renderComponent({ harvestedBlocks });

        // Assert:
        expect(getByText('2000')).toBeDefined();
        expect(getByText('1.0')).toBeDefined();
    });

    test('shows next page in the table when next page button is clicked', async () => {
        // Arrange:
        const dispatch = jest.fn();
        const harvestedBlocks = [...Array(40).keys()].map((i) => ({
            blockNo: UInt64.fromUint((i + 1) * 1_000),
            fee: UInt64.fromUint((i + 1) * 1_000_000),
        }));
        const { getByTestId, getByText, queryByText, store } = renderComponent({ harvestedBlocks: harvestedBlocks.slice(0, 20) }, dispatch);

        await Vue.nextTick();
        // assert initial state
        expect(getByText('1000')).toBeDefined();
        expect(queryByText('21000')).toBeNull();

        dispatch.mockImplementationOnce((type: string) => {
            if (type === 'harvesting/LOAD_HARVESTED_BLOCKS') {
                store.commit('harvesting/harvestedBlocks', harvestedBlocks.slice(20, 40));
                store.commit('harvesting/harvestedBlocksPageInfo', { pageNumber: 2, isLastPage: true });
            }
        });

        // Act:
        getByTestId('btn-next-page').click();
        await Vue.nextTick();

        // // Assert:
        expect(queryByText('1000')).toBeNull();
        expect(getByText('21000')).toBeDefined();
    });

    test(`data is refreshed when the current signer is changed`, async () => {
        // Arrange:
        const dispatch = jest.fn();
        const harvestedBlocks = [{ blockNo: UInt64.fromUint(2_000), fee: UInt64.fromUint(1_000_000) }];
        const { getByText, queryByText, store } = renderComponent({ harvestedBlocks }, dispatch);

        // assert initial state
        expect(getByText('2000')).toBeDefined();
        expect(queryByText('3000')).toBeNull();

        const newCurrentSignerAccountInfo = { address: simpleWallet2.address };
        const newSignerAccountsHarvestedBlocks = [{ blockNo: UInt64.fromUint(3_000), fee: UInt64.fromUint(2_000_000) }];

        dispatch.mockImplementation((type: string) => {
            if (type === 'harvesting/LOAD_HARVESTED_BLOCKS') {
                store.commit('harvesting/harvestedBlocks', newSignerAccountsHarvestedBlocks);
                store.commit('harvesting/harvestedBlocksPageInfo', { pageNumber: 1, isLastPage: true });
            }
        });

        // Act:
        store.commit('account/currentSignerAccountInfo', newCurrentSignerAccountInfo);
        await Vue.nextTick();

        // Assert:
        expect(queryByText('2000')).toBeNull();
        expect(getByText('3000')).toBeDefined();
    });
});
