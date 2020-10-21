// external dependenies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Transaction } from 'symbol-sdk';
import { mapGetters } from 'vuex';
// child components
// @ts-ignore
import TransactionRow from '@/components/TransactionList/TransactionRow/TransactionRow.vue';
// @ts-ignore
import TransactionListHeader from '@/components/TransactionList/TransactionListHeader/TransactionListHeader.vue';
import { PageInfo } from '@/store/Transaction';

@Component({
    components: {
        TransactionRow,
        TransactionListHeader,
    },
    computed: mapGetters({
        isFetchingTransactions: 'transaction/isFetchingTransactions',
        currentConfirmedPage: 'transaction/currentConfirmedPage',
    }),
})
export class TransactionTableTs extends Vue {
    @Prop({ default: [] })
    public transactions: Transaction[];

    @Prop({ default: 'no_data_transactions' })
    public emptyMessage: string;

    @Prop({ default: null })
    public loadMore: () => void;

    @Prop({ default: 'pagination' })
    public paginationType!: 'pagination' | 'scroll';

    public nodata = [...Array(10).keys()];

    /**
     * Whether transactios are currently being fetched
     * @protected
     * @type {boolean}
     */
    protected isFetchingTransactions: boolean;

    /**
     * Current confirmed page info
     * @see {Transaction.PageInfo}
     * @var {PageInfo}
     */
    public currentConfirmedPage: PageInfo;

    /**
     * Whether infinite scroll is currently disabled
     */
    protected get infiniteScrollDisabled() {
        return this.paginationType !== 'scroll' || this.isFetchingTransactions;
    }

    /**
     * Whether it is currently fetching more transactions from repository
     */
    protected get isFetchingMoreTransctions(): boolean {
        return this.isFetchingTransactions && this.currentConfirmedPage.pageNumber > 1;
    }
}
