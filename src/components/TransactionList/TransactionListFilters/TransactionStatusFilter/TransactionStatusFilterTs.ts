import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Signer } from '@/store/Account';
import { FilterOption, TransactionFilterOptions } from '@/store/Transaction';

@Component({
    computed: {
        ...mapGetters({
            currentSigner: 'account/currentSigner',
        }),
    },
})
export class TransactionStatusFilterTs extends Vue {
    public currentSigner: Signer;
    public isSelectionShown: boolean = false;
    public transactionFilterOptions = TransactionFilterOptions;

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
