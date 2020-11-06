import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Signer } from '@/store/Account';
import { FilterOption, TransactionFilterOptions } from '@/store/Transaction';
import { Checkbox, Input } from 'view-design';
import { Transaction } from 'symbol-sdk';
import { TransactionView } from '@/core/transactions/TransactionView';
import { TransactionStatus } from '@/core/transactions/TransactionStatus';
import { TransactionViewFactory } from '@/core/transactions/TransactionViewFactory';

@Component({
    computed: {
        ...mapGetters({
            currentSigner: 'account/currentSigner',
            filteredTransactions: 'transaction/filteredTransactions',
        }),
    },
    components: {
        Checkbox,
        Input,
    },
})
export class TransactionStatusFilterTs extends Vue {
    public currentSigner: Signer;
    public isSelectionShown: boolean = false;
    public transactionFilterOptions = TransactionFilterOptions;
    public heightFrom: number = 0;
    public heightTo: number = 0;

    /**
     * List of filtered transactions.
     */
    public filteredTransactions: Transaction[];

    @Watch('filteredTransactions')
    public setMaxHeight(): void {
        this.heightTo = this.filteredTransactions.length
            ? Math.max(
                  ...this.filteredTransactions.map((transaction) => {
                      return parseInt(this.getHeight(transaction).replace(/,/g, ''));
                  }),
              )
            : 0;
    }

    public onHeightFromChange(value): void {
        this.heightFrom = value;

        this.loadTransactions();
    }

    public onHeightToChange(value): void {
        this.heightTo = value;

        this.loadTransactions();
    }

    private async loadTransactions(): Promise<void> {
        await this.$store.dispatch('transaction/LOAD_TRANSACTIONS', {
            pageSize: 20,
            pageNumber: 1,
            heightFrom: this.heightFrom,
            heightTo: this.heightTo,
        });
    }

    /**
     * Returns the transaction height or number of confirmations
     */
    private getHeight(transaction: Transaction): string {
        const transactionStatus = TransactionView.getTransactionStatus(transaction);
        if (transactionStatus == TransactionStatus.confirmed) {
            return this.view(transaction).info?.height.compact().toLocaleString();
        } else {
            return this.$t(`transaction_status_${transactionStatus}`).toString();
        }
    }

    /// region computed properties getter/setter
    private view(transaction: Transaction): TransactionView<Transaction> {
        return TransactionViewFactory.getView(this.$store, transaction);
    }

    public onChange(key, value): void {
        this.$store.commit('transaction/filterTransactions', {
            filterOption: new FilterOption(key, value),
            currentSignerAddress: this.currentSigner.address.plain(),
        });
    }

    /**
     * Opens selection options block.
     */
    public toggleSelection(): void {
        this.isSelectionShown = !this.isSelectionShown;
    }

    @Watch('currentSigner')
    onCurrentSignerChange() {
        this.$store.commit('transaction/filterTransactions', {
            filterOption: null,
            currentSignerAddress: this.currentSigner.address.plain(),
        });
    }
}
