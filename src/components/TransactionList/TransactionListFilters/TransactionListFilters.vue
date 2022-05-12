<template>
    <div class="transaction-list-filters-container">
        <div class="transaction-list-filter-container">
            <TransactionStatusFilter />
        </div>
        <div v-if="currentAccountSigner.parentSigners" class="transaction-list-filter-container">
            <SignerListFilter :root-signer="currentAccountSigner" @signer-change="onSignerSelectorChange" />
        </div>
        <div class="button-container">
            <ButtonRefresh class="button-refresh" @click="refresh" />
        </div>
        <div class="button-container">
            <Tooltip :content="$t('export_transactions')" placement="top" :transfer="true">
                <a class="button-download" @click="downloadTransactions">
                    <font-awesome-icon icon="file-csv" />
                </a>
            </Tooltip>
        </div>
        <div class="button-container">
            <Tooltip :content="$t('blacklisted_transactions')" placement="top" :transfer="true">
                <img
                    class="button-blacklist"
                    :src="
                        isBlackListFilterActivated
                            ? require('@/views/resources/img/icons/malicious-actor.svg')
                            : require('@/views/resources/img/icons/malicious_actor_1.svg')
                    "
                    alt
                    @click="onSelectBlackListed"
                />
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
