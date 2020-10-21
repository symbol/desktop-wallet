<template>
    <div class="transaction-table-container">
        <TransactionListHeader />
        <Spin v-if="isFetchingTransactions && !isFetchingMoreTransctions" size="large" fix class="absolute" />
        <div
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="infiniteScrollDisabled"
            infinite-scroll-distance="5"
            class="transaction-rows-outer-container"
        >
            <div class="transaction-rows-inner-container">
                <TransactionRow
                    v-for="(transaction, index) in transactions"
                    :key="index"
                    :transaction="transaction"
                    @click="$emit('click', transaction)"
                />
                <div v-if="paginationType === 'scroll' && isFetchingMoreTransctions">
                    <Spin size="large" />
                </div>
            </div>
            <div v-if="!transactions.length && !isFetchingTransactions" class="no-data-outer-container">
                <!--<div class="no-data-message-container">
                    <div>{{ $t(emptyMessage) }}</div>
                </div>-->
                <div class="no-data-inner-container">
                    <div v-for="item in nodata" :key="item">
                        &nbsp;
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionTableTs } from './TransactionTableTs';
export default class TransactionTable extends TransactionTableTs {}
</script>

<style lang="less" scoped>
@import './TransactionTable.less';
</style>
