<template>
    <div class="transactions-filter">
        <div class="filter-button" @click.stop="toggleSelection">
            <span>Filter</span>
            <div class="filter-button-arrow" :class="{ 'arrow-up': isSelectionShown }" />
        </div>
        <div v-show="isSelectionShown" v-click-outside="closeSelection" class="filter-options-container">
            <div class="filter-options-container__option">
                <Checkbox id="Confirmed" @input="(value) => onChange(transactionFilterOptions.confirmed, value)" />
                <label for="Confirmed">Confirmed</label>
            </div>
            <div class="filter-options-container__option">
                <Checkbox id="Unconfirmed" @input="(value) => onChange(transactionFilterOptions.unconfirmed, value)" />
                <label for="Unconfirmed">Unconfirmed</label>
            </div>
            <div class="filter-options-container__option">
                <Checkbox id="Partial" @input="(value) => onChange(transactionFilterOptions.partial, value)" />
                <label for="Partial">Partial</label>
            </div>
            <div class="filter-options-container__divider"></div>
            <div class="filter-options-container__option">
                <Checkbox id="Sent" @input="(value) => onChange(transactionFilterOptions.sent, value)" />
                <label for="Sent">Sent</label>
            </div>
            <div class="filter-options-container__option">
                <Checkbox id="Received" @input="(value) => onChange(transactionFilterOptions.received, value)" />
                <label for="Received">Received</label>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
// @ts-ignore
import { TransactionStatusFilterTs } from './TransactionStatusFilterTs';
export default class TransactionStatusFilter extends TransactionStatusFilterTs {}
</script>
<style lang="less" scoped>
@import './TransactionStatusFilter.less';
</style>
