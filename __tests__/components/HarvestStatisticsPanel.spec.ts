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
import { render, fireEvent } from '@testing-library/vue';
import HarvestStatisticsPanel from '@/components/HarvestStatisticsPanel/HarvestStatisticsPanel.vue';
import {
    HarvestedBlockStats,
    HarvestingStatus,
    HARVESTING_BLOCKS_POLLING_INTERVAL_SECS,
    HARVESTING_STATUS_POLLING_INTERVAL_SECS,
    HARVESTING_STATUS_POLLING_TRIAL_LIMIT,
} from '@/store/Harvesting';
import { mosaicsMock } from '@MOCKS/mosaics';
import { UInt64 } from 'symbol-sdk';
import { getStore } from '@MOCKS/Store';
import i18n from '@/language/index';
import Vue from 'vue';
import { simpleWallet1, simpleWallet2 } from '@MOCKS/Accounts';
import { HarvestingService } from '@/services/HarvestingService';

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('components/HarvestStatisticsPanel', () => {
    const accountAddress = simpleWallet1.address.plain();
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
    const defaultHarvestingStatus = HarvestingStatus.INACTIVE;
    const harvestedBlockStats: HarvestedBlockStats = {
        totalBlockCount: 1_000,
        totalFeesEarned: UInt64.fromNumericString('0'),
    };
    const currentSignerHarvestingModel = { accountAddress: accountAddress, delegatedHarvestingRequestFailed: false };
    const mockHarvestingStore = {
        namespaced: true,
        state: {
            status: defaultHarvestingStatus,
            harvestedBlockStats: harvestedBlockStats,
            isFetchingHarvestedBlockStats: false,
            pollingTrials: 0,
            currentSignerHarvestingModel: currentSignerHarvestingModel,
        },
        getters: {
            status: (state) => state.status,
            harvestedBlockStats: (state) => state.harvestedBlockStats,
            isFetchingHarvestedBlockStats: (state) => state.isFetchingHarvestedBlockStats,
            pollingTrials: (state) => state.pollingTrials,
            currentSignerHarvestingModel: (state) => state.currentSignerHarvestingModel,
        },
        mutations: {
            status: (state, status) => (state.status = status),
            harvestedBlockStats: (state, harvestedBlockStats) => (state.harvestedBlockStats = harvestedBlockStats),
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
            ...render(HarvestStatisticsPanel, {
                store,
                i18n,
            }),
            store,
        };
    };

    test('renders component', async () => {
        // Arrange + Act:
        const { getByText, getByTestId } = renderComponent();

        // Assert:
        expect(getByText(i18n.t('harvesting_status').toString())).toBeDefined();
        expect(getByText(i18n.t('blocks_made').toString())).toBeDefined();
        expect(getByText(i18n.t('fees_collected').toString())).toBeDefined();
        expect(getByTestId('status-text').textContent).toBe(i18n.t('harvesting_status_inactive').toString());
        expect(getByTestId('total-block-count').textContent.trim()).toBe('1000');
        expect(getByTestId('total-fees-earned').textContent.trim()).toBe('0');
    });

    Object.keys(HarvestingStatus).map((key) => {
        test(`harvesting status is changed to ${key} when refresh button is clicked`, async () => {
            // Arrange:
            const dispatch = jest.fn();
            const { getByTestId, getByRole, store } = renderComponent({}, dispatch);

            dispatch.mockImplementationOnce((type: string) => {
                if (type === 'harvesting/FETCH_STATUS') {
                    store.commit('harvesting/status', HarvestingStatus[key]);
                }
            });

            // Act:
            fireEvent.click(getByRole('button'));
            await Vue.nextTick();

            // Assert:
            expect(getByTestId('status-text').textContent).toBe(i18n.t(`harvesting_status_${key.toLowerCase()}`).toString());
        });
    });

    test(`harvested block stats are refreshed when refresh button is clicked`, async () => {
        // Arrange:
        const harvestedBlockStats = {
            totalBlockCount: 2_000,
            totalFeesEarned: UInt64.fromNumericString('10000000'),
        };
        const dispatch = jest.fn();
        const { getByTestId, getByRole, store } = renderComponent({}, dispatch);

        dispatch.mockImplementation((type: string) => {
            if (type === 'harvesting/LOAD_HARVESTED_BLOCKS_STATS') {
                store.commit('harvesting/harvestedBlockStats', harvestedBlockStats);
            }
        });

        // Act:
        fireEvent.click(getByRole('button'));
        await Vue.nextTick();

        // Assert:
        expect(getByTestId('total-block-count').textContent.trim()).toBe('2000');
        expect(getByTestId('total-fees-earned').textContent.trim()).toBe('10.0');
    });

    test(`harvesting status is auto refreshed to ACTIVE when harvesting status is INPROGRESS_ACTIVATION`, async () => {
        // Arrange:
        const dispatch = jest.fn();
        const { getByTestId, store } = renderComponent(
            {
                status: HarvestingStatus.INPROGRESS_ACTIVATION,
            },
            dispatch,
        );

        dispatch.mockImplementation((type: string) => {
            if (type === 'harvesting/FETCH_STATUS') {
                store.commit('harvesting/status', HarvestingStatus.ACTIVE);
            }
        });

        // Act:
        await Vue.nextTick();
        jest.advanceTimersByTime(HARVESTING_STATUS_POLLING_INTERVAL_SECS * 1000);
        await Vue.nextTick();

        // Assert:
        expect(getByTestId('status-text').textContent).toBe(i18n.t(`harvesting_status_active`).toString());
    });

    test(`harvesting status is FAILED`, async () => {
        // Arrange:
        const dispatch = jest.fn();
        const { getByTestId } = renderComponent(
            {
                status: HarvestingStatus.FAILED,
            },
            dispatch,
        );
        jest.spyOn(HarvestingService.prototype, 'getAllHarvestingModels').mockImplementation(() => [currentSignerHarvestingModel]);
        jest.spyOn(HarvestingService.prototype, 'updateDelegatedHarvestingRequestFailed').mockImplementation(() => {
            return;
        });

        // Act:
        await Vue.nextTick();

        // Assert:
        expect(getByTestId('status-text').textContent).toBe(i18n.t(`harvesting_status_failed`).toString());
    });

    test(`harvesting status is set to FAILED when polling limit is reached`, async () => {
        // Arrange:
        const dispatch = jest.fn();
        const { getByTestId, store } = renderComponent(
            {
                status: HarvestingStatus.INPROGRESS_ACTIVATION,
                pollingTrials: HARVESTING_STATUS_POLLING_TRIAL_LIMIT + 1,
            },
            dispatch,
        );
        jest.spyOn(HarvestingService.prototype, 'getAllHarvestingModels').mockImplementation(() => [currentSignerHarvestingModel]);
        jest.spyOn(HarvestingService.prototype, 'updateDelegatedHarvestingRequestFailed').mockImplementation(() => {
            return;
        });

        // Act:
        await Vue.nextTick();
        jest.advanceTimersByTime(HARVESTING_STATUS_POLLING_INTERVAL_SECS * 1000);
        store.commit('harvesting/status', HarvestingStatus.FAILED);
        await Vue.nextTick();

        // Assert:
        expect(getByTestId('status-text').textContent).toBe(i18n.t(`harvesting_status_failed`).toString());
    });

    test(`refresh status blocks periodically when harvesting status is active`, async () => {
        // Arrange:
        const harvestedBlockStats = {
            totalBlockCount: 2_000,
            totalFeesEarned: UInt64.fromNumericString('10000000'),
        };
        const dispatch = jest.fn();
        const { getByTestId, store } = renderComponent(
            {
                status: HarvestingStatus.ACTIVE,
            },
            dispatch,
        );
        // assert initial state
        expect(getByTestId('total-block-count').textContent.trim()).toBe('1000');
        expect(getByTestId('total-fees-earned').textContent.trim()).toBe('0');

        // Act:
        await Vue.nextTick();
        dispatch.mockImplementation((type: string) => {
            if (type === 'harvesting/LOAD_HARVESTED_BLOCKS_STATS') {
                store.commit('harvesting/harvestedBlockStats', harvestedBlockStats);
            }
        });
        jest.advanceTimersByTime(HARVESTING_BLOCKS_POLLING_INTERVAL_SECS * 1000);
        await Vue.nextTick();

        // Assert:
        expect(getByTestId('total-block-count').textContent.trim()).toBe('2000');
        expect(getByTestId('total-fees-earned').textContent.trim()).toBe('10.0');
    });

    test(`harvesting status is refreshed when current signer is changed`, async () => {
        // Arrange:
        const newCurrentSignerAccountInfo = { address: simpleWallet2.address };
        const dispatch = jest.fn();
        const { getByTestId, store } = renderComponent(
            {
                status: HarvestingStatus.ACTIVE,
            },
            dispatch,
        );

        dispatch.mockImplementation((type: string) => {
            if (type === 'harvesting/FETCH_STATUS') {
                store.commit('harvesting/status', HarvestingStatus.INACTIVE);
            }
        });

        // Act:
        store.commit('account/currentSignerAccountInfo', newCurrentSignerAccountInfo);
        await Vue.nextTick();

        // Assert:
        expect(getByTestId('status-text').textContent).toBe(i18n.t(`harvesting_status_inactive`).toString());
    });
});
