/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Account, Transaction } from 'symbol-sdk';
// internal dependencies
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';
import { AccountTransactionSigner, TransactionAnnouncerService, TransactionSigner } from '@/services/TransactionAnnouncerService';
// child components
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';
// @ts-ignore
import FormProfileUnlock from '@/views/forms/FormProfileUnlock/FormProfileUnlock.vue';
// @ts-ignore
import HardwareConfirmationButton from '@/components/HardwareConfirmationButton/HardwareConfirmationButton.vue';
import { TransactionCommand } from '@/services/TransactionCommand';

@Component({
    components: {
        FormWrapper,
        TransactionDetails,
        FormProfileUnlock,
        HardwareConfirmationButton,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
        }),
    },
})
export class FormTransactionConfirmationTs extends Vue {
    @Prop({
        required: true,
    })
    public command: TransactionCommand;

    /**
     * Whether to hide submit button
     */
    @Prop({ default: false }) hideSubmit: boolean;

    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    public currentAccount: AccountModel;

    /**
     * List of transactions on-stage
     * @see {Store.Account}
     * @var {Transaction[]}
     */
    public stagedTransactions: Transaction[] = [];

    public async mounted() {
        this.stagedTransactions = await this.command.resolveTransactions().toPromise();
    }

    /// region computed properties getter/setter
    /**
     * Returns whether current account is a hardware wallet
     * @return {boolean}
     */
    public get isUsingHardwareWallet(): boolean {
        // XXX should use "stagedTransaction.signer" to identify account
        return (
            this.currentAccount.type === AccountType.TREZOR ||
            this.currentAccount.type === AccountType.LEDGER ||
            this.currentAccount.type === AccountType.LEDGER_OPT_IN
        );
    }
    /// end-region computed properties getter/setter

    /**
     * Hook called when child component FormProfileUnlock emits
     * the 'success' event.
     *
     * This hook shall *sign transactions* with the \a account
     * that has been unlocked. Subsequently it will also announce
     * the signed transaction.
     *
     */
    public async onAccountUnlocked({ account }: { account: Account }): Promise<void> {
        // - log about unlock success
        this.$store.dispatch('diagnostic/ADD_INFO', `Account ${account.address.plain()} unlocked successfully.`);
        // - get transaction stage config
        return this.onSigner(new AccountTransactionSigner(account));
    }

    /**
     * Hook called when child component FormProfileUnlock emits
     * the 'success' event.
     *
     * This hook shall *sign transactions* with the \a account
     * that has been unlocked. Subsequently it will also announce
     * the signed transaction.
     *
     */
    public async onSigner(transactionSigner: TransactionSigner): Promise<void> {
        // - log about unlock success
        // - get transaction stage config
        const announcements = await this.command.announce(new TransactionAnnouncerService(this.$store), transactionSigner).toPromise();
        announcements.forEach((announcement) => {
            announcement.subscribe((res) => {
                if (!res.success) {
                    this.$store.dispatch('notification/ADD_ERROR', res.error, { root: true });
                }
            });
        });
        // - notify about successful transaction announce
        this.$store.dispatch('notification/ADD_SUCCESS', 'success_transactions_signed');
        this.$emit('success');
    }

    /**
     * Hook called when child component FormProfileUnlock or
     * HardwareConfirmationButton emit the 'error' event.
     * @param {string} message
     * @return {void}
     */
    public onError(error: string) {
        this.$emit('error', error);
    }

    public onSubmit() {
        (this.$refs.unlockForm as FormProfileUnlock).processVerification();
    }
}
