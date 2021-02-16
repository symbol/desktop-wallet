<template>
    <div class="transaction-list-filters-container">
        <div class="transaction-list-filter-container">
            <TransactionStatusFilter />
        </div>
        <div v-if="signers.length > 1" class="transaction-list-filter-container">
            <SignerFilter :signers="signers" @signer-change="onSignerSelectorChange" />
        </div>
        <div class="button-refresh-container">
            <ButtonRefresh @click="refresh" />
        </div>
        <div class="button-download-container">
            <Tooltip :content="$t('export_transactions')" placement="top" :transfer="true">
                <a class="button-download" @click="downloadTransactions">
                    <font-awesome-icon icon="file-csv" />
                </a>
            </Tooltip>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListFiltersTs } from './TransactionListFiltersTs';

export default class TransactionListFilters extends TransactionListFiltersTs {}
</script>

<style lang="less" scoped>
@import './TransactionListFilters.less';
</style>
