<template>
    <div
        :class="[
            'table-row-container',
            assetType !== 'metadata' ? (assetType === 'mosaic' ? 'mosaic-columns' : 'namespace-columns') : 'metadata-columns',
        ]"
    >
        <div v-for="(value, name, index) in visibleRowValues" :key="index" :class="['table-cell', `${name}-cell`]">
            <div v-if="name === 'balance'">
                <AmountDisplay :value="value" />
            </div>
            <div v-else-if="name !== 'metadataList'">
                {{ value }}
            </div>
        </div>
        <div class="edit-icon-cell">
            <div v-if="showRemove" @click="$emit('on-remove', rowValues)">
                <Icon type="md-trash" class="edit-icon" />
            </div>
            <Poptip v-if="hasAvailableActions" placement="left-start">
                <Icon type="md-create" class="edit-icon" />
                <div slot="content" class="asset-action-section">
                    <p class="poptip-actions" @click="$emit('on-show-alias-form', visibleRowValues)">
                        <Icon type="ios-link" class="edit-icon" />
                        <span>
                            {{ $t(aliasActionLabel) }}
                        </span>
                    </p>
                    <p v-if="isRootNamespace" @click="$emit('on-show-extend-namespace-duration-form', visibleRowValues)">
                        <Icon type="md-create" class="edit-icon" />
                        <span>
                            {{ $t('action_label_extend_duration') }}
                        </span>
                    </p>
                    <p v-if="isSupplyMutableMosaic" @click="$emit('on-show-mosaic-supply-change-form', visibleRowValues)">
                        <Icon type="md-create" class="edit-icon" />
                        <span>
                            {{ $t('action_label_modify_supply') }}
                        </span>
                    </p>
                    <p v-if="hasMetadata" @click="$emit('on-show-metadata', visibleRowValues.metadataList)">
                        <Icon type="md-eye" class="edit-icon" />
                        <span>
                            {{ $t('view_metadata') }}
                        </span>
                    </p>
                    <p v-if="hasMetadata" @click="$emit('on-show-edit', visibleRowValues.metadataList)">
                        <Icon type="ios-link" class="edit-icon" />
                        <span>
                            {{ $t('edit_metadata') }}
                        </span>
                    </p>
                </div>
            </Poptip>
        </div>
    </div>
</template>

<script lang="ts">
import { TableRowTs } from './TableRowTs';

export default class TableRow extends TableRowTs {}
</script>

<style scoped lang="less">
/* @TODO TableDisplay.less shouldn't be imported here*/
@import '../TableDisplay/TableDisplay.less';
@import './TableRow.less';
</style>
