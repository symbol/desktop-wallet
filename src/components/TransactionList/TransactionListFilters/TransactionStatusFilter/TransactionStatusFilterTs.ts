import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Signer } from '@/store/Account';
import { FilterOption, HeightFilter, TransactionFilterOptions } from '@/store/Transaction';
import { Checkbox, Input, Button } from 'view-design';

@Component({
    computed: {
        ...mapGetters({
            currentSigner: 'account/currentSigner',
            filteredTransactions: 'transaction/filteredTransactions',
        }),
    },
    components: {
        Button,
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
     * Handler for heightFrom input changes.
     * @param value
     */
    public onHeightFromChange(value): void {
        this.heightFrom = value;
    }

    /**
     * Handler for heightTo input changes.
     * @param value
     */
    public onHeightToChange(value): void {
        this.heightTo = value;
    }

    /**
     * Method on OK click.
     * Sets height filter in store and process transactions loading.
     */
    public async onHeightFilterClick(): Promise<void> {
        this.$store.commit('transaction/setHeightFilter', new HeightFilter(this.heightFrom, this.heightTo));

        await this.$store.dispatch('transaction/LOAD_TRANSACTIONS', {
            pageSize: 20,
            pageNumber: 1,
        });
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
