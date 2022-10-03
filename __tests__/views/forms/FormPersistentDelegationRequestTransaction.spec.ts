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
import { AppStoreWrapper } from '@/app/AppStore';
import { UIBootstrapper } from '@/app/UIBootstrapper';
import { AccountModel } from '@/core/database/entities/AccountModel';
import i18n from '@/language/index';
import router from '@/router/AppRouter';
import { AccountService } from '@/services/AccountService';
import getAppStore from '@/store/index';
import FormPersistentDelegationRequestTransaction from '@/views/forms/FormPersistentDelegationRequestTransaction/FormPersistentDelegationRequestTransaction.vue';
import { account1, account2, WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { getHandlers, responses } from '@MOCKS/Http';
import { getTestProfile } from '@MOCKS/profiles';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/vue';
import { createLocalVue } from '@vue/test-utils';
import { setupServer } from 'msw/node';
import { of } from 'rxjs';
import { AggregateTransaction, NetworkType, SignedTransaction, Transaction, TransactionType } from 'symbol-sdk';
import Vue from 'vue';
import { VueConstructor } from 'vue/types/umd';
import Vuex, { Store } from 'vuex';
import WS from 'jest-websocket-mock';
import { TransactionAnnouncerService } from '@/services/TransactionAnnouncerService';
import { BroadcastResult } from '@/core/transactions/BroadcastResult';
import { HarvestingModel } from '@/core/database/entities/HarvestingModel';
import TestUIHelpers from '@MOCKS/testUtils/TestUIHelpers';

// mock local storage
jest.mock('@/core/database/backends/LocalStorageBackend', () => ({
    LocalStorageBackend: jest.requireActual('@/core/database/backends/ObjectStorageBackend').ObjectStorageBackend,
}));

// mock http server with base responses denoted by *
const httpServer = setupServer(...getHandlers(responses['*']));
// mock websocket server
const websocketServer = new WS('wss://001-joey-dual.symboltest.net:3001/ws', { jsonProtocol: true });
websocketServer.on('connection', (socket) => {
    console.log('Websocket client connected!');
    socket.send('{"uid":"FAKE_UID"}');
});

const sufficientAccountBalance = '10000000001';
const sufficientAccountImportance = '1';

beforeAll(() => httpServer.listen());
afterEach(() => {
    httpServer.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => httpServer.close());

// @ts-ignore
Vue.$toast = jest.fn();

describe('components/FormPersistentDelegationRequestTransaction', () => {
    const renderComponent = (localVue: VueConstructor, store: Store<unknown>) => {
        const instance = render(FormPersistentDelegationRequestTransaction, {
            store,
            // @ts-ignore
            router,
            i18n,
            localVue: UIBootstrapper.initializePlugins(localVue),
        });
        return {
            ...instance,
            store,
        };
    };

    const initializeStore = async (localVue: VueConstructor, currentAccount: AccountModel, knownAccounts: string[]) => {
        localVue.use(Vuex);
        const store = getAppStore(localVue);
        await store.dispatch('initialize');
        await store.dispatch('profile/SET_CURRENT_PROFILE', getTestProfile('profile1'));
        await store.dispatch('network/CONNECT', { networkType: NetworkType.TEST_NET });
        await store.dispatch('account/SET_KNOWN_ACCOUNTS', knownAccounts);
        await store.dispatch('account/SET_CURRENT_ACCOUNT', currentAccount);
        return store;
    };

    const renderComponentWithStore = async (currentAccount: AccountModel, knownAccounts: string[]) => {
        const localVue = createLocalVue();
        const store = await initializeStore(localVue, currentAccount, knownAccounts);
        jest.spyOn(AppStoreWrapper, 'getStore').mockImplementation(() => store);
        return renderComponent(localVue, store);
    };

    test('renders component', async () => {
        // Arrange + Act:
        const currentAccountModel = WalletsModel1;
        await renderComponentWithStore(currentAccountModel, [account1.address.plain(), account2.address.plain()]);

        // Assert:
        expect(await screen.findByText(i18n.t('tab_harvesting_delegated_harvesting').toString())).toBeDefined();
        expect(await screen.findByText(currentAccountModel.address)).toBeDefined();
    });

    describe('start/stop harvesting', () => {
        test('insufficient balance error is thrown', async () => {
            // Arrange:
            const currentAccountModel = WalletsModel1;
            const accountBalance = '9999000000';
            httpServer.use(
                ...getHandlers([TestUIHelpers.getAccountsHttpResponse(currentAccountModel, 'post', undefined, () => accountBalance)]),
            );

            const { store } = await renderComponentWithStore(currentAccountModel, [account1.address.plain(), account2.address.plain()]);
            await screen.findByText(currentAccountModel.address);
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(accountBalance));

            // Act:
            const input = screen.getByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const button = screen.getByRole('button', { name: i18n.t('start_harvesting').toString() });
            userEvent.click(button);
            const confirmButtonInModal = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButtonInModal);

            // Assert:
            expect(Vue.$toast).toHaveBeenCalledWith(i18n.t('harvesting_account_insufficient_balance'), {
                timeout: 6000,
                type: 'error',
            });
        });

        test('importance is zero error is thrown', async () => {
            // Arrange:
            const currentAccountModel = WalletsModel1;
            const accountImportance = '0';
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentAccountModel,
                        'post',
                        undefined,
                        () => sufficientAccountBalance,
                        () => accountImportance,
                    ),
                ]),
            );

            const { store } = await renderComponentWithStore(currentAccountModel, [account1.address.plain(), account2.address.plain()]);
            await screen.findByText(currentAccountModel.address);
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(sufficientAccountBalance));

            // Act:
            const input = await screen.findByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const button = await screen.findByRole('button', { name: 'Start Harvesting' });
            userEvent.click(button);
            const confirmButtonInModal = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButtonInModal);

            // Assert:
            waitFor(() =>
                expect(Vue.$toast).toHaveBeenCalledWith(i18n.t('harvesting_account_has_zero_importance'), {
                    timeout: 6000,
                    type: 'error',
                }),
            );
        });

        test('harvesting is successfully started and stopped', async () => {
            // test: start harvesting
            // Arrange:
            jest.spyOn(AccountService.prototype, 'getAccountsById').mockImplementation(() => {
                const obj = {};
                obj[WalletsModel1.id] = WalletsModel1;
                obj[WalletsModel2.id] = WalletsModel2;
                return obj;
            });
            const currentAccountModel = WalletsModel1;
            const { store } = await renderComponentWithStore(currentAccountModel, [account1.address.plain(), account2.address.plain()]);
            // since balance change event is not visible to the UI, we need to wait until it is handled
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(sufficientAccountBalance), {
                timeout: 3_000,
            });
            jest.spyOn(TransactionAnnouncerService.prototype, 'announce').mockImplementation((signedTransaction: SignedTransaction) => {
                let transaction: Transaction;
                if (signedTransaction.type === TransactionType.AGGREGATE_COMPLETE) {
                    transaction = AggregateTransaction.createFromPayload(signedTransaction.payload);
                    return of(new BroadcastResult(signedTransaction, transaction, true));
                }
                return of();
            });
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentAccountModel,
                        'post',
                        () => {
                            const harvestingModel: HarvestingModel = store.getters['harvesting/currentSignerHarvestingModel'];
                            return {
                                linked: { publicKey: harvestingModel?.newRemotePublicKey },
                                vrf: { publicKey: harvestingModel?.newVrfPublicKey },
                                node: { publicKey: harvestingModel?.selectedHarvestingNode?.nodePublicKey },
                            };
                        },
                        () => sufficientAccountBalance,
                        () => sufficientAccountImportance,
                    ),
                    {
                        origin: '*',
                        path: '/node/unlockedaccount',
                        method: 'get',
                        status: 200,
                        body: () => {
                            const harvestingModel: HarvestingModel = store.getters['harvesting/currentSignerHarvestingModel'];
                            return { unlockedAccount: [harvestingModel?.newRemotePublicKey] };
                        },
                    },
                ]),
            );

            // Act:
            const input = await screen.findByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const button = await screen.findByRole('button', { name: i18n.t('start_harvesting').toString() });
            userEvent.click(button);
            const confirmButtonInModal = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButtonInModal);
            await TestUIHelpers.confirmTransactions('Password1');

            // Assert:
            await waitFor(() =>
                expect(Vue.$toast).toHaveBeenCalledWith(i18n.t('success_transactions_signed'), {
                    type: 'success',
                }),
            );
            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');
            const stopButton = await screen.findByRole('button', { name: i18n.t('stop_harvesting').toString() });
            expect(stopButton).toBeDefined();

            // test: stop harvesting
            // Arrange:
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentAccountModel,
                        'post',
                        undefined,
                        () => sufficientAccountBalance,
                        () => sufficientAccountImportance,
                    ),
                    {
                        origin: '*',
                        path: '/node/unlockedaccount',
                        method: 'get',
                        status: 200,
                        body: () => [],
                    },
                ]),
            );

            // Act:
            userEvent.click(stopButton);
            await TestUIHelpers.confirmTransactions('Password1');
            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');

            // Assert:
            await waitFor(() => expect(store.getters['harvesting/status']).toBe('INACTIVE'));
            expect(await screen.findByRole('button', { name: i18n.t('start_harvesting').toString() })).toBeDefined();
        }, 20_000);
    });
});
