import { UIBootstrapper } from '@/app/UIBootstrapper';
import { AccountModel } from '@/core/database/entities/AccountModel';
import i18n from '@/language';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '@testing-library/vue';
import { Address, NetworkType, SignedTransaction, SupplementalPublicKeys, TransactionMapping } from 'symbol-sdk';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import getAppStore from '@/store/index';
import router from '@/router/AppRouter';
import { createLocalVue } from '@vue/test-utils';
import { AppStoreWrapper } from '@/app/AppStore';
import { getTestProfile } from '@MOCKS/profiles';
import { AccountService } from '@/services/AccountService';
import { TransactionAnnouncerService } from '@/services/TransactionAnnouncerService';
import { of } from 'rxjs';
import { BroadcastResult } from '@/core/transactions/BroadcastResult';

export default class TestUIHelpers {
    public static getAccountsHttpResponse(
        account: AccountModel,
        method: 'get' | 'post' = 'get',
        supplementalPublicKeysProvider: () => SupplementalPublicKeys = () => ({}),
        balanceProvider: () => string = () => '0',
        importanceProvider: () => string = () => '0',
    ) {
        return {
            origin: '*',
            path: '/accounts',
            method: method,
            status: 200,
            body: () => [
                {
                    account: {
                        version: 1,
                        address: Address.createFromRawAddress(account.address).encoded(),
                        addressHeight: '709881',
                        publicKey: account.publicKey,
                        publicKeyHeight: '710138',
                        accountType: 0,
                        supplementalPublicKeys: supplementalPublicKeysProvider(),
                        activityBuckets: [],
                        mosaics: [{ id: '3A8416DB2D53B6C8', amount: balanceProvider() }],
                        importance: importanceProvider(),
                        importanceHeight: '710138',
                    },
                    id: '6329C19EE1738750591A366F',
                },
            ],
        };
    }

    public static async confirmTransactions(profilePassword: string) {
        expect(await screen.findByText(i18n.t('modal_title_transaction_confirmation').toString())).toBeDefined();
        return await this.unlockProfile(profilePassword);
    }

    public static async unlockProfile(profilePassword: string) {
        const passwordInput = await screen.findByTestId('unlockProfilePasswordInput');
        userEvent.type(passwordInput, profilePassword);
        const confirmButton = await screen.findByTestId('unlockProfileConfirmButton');
        userEvent.click(confirmButton);
        return;
    }

    public static async expectToastMessage(msgKey: string, type: string, msgTimeout?: number, timeout?: number) {
        await waitFor(
            () =>
                expect(Vue.$toast).toHaveBeenCalledWith(i18n.t(msgKey), {
                    ...(msgTimeout ? { timeout: msgTimeout } : {}),
                    type,
                }),
            { timeout },
        );
    }

    public static async selectMaxFee(maxFeeKeyToBeSelected: string, currentSelectedMaxFeeKey = 'slow') {
        // open the dropdown
        userEvent.click(
            (
                await within(await screen.findByTestId('maxFeeSelector')).findAllByText(
                    i18n.t(`fee_speed_${currentSelectedMaxFeeKey}`).toString(),
                    { exact: false },
                )
            )[0],
        );
        // select the target max fee from dropdown
        userEvent.click(
            (
                await within(await screen.findByTestId('maxFeeSelector')).findAllByText(
                    i18n.t(`fee_speed_${maxFeeKeyToBeSelected}`).toString(),
                    { exact: false },
                )
            )[0],
        );
    }

    public static async initializeStore(
        localVue: VueConstructor,
        currentAccount: AccountModel,
        knownAccounts: string[],
        testProfileName: string,
    ) {
        localVue.use(Vuex);
        const store = getAppStore(localVue);
        await store.dispatch('initialize');
        await store.dispatch('profile/SET_CURRENT_PROFILE', getTestProfile(testProfileName));
        await store.dispatch('network/CONNECT', { networkType: NetworkType.TEST_NET });
        await store.dispatch('account/SET_KNOWN_ACCOUNTS', knownAccounts);
        await store.dispatch('account/SET_CURRENT_ACCOUNT', currentAccount);
        await waitFor(() => expect(store.getters['account/currentSignerAccountInfo']).not.toBeNull());
        return store;
    }

    public static renderComponent(testComponent: VueConstructor, localVue: VueConstructor, store: Store<unknown>) {
        const instance = render(testComponent, {
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
    }

    public static async renderComponentWithStore(
        testComponent: VueConstructor,
        currentAccount: AccountModel,
        knownAccounts: string[],
        testProfileName: string,
    ) {
        const localVue = createLocalVue();
        const store = await this.initializeStore(localVue, currentAccount, knownAccounts, testProfileName);
        jest.spyOn(AppStoreWrapper, 'getStore').mockImplementation(() => store);
        return TestUIHelpers.renderComponent(testComponent, localVue, store);
    }

    public static async renderComponentWithAccount(
        testComponent: VueConstructor,
        currentAccountModel: AccountModel,
        knownAccountModels: AccountModel[],
        testProfileName: string,
        expectedAccountBalance?: string,
        balanceTimeout: number = 3_000,
    ): Promise<Store<any>> {
        // Arrange:
        jest.spyOn(AccountService.prototype, 'getAccountsById').mockImplementation(() => {
            return knownAccountModels.reduce((obj, am) => {
                obj[am.id] = am;
                return obj;
            }, {});
        });
        const { store } = await this.renderComponentWithStore(
            testComponent,
            currentAccountModel,
            knownAccountModels.map((am) => am.address),
            testProfileName,
        );
        if (expectedAccountBalance) {
            // since balance change event is not visible to the UI, we need to wait until it is handled
            await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(expectedAccountBalance), {
                timeout: balanceTimeout,
            });
        }
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
    }

    public static async selectMultisigAccount(
        currentSignerAddress: string,
        currentAccountAddress: string,
        store: Store<any>,
        expectedAccountBalance?: string,
    ) {
        userEvent.click((await within(await screen.findByTestId('signerSelector')).findAllByText(currentAccountAddress))[0]);
        userEvent.click(
            (await within(await screen.findByTestId('signerSelector')).findAllByText(currentSignerAddress, { exact: false }))[0],
        );
        await waitFor(() => expect(store.getters['account/currentSignerAccountInfo'].address.plain()).toBe(currentSignerAddress));
        await waitFor(() => expect(store.getters['harvesting/currentSignerHarvestingModel'].accountAddress).toBe(currentSignerAddress), {
            timeout: 3_000,
        });
        await waitFor(() => expect(store.getters['mosaic/networkBalanceMosaics'].balance.toString()).toBe(expectedAccountBalance), {
            timeout: 3_000,
        });
    }
}
