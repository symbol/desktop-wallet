<template>
    <div class="table-container">
        <div class="upper-section-container">
            <div class="table-title-container section-title">
                <div class="user-operation">
                    <div v-if="signers.length > 1" style="min-width: 2rem;">
                        <SignerFilter :signers="signers" @signer-change="onSignerSelectorChange" />
                    </div>
                    <span class="table-filter-item-container" @click="doRefresh">
                        <Icon :class="{ 'animation-rotate': isRefreshing }" type="ios-sync" />
                    </span>
                </div>
            </div>
        </div>
        <div class="body-section-container">
            <div class="table-header-container columns">
                <div
                    v-for="({ name, label, type }, index) in tableFields"
                    :key="index"
                    :class="['table-header-item', `${name}-header`]"
                    @click="setSortedBy(name)"
                >
                    <span>{{ $t(label) }}</span>
                    <Icon
                        v-if="sortedBy.fieldName === name"
                        class="sort-icon"
                        :type="sortedBy.direction === 'asc' ? 'md-arrow-dropup' : 'md-arrow-dropdown'"
                    />
                </div>
                <!-- Enmpty header for the action button column -->
                <div>&nbsp;</div>
            </div>
            <div class="table-body-container">
                <Spin v-if="isLoading" size="large" fix class="absolute" />
                <div v-if="displayedValues.length" class="table-rows-container">
                    <TableRow
                        v-for="(rowValues, index) in currentPageRows"
                        :key="index"
                        :row-values="rowValues"
                        :asset-type="'accountRestrictions'"
                        :owned-asset-hex-ids="[]"
                        :show-remove="true"
                        @on-remove="handleRemoveRestriction"
                    />
                </div>
                <div v-else-if="!isLoading && (!displayedValues || displayedValues.length === 0)" class="no-data-outer-container">
                    <!--<div class="no-data-message-container">
                    <div>
                        {{ assetType === 'mosaic' ? $t('no_data_mosaics') : $t('no_data_namespaces') }}
                    </div>
                </div>-->
                    <div class="no-data-inner-container">
                        <div v-for="item in nodata" :key="item">
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-footer-container">
                <Page class="page" :total="displayedValues.length" :page-size="pageSize" @on-change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { AccountRestrictionsListTs } from './AccountRestrictionsListTs';
export default class AccountRestrictionsList extends AccountRestrictionsListTs {}
</script>
<style lang="less" scoped>
@import './AccountRestrictionsList.less';
</style>
