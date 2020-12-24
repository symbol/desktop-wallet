import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Signer } from '@/store/Account';
import { FilterOption, TransactionFilterOptions } from '@/store/Transaction';
import { Checkbox } from 'view-design';

@Component({
    computed: {
        ...mapGetters({
            currentSigner: 'account/currentSigner',
        }),
    },
    components: {
        Checkbox,
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
     * Toggles selection options block.
     */
    public toggleSelection(): void {
        this.isSelectionShown = !this.isSelectionShown;
    }

    /**
     * Closes selection options block.
     */
    public closeSelection(): void {
        this.isSelectionShown = false;
    }

    @Watch('currentSigner')
    onCurrentSignerChange() {
        this.$store.commit('transaction/filterTransactions', {
            filterOption: null,
            currentSignerAddress: this.currentSigner.address.plain(),
        });
    }
}
