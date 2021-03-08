<template>
    <div class="table-container">
        <div class="upper-section-container">
            <div class="table-title-container section-title">
                <div class="user-operation">
                    <span class="add-metadata-button">
                        <ButtonAdd :title="$t('add_metadata')" :disabled="false" size="26" @click="$emit('on-add-metadata')" />
                    </span>
                    <Checkbox v-if="assetType !== 'metadata'" v-model="showExpired" class="table-filter-item-container">
                        <span v-show="assetType === 'mosaic'" style="margin-left: 0.1rem;">{{ $t('show_expired_mosaics') }}</span>
                        <span v-show="assetType === 'namespace'" style="margin-left: 0.1rem;">{{ $t('show_expired_namespaces') }}</span>
                    </Checkbox>
                    <div v-if="signers.length > 1" style="min-width: 2rem;">
                        <SignerFilter :signers="signers" @signer-change="onSignerSelectorChange" />
                    </div>
                    <ButtonRefresh v-if="assetType !== 'metadata'" @click="onRefresh" />
                </div>
            </div>
        </div>
        <div
            :class="[
                'table-header-container',
                assetType !== 'metadata' ? (assetType === 'mosaic' ? 'mosaic-columns' : 'namespace-columns') : 'metadata-columns',
            ]"
        >
            <div
                v-for="({ name, label }, index) in tableFields"
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
            <Spin v-if="isLoading || isFetchingMore" size="large" fix class="absolute" />
            <div
                v-show="displayedValues.length"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="infiniteScrollDisabled"
                infinite-scroll-distance="5"
                class="table-rows-outer-container"
            >
                <div class="table-rows-container">
                    <TableRow
                        v-for="(rowValues, index) in currentPageRows"
                        :key="index"
                        :row-values="rowValues"
                        :asset-type="assetType"
                        :owned-asset-hex-ids="ownedAssetHexIds"
                        @on-show-alias-form="showAliasForm"
                        @on-show-extend-namespace-duration-form="showExtendNamespaceDurationForm"
                        @on-show-mosaic-supply-change-form="showModifyMosaicSupplyForm"
                        @on-show-metadata="showMetadataValue"
                        @on-show-edit="showModalUpdateMetadata"
                    />
                </div>
            </div>
            <div v-if="!isLoading && (!displayedValues || displayedValues.length === 0)" class="no-data-outer-container">
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

        <div v-if="paginationType === 'pagination'" class="table-footer-container">
            <Page class="page" :total="displayedValues.length" :page-size="pageSize" @on-change="handlePageChange" />
        </div>
        <ModalFormWrap
            v-if="modalFormsVisibility.aliasTransaction"
            :hide-footer="true"
            :visible="modalFormsVisibility.aliasTransaction"
            :title="aliasModalTitle"
            @close="closeModal('aliasTransaction')"
        >
            <template v-slot:form>
                <FormAliasTransaction
                    :namespace-id="modalFormsProps.namespaceId"
                    :alias-target="modalFormsProps.aliasTarget"
                    :alias-action="modalFormsProps.aliasAction"
                    :asset-type="assetType"
                    class="padding-bottom"
                    @on-confirmation-success="closeModal('aliasTransaction')"
                />
            </template>
        </ModalFormWrap>

        <ModalFormWrap
            v-if="modalFormsVisibility.extendNamespaceDurationTransaction"
            :hide-footer="true"
            :visible="modalFormsVisibility.extendNamespaceDurationTransaction"
            title="modal_title_extend_namespace_duration"
            @close="closeModal('extendNamespaceDurationTransaction')"
        >
            <template v-slot:form>
                <FormExtendNamespaceDurationTransaction
                    :namespace-id="modalFormsProps.namespaceId"
                    class="padding-bottom"
                    @on-confirmation-success="closeModal('extendNamespaceDurationTransaction')"
                />
            </template>
        </ModalFormWrap>

        <ModalFormWrap
            v-if="modalFormsVisibility.mosaicSupplyChangeTransaction"
            :hide-footer="true"
            :visible="modalFormsVisibility.mosaicSupplyChangeTransaction"
            title="modal_title_mosaic_supply_change"
            @close="closeModal('mosaicSupplyChangeTransaction')"
        >
            <template v-slot:form>
                <FormMosaicSupplyChangeTransaction
                    :mosaic-hex-id="modalFormsProps.mosaicId.toHex()"
                    class="padding-bottom"
                    @on-confirmation-success="closeModal('mosaicSupplyChangeTransaction')"
                />
            </template>
        </ModalFormWrap>

        <ModalMetadataDisplay
            v-if="modalFormsVisibility.targetedMetadataValue"
            :visible="modalFormsVisibility.targetedMetadataValue"
            :metadata-list="targetedMetadataList"
            @close="closeModal('targetedMetadataValue')"
        />
        <ModalMetadataUpdate
            v-if="modalFormsVisibility.targetValue"
            :visible="modalFormsVisibility.targetValue"
            :value="targetedMetadataList[0]"
            :metadata-list="targetedMetadataList"
            :edit-mode="modalFormsVisibility.targetValue"
            :type="$route.path.indexOf('space') == -1 ? 1 : 2"
            @close="closeModal('targetValue')"
        />
    </div>
</template>

<script lang="ts">
import { TableDisplayTs } from './TableDisplayTs';
export default class TableDisplay extends TableDisplayTs {}
</script>
<style lang="less" scoped>
@import './TableDisplay.less';
</style>
