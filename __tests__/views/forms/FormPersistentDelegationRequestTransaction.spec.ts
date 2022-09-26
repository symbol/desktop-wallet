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
import { RESTService } from '@/services/RESTService';
import getAppStore from '@/store/index';
import FormPersistentDelegationRequestTransaction from '@/views/forms/FormPersistentDelegationRequestTransaction/FormPersistentDelegationRequestTransaction.vue';
import { account1, account2, WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { getHandlers, responses } from '@MOCKS/Http';
import { getTestProfile } from '@MOCKS/profiles';
import userEvent from '@testing-library/user-event';
import { render, waitFor, within } from '@testing-library/vue';
import { createLocalVue } from '@vue/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { of } from 'rxjs';
import { Listener, NetworkType, NewBlock, UInt64 } from 'symbol-sdk';
import Vue from 'vue';
import { VueConstructor } from 'vue/types/umd';
import Vuex, { Store } from 'vuex';

jest.mock('@/core/database/backends/LocalStorageBackend', () => ({
    LocalStorageBackend: jest.requireActual('@/core/database/backends/ObjectStorageBackend').ObjectStorageBackend,
}));

document.createRange = () => ({
    setStart: () => {
        return;
    },
    setEnd: () => {
        return;
    },
    // @ts-ignore
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
    },
});

const server = setupServer(...getHandlers(responses['*']));

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => server.close());

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
        jest.spyOn(RESTService, 'subscribeTransactionChannels').mockImplementation(() => undefined);
        jest.spyOn(Listener.prototype, 'open').mockImplementation(() => Promise.resolve());
        // @ts-ignore
        jest.spyOn(Listener.prototype, 'newBlock').mockImplementation(() => of({ height: UInt64.fromUint(45000) } as NewBlock));
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
        const { findByText } = await renderComponentWithStore(currentAccountModel, [account1.address.plain(), account2.address.plain()]);

        // Assert:
        expect(await findByText(i18n.t('tab_harvesting_delegated_harvesting').toString())).toBeDefined();
        expect(await findByText(currentAccountModel.address)).toBeDefined();
    });

    describe('start harvesting', () => {
        test('insufficient balance error is given', async () => {
            server.use(
                ...[rest.post, rest.get].map((restMethod) =>
                    restMethod('*/accounts', (req, res, ctx) => {
                        const body = [
                            {
                                account: {
                                    version: 1,
                                    address: '986987BBA37BAD72D43F9B58360625484DD29A776A9590FD',
                                    addressHeight: '709881',
                                    publicKey: 'B98356E2B078F4E396E9316DAB8A1CDD2EF5CD6B66578F23F9A9BCF04D8C2A83',
                                    publicKeyHeight: '710138',
                                    accountType: 0,
                                    supplementalPublicKeys: {},
                                    activityBuckets: [],
                                    mosaics: [{ id: '3A8416DB2D53B6C8', amount: '100000000' }],
                                    importance: '0',
                                    importanceHeight: '0',
                                },
                                id: '6329C19EE1738750591A366F',
                            },
                        ];
                        return res(ctx.status(200), ctx.json(body));
                    }),
                ),
            );

            // server.printHandlers();
            const currentAccountModel = WalletsModel1;
            const { getByPlaceholderText, getByRole, findByRole, findByText, store } = await renderComponentWithStore(currentAccountModel, [
                account1.address.plain(),
                account2.address.plain(),
            ]);
            await findByText(currentAccountModel.address);
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance).toBe(100000000));
            // await flushPromises();
            // Act:
            const input = getByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const button = getByRole('button', { name: 'Start Harvesting' });
            button.click();
            const confirmButtonInModal = await findByRole('button', { name: 'Confirm' });
            userEvent.click(confirmButtonInModal);
            // Assert:
            expect(Vue.$toast).toHaveBeenCalledWith(i18n.t('harvesting_account_insufficient_balance'), {
                timeout: 6000,
                type: 'error',
            });
        });

        test('importance is zero error is given', async () => {
            server.use(
                ...[rest.post, rest.get].map((restMethod) =>
                    restMethod('*/accounts', (req, res, ctx) => {
                        const body = [
                            {
                                account: {
                                    version: 1,
                                    address: '986987BBA37BAD72D43F9B58360625484DD29A776A9590FD',
                                    addressHeight: '709881',
                                    publicKey: 'B98356E2B078F4E396E9316DAB8A1CDD2EF5CD6B66578F23F9A9BCF04D8C2A83',
                                    publicKeyHeight: '710138',
                                    accountType: 0,
                                    supplementalPublicKeys: {},
                                    activityBuckets: [],
                                    mosaics: [{ id: '3A8416DB2D53B6C8', amount: '11000000000' }],
                                    importance: '0',
                                    importanceHeight: '0',
                                },
                                id: '6329C19EE1738750591A366F',
                            },
                        ];
                        return res(ctx.status(200), ctx.json(body));
                    }),
                ),
            );
            const currentAccountModel = WalletsModel1;
            const { findByPlaceholderText, getByRole, findByRole, findByText, store } = await renderComponentWithStore(
                currentAccountModel,
                [account1.address.plain(), account2.address.plain()],
            );

            await findByText(currentAccountModel.address);
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance).toBe(11000000000));

            // Act:
            const input = await findByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const button = getByRole('button', { name: 'Start Harvesting' });
            button.click();
            const confirmButtonInModal = await findByRole('button', { name: 'Confirm' });
            userEvent.click(confirmButtonInModal);
            // Assert:
            waitFor(() =>
                expect(Vue.$toast).toHaveBeenCalledWith(i18n.t('harvesting_account_has_zero_importance'), {
                    timeout: 6000,
                    type: 'error',
                }),
            );
        });

        test('harvesting is successfully started', async () => {
            jest.spyOn(AccountService.prototype, 'getAccountsById').mockImplementation(() => {
                const obj = {};
                obj[WalletsModel1.id] = WalletsModel1;
                obj[WalletsModel2.id] = WalletsModel2;
                return obj;
            });
            const currentAccountModel = WalletsModel1;
            const { findByText, findByRole, findByPlaceholderText, store } = await renderComponentWithStore(currentAccountModel, [
                account1.address.plain(),
                account2.address.plain(),
            ]);

            // wait until the balance change event is handled
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance).toBe(90008686336));

            // Act:
            const input = await findByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const button = await findByRole('button', { name: i18n.t('start_harvesting').toString() });
            userEvent.click(button);
            const confirmButtonInModal = await findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButtonInModal);
            expect(await findByText(i18n.t('modal_title_transaction_confirmation').toString())).toBeDefined();
            const passwordInput = await findByPlaceholderText(i18n.t('please_enter_your_account_password').toString());
            const passwordContainer = passwordInput.parentElement.parentElement.parentElement;
            userEvent.type(passwordInput, 'Password1');
            userEvent.click(await within(passwordContainer).findByRole('button', { name: i18n.t('confirm').toString() }));

            // Assert:
            await waitFor(() =>
                expect(Vue.$toast).toHaveBeenCalledWith(i18n.t('success_transactions_signed'), {
                    type: 'success',
                }),
            );

            expect(await findByRole('button', { name: i18n.t('starting').toString() })).toBeDefined();
        });
    });
});
