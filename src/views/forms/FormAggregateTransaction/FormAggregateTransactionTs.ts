import { Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// @ts-ignore
import FormTransferTransaction from '@/views/forms/FormTransferTransaction/FormTransferTransaction.vue';
// @ts-ignore
import FormNamespaceRegistrationTransaction from '@/views/forms/FormNamespaceRegistrationTransaction/FormNamespaceRegistrationTransaction.vue';
// @ts-ignore
import FormMosaicDefinitionTransaction from '@/views/forms/FormMosaicDefinitionTransaction/FormMosaicDefinitionTransaction.vue';
import {
    TransferTransaction,
    PlainMessage,
    UInt64,
    Address,
    NetworkType,
    Transaction,
    NamespaceId,
    PublicAccount,
    MosaicDefinitionTransaction,
    MosaicNonce,
    MosaicId,
    MosaicFlags,
    NamespaceRegistrationTransaction,
} from 'symbol-sdk';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper';
import { ValidationObserver } from 'vee-validate';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';
import { AddressValidator, AliasValidator } from '@/core/validation/validators';
import { TransactionCommandMode } from '@/services/TransactionCommand';
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';

@Component({
    components: {
        FormWrapper,
        ValidationObserver,
        FormTransferTransaction,
        FormNamespaceRegistrationTransaction,
        FormMosaicDefinitionTransaction,
        FormRow,
        MaxFeeSelector,
        ModalTransactionConfirmation,
        ModalFormProfileUnlock,
    },
    computed: {
        ...mapGetters({
            simpleAggregateTransaction: 'aggregateTransaction/simpleAggregateTransaction',
            aggregateTransactionIndex: 'aggregateTransaction/aggregateTransactionIndex',
            networkType: 'network/networkType',
            currentAccount: 'account/currentAccount',
        }),
    },
})
export class FormAggregateTransactionTs extends FormTransactionBase {
    private simpleAggregateTransaction: [];
    private aggregateTransactionIndex: number;

    public formItems = {
        maxFee: 0,
        recipientRaw: '',
        signerPublicKey: '',
    };
    /**
     * currently selected tx title
     * @var {string}
     */
    private txTitle = '';
    /**
     * Whether account is currently being unlocked
     * @var {boolean}
     */
    public isUnlockingAccount: boolean = false;

    /**
     *  items to be binded to the shown form
     * @var {object}
     */
    private currentTxItems = {};

    /**
     * current selected saved transaction
     * @var {object}
     */
    public currentSelectedTransaction = {};

    /**
     * object containing title and component for each newly created tx before being saved
     * @var {object}
     */
    public transaction = {};

    public networkType: NetworkType;

    public currentAccount: AccountModel;

    public onClickAdd(type: number): void {
        this.transaction = {};
        this.currentTxItems = {};

        switch (type) {
            case 1:
                this.transaction['title'] = `${this.$t('simple_transaction')}` + this.aggregateTransactionIndex;
                this.transaction['component'] = FormTransferTransaction;
                break;
            case 2:
                this.transaction['title'] = `${this.$t('mosaic_transaction')}` + this.aggregateTransactionIndex;
                this.transaction['component'] = FormMosaicDefinitionTransaction;
                break;
            case 3:
                this.transaction['title'] = `${this.$t('namespace_transaction')}` + this.aggregateTransactionIndex;
                this.transaction['component'] = FormNamespaceRegistrationTransaction;
                break;
        }
        this.currentSelectedTransaction = this.transaction;
    }

    // on click delete transaction
    public onClickDelete(title: string): void {
        // unlock account before being allowed to delete tx
        if (this.currentAccount) {
            this.txTitle = title;
            this.hasAccountUnlockModal = true;
            return;
        }
    }

    // fetch form details for the selected transaction
    public onSelectTx(title: string) {
        this.$store.dispatch('aggregateTransaction/GET_TRANSACTION_FROM_AGGREGATE_ARRAY', title).then((val) => {
            if (val) {
                this.currentSelectedTransaction = val;
                Object.assign(this.currentTxItems, val.formItems);
            }
        });
    }

    /**
     * on click save transaction, it should be added to the store
     */
    onSaveTransaction(value) {
        if (value) {
            this.$store.dispatch('aggregateTransaction/ON_SAVE_TRANSACTION', {
                title: this.currentSelectedTransaction['title'],
                formItems: value,
                component: this.currentSelectedTransaction['component'],
            });
            this.currentSelectedTransaction = {};
        }
    }
    /**
     * create transfer transaction
     */
    private createTransferTx(tx: {}): TransferTransaction {
        const maxFee = UInt64.fromUint(this.formItems.maxFee);
        this.formItems.recipientRaw = tx['formItems']['recipientRaw'];
        const signer = PublicAccount.createFromPublicKey(tx['formItems']['signerPublicKey'], this.networkType);
        let t: TransferTransaction;
        if (signer.address.plain() !== this.currentAccount.address) {
            t = TransferTransaction.create(
                this.createDeadline(),
                this.instantiatedRecipient,
                // @ts-ignore
                !tx['formItems']['mosaics'].length ? [] : tx['formItems']['mosaics'],
                tx['formItems']['encryptMessage']
                    ? tx['formItems']['encyptedMessage']
                    : PlainMessage.create(tx['formItems']['messagePlain'] || ''),
                this.networkType,
                maxFee,
                '',
                signer,
            );
        } else {
            t = TransferTransaction.create(
                this.createDeadline(),
                this.instantiatedRecipient,
                // @ts-ignore
                !tx['formItems']['mosaics'].length ? [] : tx['formItems']['mosaics'],
                tx['formItems']['encryptMessage']
                    ? tx['formItems']['encyptedMessage']
                    : PlainMessage.create(tx['formItems']['messagePlain'] || ''),
                this.networkType,
                maxFee,
            );
        }
        return t;
    }
    /**
     * create mosaic definition transaction
     */
    private createMosaicTx(tx: {}): MosaicDefinitionTransaction {
        const maxFee = UInt64.fromUint(this.formItems.maxFee);
        //const publicAccount = PublicAccount.createFromPublicKey(this.selectedSigner.publicKey, this.networkType)
        const randomNonce = MosaicNonce.createRandom();
        // - read form for definition
        const mosaicId = MosaicId.createFromNonce(randomNonce, this.selectedSigner.address);
        // the duration must be 0 when the permanent value of true
        if (tx['formItems']['permanent'] == true) {
            tx['formItems']['duration'] == 0;
        }
        return MosaicDefinitionTransaction.create(
            this.createDeadline(),
            randomNonce,
            mosaicId,
            MosaicFlags.create(tx['formItems']['supplyMutable'], tx['formItems']['transferable'], this['formItems']['restrictable']),
            tx['formItems']['divisibility'],
            UInt64.fromUint(tx['formItems']['duration']),
            this.networkType,
            maxFee,
        );
    }
    /**
     * create root namespace transaction
     */
    private CreateRootNameSpaceTx(tx: {}): NamespaceRegistrationTransaction {
        const maxFee = UInt64.fromUint(this.formItems.maxFee);

        return NamespaceRegistrationTransaction.createRootNamespace(
            this.createDeadline(),
            tx['formItems']['newNamespaceName'],
            UInt64.fromUint(tx['formItems']['duration']),
            this.networkType,
            maxFee,
        );
    }

    // /**
    //  * Recipient used in the transaction
    //  * @readonly
    //  * @protected
    //  * @type {Address}
    //  */
    protected get instantiatedRecipient(): Address | NamespaceId {
        const { recipientRaw } = this.formItems;
        if (AddressValidator.validate(recipientRaw)) {
            return Address.createFromRawAddress(recipientRaw);
        } else if (AliasValidator.validate(recipientRaw)) {
            return new NamespaceId(recipientRaw);
        } else {
            return null;
        }
    }

    /**
     * Reset the form with properties
     * @return {void}
     */
    protected resetForm() {
        // - maxFee must be absolute
        this.formItems.maxFee = this.defaultFee;
        this.formItems.signerPublicKey = '';
    }

    /**
     * Setter for TRANSFER transactions that will be staged
     * @see {FormTransactionBase}
     * @throws {Error} If not overloaded in derivate component
     */
    protected setTransactions() {
        throw new Error('This transaction can not be staged');
    }

    /**
     * clear aggregate transactions list after initiating the transaction
     */
    public onConfirmationSuccess() {
        this.$store.dispatch('aggregateTransaction/CLEAR_AGGREGATE_TRANSACTIONS_LIST');
        this.resetForm();
    }

    protected getTransactionCommandMode(transactions: Transaction[]): TransactionCommandMode {
        if (
            this.isMultisigMode() ||
            this.simpleAggregateTransaction.some((tx) => tx['formItems']['signerAddress'] !== this.currentAccount.address)
        ) {
            return TransactionCommandMode.MULTISIGN;
        }
        if (transactions.length > 1) {
            return TransactionCommandMode.AGGREGATE;
        } else {
            return TransactionCommandMode.SIMPLE;
        }
    }

    /**
     * Getter for Aggregate transactions that will be staged
     * @see {FormTransactionBase}
     * @return {Transaction[]}
     */
    protected getTransactions(): Transaction[] {
        const aggregateTransactions = [];
        if (this.simpleAggregateTransaction.length > 0) {
            this.simpleAggregateTransaction.map((tx) => {
                let transaction: Transaction;
                // @ts-ignore
                if (tx['title'].indexOf(`${this.$t('simple_transaction')}`) !== -1) {
                    transaction = this.createTransferTx(tx);
                    // @ts-ignore
                } else if (tx['title'].indexOf(`${this.$t('mosaic_transaction')}`) !== -1) {
                    transaction = this.createMosaicTx(tx);
                    // @ts-ignore
                } else {
                    transaction = this.CreateRootNameSpaceTx(tx);
                }
                aggregateTransactions.push(transaction);
            });
        }
        return aggregateTransactions;
    }

    public get hasAccountUnlockModal(): boolean {
        return this.isUnlockingAccount;
    }

    public set hasAccountUnlockModal(f: boolean) {
        this.isUnlockingAccount = f;
    }
    /**
     * When account is unlocked, the sub account can be created
     */
    public async onAccountUnlocked() {
        try {
            await this.$store.dispatch('aggregateTransaction/ON_DELETE_TRANSACTION', this.txTitle);
            this.currentSelectedTransaction = {};
            this.txTitle = '';
        } catch (e) {
            this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.');
            console.error(e);
        }
    }

    onSubmit() {
        this.command = this.createTransactionCommand();
        this.onShowConfirmationModal();
        return this.command;
    }
}
