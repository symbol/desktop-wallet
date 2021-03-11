/*
 * Copyright 2020 NEM (https://nem.io)
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
import { mapGetters } from 'vuex';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AggregateTransaction, Convert, MosaicId, Transaction } from 'symbol-sdk';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
// child components
// @ts-ignore
import ModalTransactionCosignature from '@/views/modals/ModalTransactionCosignature/ModalTransactionCosignature.vue';
// @ts-ignore
import ModalTransactionDetails from '@/views/modals/ModalTransactionDetails/ModalTransactionDetails.vue';
// @ts-ignore
import PageTitle from '@/components/PageTitle/PageTitle.vue';
// @ts-ignore
import TransactionListFilters from '@/components/TransactionList/TransactionListFilters/TransactionListFilters.vue';
// @ts-ignore
import TransactionTable from '@/components/TransactionList/TransactionTable/TransactionTable.vue';
// @ts-ignore
import ModalTransactionExport from '@/views/modals/ModalTransactionExport/ModalTransactionExport.vue';
import { PageInfo } from '@/store/Transaction';
// @ts-ignore
import Pagination from '@/components/Pagination/Pagination.vue';

@Component({
    components: {
        ModalTransactionCosignature,
        ModalTransactionDetails,
        PageTitle,
        TransactionListFilters,
        TransactionTable,
        ModalTransactionExport,
        Pagination,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            networkMosaic: 'mosaic/networkMosaic',
            filteredTransactions: 'transaction/filteredTransactions',
            generationHash: 'network/generationHash',
            currentConfirmedPage: 'transaction/currentConfirmedPage',
        }),
    },
})
export class TransactionListTs extends Vue {
    @Prop({
        default: '',
    })
    address: string;

    /**
     * Number of txs visible in each page
     */
    @Prop({
        default: 10,
    })
    pageSize: number;

    @Prop({
        default: 'pagination',
    })
    paginationType: 'pagination' | 'scroll';

    /**
     * Number of txs to be loaded from repository in each request
     */
    @Prop({
        default: 20,
    })
    requestPageSize: number;

    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    public currentAccount: AccountModel;

    /**
     * Network mosaic id
     * @see {Store.Mosaic}
     * @var {MosaicId}
     */
    public networkMosaic: MosaicId;

    /**
     * List of filtered transactions (per-request)
     */
    public filteredTransactions: Transaction[];

    /**
     * The current page number
     * @var {number}
     */
    public currentPage: number = 1;

    /**
     * Active transaction (in-modal)
     * @var {Transaction}
     */
    public activeTransaction: Transaction = null;

    /**
     * Active bonded transaction (in-modal)
     * @var {AggregateTransaction}
     */
    public activePartialTransaction: AggregateTransaction = null;

    /**
     * Whether the detail modal box is open
     * @var {boolean}
     */
    public isDisplayingDetails: boolean = false;

    /**
     * Whether the cosignature modal box is open
     * @var {boolean}
     */
    public isAwaitingCosignature: boolean = false;

    /**
     * Current generationHash
     * @see {Store.Network}
     * @var {string}
     */
    public generationHash: string;

    /**
     * Whether currently viewing export
     * @var {boolean}
     */
    public isViewingExportModal: boolean = false;

    /**
     * Current confirmed page info
     * @see {Transaction.PageInfo}
     * @var {PageInfo}
     */
    public currentConfirmedPage: PageInfo;

    public getEmptyMessage() {
        return 'no_data_transactions';
    }

    /// region computed properties getter/setter
    public get countPages(): number {
        if (!this.filteredTransactions) {
            return 0;
        }
        return Math.ceil([...this.filteredTransactions].length / this.pageSize);
    }

    public get totalCountItems(): number {
        return this.filteredTransactions.length;
    }

    /**
     * Returns the transactions of the current page
     * from the getter that matches the provided tab name.
     * Undefined means the list is being loaded.
     * @returns {Transaction[]}
     */
    public getCurrentPageTransactions(): Transaction[] {
        // get current tab transactions
        const transactions = this.filteredTransactions;
        // get pagination params
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        // slice and return
        return [...transactions].slice(start, end);
    }

    /**
     * Returns the transctions
     * If the pagination type is (infinite) scroll then returns all
     * If the pagination type is pagination(paginated) then returns the current page txs
     *
     * @return {Transaction[]}
     */
    public getTransactions(): Transaction[] {
        return this.paginationType === 'pagination' ? this.getCurrentPageTransactions() : this.filteredTransactions;
    }

    public get hasDetailModal(): boolean {
        return this.isDisplayingDetails;
    }

    public set hasDetailModal(f: boolean) {
        this.isDisplayingDetails = f;
    }

    public get hasCosignatureModal(): boolean {
        return this.isAwaitingCosignature;
    }

    public set hasCosignatureModal(f: boolean) {
        this.isAwaitingCosignature = f;
    }

    public get aggregateTransactionHash() {
        if (!this.activePartialTransaction.transactionInfo) {
            return Transaction.createTransactionHash(
                this.activePartialTransaction.serialize(),
                Array.from(Convert.hexToUint8(this.generationHash)),
            );
        }
        return this.activePartialTransaction.transactionInfo.hash;
    }

    /// end-region computed properties getter/setter

    created() {
        if (this.$route.params.transaction) {
            // @ts-ignore
            this.activePartialTransaction = this.$route.params.transaction as AggregateTransaction;
            this.hasCosignatureModal = true;
        }
    }

    /**
     * Refresh transaction list
     * @return {void}
     */
    /* public async getTransactionListByOption(filter: TransactionGroupState) {
    this.selectedOption = filter
  } */

    /**
     * Hook called when a transaction is clicked
     * @param {Transaction} transaction
     */
    public onClickTransaction(transaction: Transaction | AggregateTransaction) {
        if (transaction.hasMissingSignatures()) {
            this.activePartialTransaction = transaction as AggregateTransaction;
            this.hasCosignatureModal = true;
        } else {
            this.activeTransaction = transaction;
            this.hasDetailModal = true;
        }
    }

    public onCloseDetailModal() {
        this.hasDetailModal = false;
        this.activeTransaction = undefined;
    }

    public onCloseCosignatureModal() {
        this.hasCosignatureModal = false;
        this.activePartialTransaction = undefined;
        this.$router.push({ name: 'dashboard.index' });
    }

    /**
     * Hook called at each page change
     */
    public onPageChange(page: number): void {
        if (page === this.countPages) {
            this.loadMore();
        } else if (page > this.countPages) {
            page = this.countPages;
        } else if (page < 1) {
            page = 1;
        }
        this.currentPage = page;
    }

    /**
     * Loads next page of transactions from repository
     */
    public loadMore() {
        if (!this.currentConfirmedPage.isLastPage) {
            this.$store.dispatch('transaction/LOAD_TRANSACTIONS', {
                pageNumber: ++this.currentConfirmedPage.pageNumber,
                pageSize: this.requestPageSize,
            });
        }
    }

    /**
     * Whether currently viewed page is the last page retrieved from repository
     */
    public get isLastPage(): boolean {
        return this.currentConfirmedPage.isLastPage && this.currentPage * this.pageSize >= this.totalCountItems;
    }

    /**
     * Watching if refreshed triggered
     * @param newVal
     */
    @Watch('currentConfirmedPage')
    public watchRefresh(newVal: PageInfo) {
        // if page refresh is triggered then reset page info
        if (newVal.pageNumber === 1) {
            this.currentPage = 1;
        }
    }

    public get hasTransactionExportModal(): boolean {
        return this.isViewingExportModal;
    }

    public set hasTransactionExportModal(f: boolean) {
        this.isViewingExportModal = f;
    }

    public downloadTransactions() {
        this.hasTransactionExportModal = true;
    }
}
