import { AccountModel } from '@/core/database/entities/AccountModel';
import i18n from '@/language';
import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/vue';
import { Address, SupplementalPublicKeys } from 'symbol-sdk';
import Vue from 'vue';

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
        const passwordInput = await screen.findByPlaceholderText(i18n.t('please_enter_your_account_password').toString());
        const passwordContainer = passwordInput.parentElement.parentElement.parentElement;
        userEvent.type(passwordInput, profilePassword);
        userEvent.click(await within(passwordContainer).findByRole('button', { name: i18n.t('confirm').toString() }));
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
}
