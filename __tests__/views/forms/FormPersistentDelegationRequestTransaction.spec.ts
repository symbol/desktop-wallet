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
import { HarvestingModel } from '@/core/database/entities/HarvestingModel';
import { BroadcastResult } from '@/core/transactions/BroadcastResult';
import { CommonHelpers } from '@/core/utils/CommonHelpers';
import i18n from '@/language/index';
import router from '@/router/AppRouter';
import { AccountService } from '@/services/AccountService';
import { HarvestingService } from '@/services/HarvestingService';
import { TransactionAnnouncerService } from '@/services/TransactionAnnouncerService';
import getAppStore from '@/store/index';
import FormPersistentDelegationRequestTransaction from '@/views/forms/FormPersistentDelegationRequestTransaction/FormPersistentDelegationRequestTransaction.vue';
import {
    account1,
    account2,
    cosigner1AccountModel,
    cosigner2AccountModel,
    multisigAccountModel,
    WalletsModel1,
    WalletsModel2,
} from '@MOCKS/Accounts';
import { getHandlers, responses } from '@MOCKS/Http';
import { getTestProfile } from '@MOCKS/profiles';
import TestUIHelpers from '@MOCKS/testUtils/TestUIHelpers';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '@testing-library/vue';
import { createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import WS from 'jest-websocket-mock';
import { setupServer } from 'msw/node';
import { of } from 'rxjs';
import { AccountInfo, NetworkType, SignedTransaction, TransactionMapping } from 'symbol-sdk';
import { VueConstructor } from 'vue/types/umd';
import Vuex, { Store } from 'vuex';

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
afterEach(async () => {
    // await flushPromises();
    httpServer.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => httpServer.close());

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
        await waitFor(() => expect(store.getters['account/currentSignerAccountInfo']).not.toBeNull());
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
        const testAccountBalance = async (balance: string, errorKey: string) => {
            // Arrange:
            const currentAccountModel = WalletsModel1;
            const accountBalance = balance;
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
            TestUIHelpers.expectToastMessage(errorKey, 'error', 6000);
        };

        test('insufficient balance error is thrown', async () => {
            const insufficientBalance = '9999000000';
            await testAccountBalance(insufficientBalance, 'harvesting_account_insufficient_balance');
        });

        test('extra balance error is thrown', async () => {
            const extraBalance = '50000000000000';
            await testAccountBalance(extraBalance, 'harvesting_account_has_extra_balance');
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
            TestUIHelpers.expectToastMessage('harvesting_account_has_zero_importance', 'error', 6000);
        });

        const renderComponentWithAccount = async (
            currentAccountModel: AccountModel,
            knownAccountModels: AccountModel[],
            expectedAccountBalance: string = sufficientAccountBalance,
            balanceTimeout: number = 3_000,
        ): Promise<Store<any>> => {
            // Arrange:
            jest.spyOn(AccountService.prototype, 'getAccountsById').mockImplementation(() => {
                return knownAccountModels.reduce((obj, am) => {
                    obj[am.id] = am;
                    return obj;
                }, {});
            });
            const { store } = await renderComponentWithStore(
                currentAccountModel,
                knownAccountModels.map((am) => am.address),
            );
            // since balance change event is not visible to the UI, we need to wait until it is handled
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(expectedAccountBalance), {
                timeout: balanceTimeout,
            });
            jest.spyOn(TransactionAnnouncerService.prototype, 'announce').mockImplementation((signedTransaction: SignedTransaction) => {
                const transaction = TransactionMapping.createFromPayload(signedTransaction.payload);
                return of(new BroadcastResult(signedTransaction, transaction, true));
            });
            jest.spyOn(TransactionAnnouncerService.prototype, 'announceHashAndAggregateBonded').mockImplementation(
                (_: SignedTransaction, signedAggregateTransaction: SignedTransaction) => {
                    const transaction = TransactionMapping.createFromPayload(signedAggregateTransaction.payload);
                    return of(new BroadcastResult(signedAggregateTransaction, transaction, true));
                },
            );
            return store;
        };

        const selectMultisigAccount = async (currentSignerAddress: string, currentAccountAddress: string, store: Store<any>) => {
            userEvent.click((await within(await screen.findByTestId('signerSelector')).findAllByText(currentAccountAddress))[0]);
            userEvent.click(
                (await within(await screen.findByTestId('signerSelector')).findAllByText(currentSignerAddress, { exact: false }))[0],
            );
            await waitFor(() => expect(store.getters['account/currentSignerAccountInfo'].address.plain()).toBe(currentSignerAddress));
            await waitFor(
                () => expect(store.getters['harvesting/currentSignerHarvestingModel'].accountAddress).toBe(currentSignerAddress),
                { timeout: 3_000 },
            );
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(sufficientAccountBalance), {
                timeout: 3_000,
            });
        };

        const testStartStopHarvestingWithAccount = async (
            currentAccountModel: AccountModel,
            knownAccountModels: AccountModel[],
            currentSignerAccountModel?: AccountModel,
            needToUnlockProfile = false,
            selectedMaxFee = 'slow',
        ) => {
            // test: start harvesting
            // Arrange:
            const store = await renderComponentWithAccount(currentAccountModel, knownAccountModels);

            if (currentSignerAccountModel && currentAccountModel.address !== currentSignerAccountModel.address) {
                await selectMultisigAccount(currentSignerAccountModel.address, currentAccountModel.address, store);
            }

            // Act:
            const input = await screen.findByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            await TestUIHelpers.selectMaxFee(selectedMaxFee);
            const button = await screen.findByRole('button', { name: i18n.t('start_harvesting').toString() });
            userEvent.click(button);
            const confirmButtonInModal = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButtonInModal);
            if (needToUnlockProfile) {
                TestUIHelpers.unlockProfile('Password1');
            }
            await TestUIHelpers.confirmTransactions('Password1');

            // Assert:
            await TestUIHelpers.expectToastMessage('success_transactions_signed', 'success');

            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentSignerAccountModel ? currentSignerAccountModel : currentAccountModel,
                        'post',
                        () => {
                            const harvestingModel: HarvestingModel = store.getters['harvesting/currentSignerHarvestingModel'];
                            return {
                                linked: { publicKey: harvestingModel?.newRemotePublicKey },
                                vrf: { publicKey: harvestingModel?.newVrfPublicKey },
                                node: { publicKey: harvestingModel?.newSelectedHarvestingNode?.nodePublicKey },
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
            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');

            await waitFor(() => expect(store.getters['harvesting/status']).toBe('ACTIVE'), { timeout: 3_000 });
            const stopButton = await screen.findByRole('button', { name: i18n.t('stop_harvesting').toString() }, { timeout: 3_000 });
            expect(stopButton).toBeDefined();

            // test: stop harvesting
            // Arrange:
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentSignerAccountModel ? currentSignerAccountModel : currentAccountModel,
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
            await waitFor(() => expect(store.getters['harvesting/status']).toBe('INACTIVE'), { timeout: 3_000 });
            // await waitFor(() => expect(store.getters['harvesting/currentSignerHarvestingModel'].encRemotePrivateKey).toBeNull(), {
            //     timeout: 3_000,
            // });
            expect(await screen.findByRole('button', { name: i18n.t('start_harvesting').toString() })).toBeDefined();
        };

        test('regular account - harvesting is successfully started and stopped', async () => {
            const knownAccountModels = [WalletsModel1, WalletsModel2];
            const currentAccountModel = WalletsModel1;
            await testStartStopHarvestingWithAccount(currentAccountModel, knownAccountModels, undefined, false, 'fast');
            await CommonHelpers.sleep(2_000);
            await flushPromises();
        });

        test('regular account - harvesting is successfully started and stopped when account is already linked', async () => {
            const knownAccountModels = [WalletsModel1, WalletsModel2];
            const currentAccountModel = WalletsModel1;
            const harvestingModel = {
                accountAddress: 'TBUYPO5DPOWXFVB7TNMDMBRFJBG5FGTXNKKZB7I',
                newEncVrfPrivateKey:
                    'b8483ec1d0934347dbd1cdc66259ed7bc0826834b8b89afa73678dca7818880cMjt+9kHHWs9vjFnSOnBiK6GVH0AXg0dKOVEXZyEBqqurvOIA1MQR7dzAlfSLFVPRVfIi+fG5JsPYJ4J+UdFLwDuIMNd2ZqImg0+L2/bAQ5s=',
                newVrfPublicKey: '2F23F5F5768EDEE9199F0CB29FEB8508CEC3BCAF0033CD3F442D67999FC70A65',
                newEncRemotePrivateKey:
                    '71dd0b7057fc81aa7c87966599650b06234dbcc1b8e132d045f4e28c8aa6c591De+Ujsfjrt2T6xC+R9Rl/6LdgEbOrftpmqSchCRs4sc0/SdAN3WQ2FeVPIjfNa4AeZVM21qqVU9s1zb/2u3TolqYok6SYsr+zLND3H+s+78=',
                newRemotePublicKey: '1069B61D621FB818B2A756A12BCE02F1BC45AEF8E28618EF5BC1FCE8FF915838',
                selectedHarvestingNode: {
                    url: 'https://001-joey-dual.symboltest.net:3001',
                    friendlyName: '001-joey-dual',
                    isDefault: true,
                    networkType: 152,
                    publicKey: 'AAA1922FA60DB681092CBE70A9A1BAB85745025310AE7567F95EA7FD05B3D3FC',
                    nodePublicKey: '05E5C0841720AE9DA737C184429002E917F74FF7A3BF8E11AC2862C4875B3D7E',
                    wsUrl: 'wss://001-joey-dual.symboltest.net:3001/ws',
                },
                delegatedHarvestingRequestFailed: false,
                newSelectedHarvestingNode: {
                    url: 'https://001-joey-dual.symboltest.net:3001',
                    friendlyName: '001-joey-dual',
                    isDefault: true,
                    networkType: 152,
                    publicKey: 'AAA1922FA60DB681092CBE70A9A1BAB85745025310AE7567F95EA7FD05B3D3FC',
                    nodePublicKey: '05E5C0841720AE9DA737C184429002E917F74FF7A3BF8E11AC2862C4875B3D7E',
                    wsUrl: 'wss://001-joey-dual.symboltest.net:3001/ws',
                },
                encRemotePrivateKey:
                    '71dd0b7057fc81aa7c87966599650b06234dbcc1b8e132d045f4e28c8aa6c591De+Ujsfjrt2T6xC+R9Rl/6LdgEbOrftpmqSchCRs4sc0/SdAN3WQ2FeVPIjfNa4AeZVM21qqVU9s1zb/2u3TolqYok6SYsr+zLND3H+s+78=',
                encVrfPrivateKey:
                    'b8483ec1d0934347dbd1cdc66259ed7bc0826834b8b89afa73678dca7818880cMjt+9kHHWs9vjFnSOnBiK6GVH0AXg0dKOVEXZyEBqqurvOIA1MQR7dzAlfSLFVPRVfIi+fG5JsPYJ4J+UdFLwDuIMNd2ZqImg0+L2/bAQ5s=',
                isPersistentDelReqSent: false,
            };
            new HarvestingService().saveHarvestingModel(harvestingModel);
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentAccountModel,
                        'post',
                        () => {
                            return {
                                linked: { publicKey: harvestingModel?.newRemotePublicKey },
                                vrf: { publicKey: harvestingModel?.newVrfPublicKey },
                                node: { publicKey: harvestingModel?.newSelectedHarvestingNode?.nodePublicKey },
                            };
                        },
                        () => sufficientAccountBalance,
                        () => sufficientAccountImportance,
                    ),
                ]),
            );
            await testStartStopHarvestingWithAccount(currentAccountModel, knownAccountModels, undefined, true);
        });

        test('multisig account with 1 required cosignature - harvesting is successfully started and stopped', async () => {
            const knownAccountModels = [cosigner1AccountModel, cosigner2AccountModel, multisigAccountModel];
            const currentAccountModel = cosigner1AccountModel;
            await testStartStopHarvestingWithAccount(currentAccountModel, knownAccountModels, multisigAccountModel);
        });

        test('multisig account with 2 required cosignatures - harvesting is successfully started and stopped', async () => {
            httpServer.use(...getHandlers(responses['multisig-2-2']));
            const knownAccountModels = [cosigner1AccountModel, cosigner2AccountModel, multisigAccountModel];
            const currentAccountModel = cosigner1AccountModel;
            await testStartStopHarvestingWithAccount(currentAccountModel, knownAccountModels, multisigAccountModel);
        });

        const testLinkUnlinkNodePublicKey = async (
            currentAccountModel: AccountModel,
            knownAccountModels: AccountModel[],
            currentSignerAccountModel?: AccountModel,
        ) => {
            // Test: link action
            // Arrange:
            const nodePublicKey = '05E5C0841720AE9DA737C184429002E917F74FF7A3BF8E11AC2862C4875B3D7E';

            const store = await renderComponentWithAccount(currentAccountModel, knownAccountModels);

            if (currentSignerAccountModel && currentAccountModel.address !== currentSignerAccountModel.address) {
                await selectMultisigAccount(currentSignerAccountModel.address, currentAccountModel.address, store);
            }

            // Act:
            const input = await screen.findByPlaceholderText(i18n.t('form_label_network_node_url').toString());
            await userEvent.type(input, 'https://001-joey-dual.symboltest.net:3001');
            const keyLinksTab = await screen.findByText(i18n.t('tab_harvesting_key_links').toString());
            userEvent.click(keyLinksTab);

            expect(await screen.findByText(i18n.t('open_harvesting_keys_warning_title').toString())).toBeDefined();
            const confirmButton = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButton);
            expect(await screen.findByText(i18n.t('delegated_harvesting_keys_info').toString())).toBeDefined();
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentSignerAccountModel ? currentSignerAccountModel : currentAccountModel,
                        'post',
                        () => ({
                            node: { publicKey: nodePublicKey },
                        }),
                        () => sufficientAccountBalance,
                        () => sufficientAccountImportance,
                    ),
                ]),
            );
            const nodeLinkButton = await screen.findByTestId('btn_linkNodeKey');
            userEvent.click(nodeLinkButton);
            await TestUIHelpers.confirmTransactions('Password1');

            // Assert:
            await TestUIHelpers.expectToastMessage('success_transactions_signed', 'success');
            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');

            await waitFor(
                async () => {
                    return expect(
                        (await within(await screen.findByTestId('nodePublicKeyDisplay')).findByText(nodePublicKey)).textContent,
                    ).toBe(nodePublicKey);
                },
                { timeout: 3_000 },
            );

            // Test: unlink action
            // Arrange + Act:
            const nodeUnlinkButton = await screen.findByTestId('btn_unlinkNodeKey');
            userEvent.click(nodeUnlinkButton);
            await TestUIHelpers.confirmTransactions('Password1');

            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');

            // Assert:
            await waitFor(
                async () => expect(within(await screen.findByTestId('nodePublicKeyDisplay')).queryByText(nodePublicKey) === null),
                { timeout: 3_000 },
            );
        };

        const testLinkUnlinkAccountPublicKey = async (
            currentAccountModel: AccountModel,
            knownAccountModels: AccountModel[],
            currentSignerAccountModel?: AccountModel,
        ) => {
            // Test: link action
            // Arrange:
            const store = await renderComponentWithAccount(currentAccountModel, knownAccountModels);

            if (currentSignerAccountModel && currentAccountModel.address !== currentSignerAccountModel.address) {
                await selectMultisigAccount(currentSignerAccountModel.address, currentAccountModel.address, store);
            }

            // Act:
            const keyLinksTab = await screen.findByText(i18n.t('tab_harvesting_key_links').toString());
            userEvent.click(keyLinksTab);

            expect(await screen.findByText(i18n.t('open_harvesting_keys_warning_title').toString())).toBeDefined();
            let confirmButton = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButton);
            expect(await screen.findByText(i18n.t('delegated_harvesting_keys_info').toString())).toBeDefined();
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentSignerAccountModel ? currentSignerAccountModel : currentAccountModel,
                        'post',
                        () => {
                            const harvestingModel: HarvestingModel = store.getters['harvesting/currentSignerHarvestingModel'];
                            return {
                                linked: { publicKey: harvestingModel.newRemotePublicKey },
                            };
                        },
                        () => sufficientAccountBalance,
                        () => sufficientAccountImportance,
                    ),
                ]),
            );
            const nodeLinkButton = await screen.findByTestId('btn_linkAccountKey');
            userEvent.click(nodeLinkButton);
            userEvent.click(await screen.findByText('Select'));
            userEvent.click(await screen.findByText(i18n.t('generate_random_public_key').toString()));
            confirmButton = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButton);

            await TestUIHelpers.confirmTransactions('Password1');

            // Assert:
            await TestUIHelpers.expectToastMessage('success_transactions_signed', 'success');
            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');
            let remoteAccountPublicKey;
            await waitFor(
                async () => {
                    const currentSignerAccountInfo: AccountInfo = store.getters['account/currentSignerAccountInfo'];
                    if (!currentSignerAccountInfo?.supplementalPublicKeys?.linked?.publicKey) {
                        return undefined;
                    }
                    remoteAccountPublicKey = currentSignerAccountInfo?.supplementalPublicKeys?.linked?.publicKey;
                    return expect(
                        await within(await screen.findByTestId('accountPublicKeyDisplay')).findByText(remoteAccountPublicKey),
                    ).toBeDefined();
                },
                { timeout: 3_000 },
            );

            // Test: unlink action
            // Arrange + Act:
            const nodeUnlinkButton = await screen.findByTestId('btn_unlinkAccountKey');
            userEvent.click(nodeUnlinkButton);
            await TestUIHelpers.confirmTransactions('Password1');

            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');

            // Assert:
            await waitFor(
                async () =>
                    expect(within(await screen.findByTestId('accountPublicKeyDisplay')).queryByText(remoteAccountPublicKey) === null),
                { timeout: 3_000 },
            );
        };

        const testLinkUnlinkVrfPublicKey = async (
            currentAccountModel: AccountModel,
            knownAccountModels: AccountModel[],
            currentSignerAccountModel?: AccountModel,
        ) => {
            // Test: link action
            // Arrange:
            const store = await renderComponentWithAccount(currentAccountModel, knownAccountModels);

            if (currentSignerAccountModel && currentAccountModel.address !== currentSignerAccountModel.address) {
                await selectMultisigAccount(currentSignerAccountModel.address, currentAccountModel.address, store);
            }

            // Act:
            const keyLinksTab = await screen.findByText(i18n.t('tab_harvesting_key_links').toString());
            userEvent.click(keyLinksTab);

            expect(await screen.findByText(i18n.t('open_harvesting_keys_warning_title').toString())).toBeDefined();
            let confirmButton = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButton);
            expect(await screen.findByText(i18n.t('delegated_harvesting_keys_info').toString())).toBeDefined();
            httpServer.use(
                ...getHandlers([
                    TestUIHelpers.getAccountsHttpResponse(
                        currentSignerAccountModel ? currentSignerAccountModel : currentAccountModel,
                        'post',
                        () => {
                            const harvestingModel: HarvestingModel = store.getters['harvesting/currentSignerHarvestingModel'];
                            return {
                                vrf: { publicKey: harvestingModel.newVrfPublicKey },
                            };
                        },
                        () => sufficientAccountBalance,
                        () => sufficientAccountImportance,
                    ),
                ]),
            );
            const nodeLinkButton = await screen.findByTestId('btn_linkVrfKey');
            userEvent.click(nodeLinkButton);
            userEvent.click(await screen.findByText('Select'));
            userEvent.click(await screen.findByText(i18n.t('generate_random_public_key').toString()));
            confirmButton = await screen.findByRole('button', { name: i18n.t('confirm').toString() });
            userEvent.click(confirmButton);

            await TestUIHelpers.confirmTransactions('Password1');

            // Assert:
            await TestUIHelpers.expectToastMessage('success_transactions_signed', 'success');
            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');
            let vrfPublicKey;
            await waitFor(
                async () => {
                    const currentSignerAccountInfo: AccountInfo = store.getters['account/currentSignerAccountInfo'];
                    if (!currentSignerAccountInfo?.supplementalPublicKeys?.vrf?.publicKey) {
                        return undefined;
                    }
                    vrfPublicKey = currentSignerAccountInfo?.supplementalPublicKeys?.vrf?.publicKey;
                    return expect(await within(await screen.findByTestId('vrfPublicKeyDisplay')).findByText(vrfPublicKey)).toBeDefined();
                },
                { timeout: 3_000 },
            );

            // Test: unlink action
            // Arrange + Act:
            const nodeUnlinkButton = await screen.findByTestId('btn_unlinkVrfKey');
            userEvent.click(nodeUnlinkButton);
            await TestUIHelpers.confirmTransactions('Password1');

            // in order to trigger account/currentSignerAccountInfo update
            await store.dispatch('account/LOAD_ACCOUNT_INFO');

            // Assert:
            await waitFor(async () => expect(within(await screen.findByTestId('vrfPublicKeyDisplay')).queryByText(vrfPublicKey) === null), {
                timeout: 3_000,
            });
        };

        describe('single key link transactions', () => {
            test('regular account - link/unlink node public key', async () => {
                const knownAccountModels = [WalletsModel1, WalletsModel2];
                const currentAccountModel = WalletsModel1;
                await testLinkUnlinkNodePublicKey(currentAccountModel, knownAccountModels);
            });

            test('multisig account - link/unlink node public key', async () => {
                const knownAccountModels = [cosigner1AccountModel, cosigner2AccountModel, multisigAccountModel];
                const currentAccountModel = cosigner1AccountModel;
                await testLinkUnlinkNodePublicKey(currentAccountModel, knownAccountModels, multisigAccountModel);
            });

            test('regular account - link/unlink account public key', async () => {
                const knownAccountModels = [WalletsModel1, WalletsModel2];
                const currentAccountModel = WalletsModel1;
                await testLinkUnlinkAccountPublicKey(currentAccountModel, knownAccountModels);
            });

            test('multisig account - link/unlink account public key', async () => {
                const knownAccountModels = [cosigner1AccountModel, cosigner2AccountModel, multisigAccountModel];
                const currentAccountModel = cosigner1AccountModel;
                await testLinkUnlinkAccountPublicKey(currentAccountModel, knownAccountModels, multisigAccountModel);
            });

            test('regular account - link/unlink vrf public key', async () => {
                const knownAccountModels = [WalletsModel1, WalletsModel2];
                const currentAccountModel = WalletsModel1;
                await testLinkUnlinkVrfPublicKey(currentAccountModel, knownAccountModels);
            });

            test('multisig account - link/unlink vrf public key', async () => {
                const knownAccountModels = [cosigner1AccountModel, cosigner2AccountModel, multisigAccountModel];
                const currentAccountModel = cosigner1AccountModel;
                await testLinkUnlinkVrfPublicKey(currentAccountModel, knownAccountModels, multisigAccountModel);
            });
        });
    });
});
