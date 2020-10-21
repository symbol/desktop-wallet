<template>
    <div class="transaction-list-outer-container">
        <div class="transaction-list-inner-container">
            <div class="transaction-list-tabs-container">
                <TransactionListFilters />
                <TransactionTable
                    :transactions="getTransactions()"
                    :empty-message="getEmptyMessage()"
                    :load-more="loadMore"
                    :pagination-type="paginationType"
                    @click="onClickTransaction"
                />
            </div>
            <div class="transaction-list-pagination-container">
                <button class="button-style text-button left download-transaction" @click="downloadTransaction">
                    {{ $t('button_download_qr') }}
                </button>
                <Pagination
                    v-if="paginationType === 'pagination'"
                    page-size="pageSize"
                    :current="currentPage"
                    :last-page="isLastPage"
                    @targetPage="onPageChange"
                />
            </div>
        </div>

        <ModalTransactionDetails
            v-if="hasDetailModal"
            :visible="hasDetailModal"
            :transaction="activeTransaction"
            @close="onCloseDetailModal"
        />

        <ModalTransactionCosignature
            v-if="hasCosignatureModal"
            :visible="hasCosignatureModal"
            :transaction-hash="aggregateTransactionHash"
            @close="onCloseCosignatureModal"
        />
        <ModalTransactionExport
            v-if="hasTransactionExportModal"
            :visible="hasTransactionExportModal"
            @close="hasTransactionExportModal = false"
        />
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListTs } from './TransactionListTs';
export default class TransactionList extends TransactionListTs {}
</script>
<style lang="less" scoped>
@import './TransactionList.less';
</style>
