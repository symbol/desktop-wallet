<template>
    <div class="account-detail-row-3cols">
        <span class="label">{{ $t('metadata') }}:</span>
        <Select v-model="chosenValue" class="select-size select-style">
            <Option v-for="metadataModel in accountMetadataList" :key="metadataModel.metadataId" :value="metadataModel.metadataId">
                {{ `${metadataModel.scopedMetadataKey} : ${metadataModel.value}` }}
            </Option>
        </Select>
        <span class="metadata-detail-button" @click="showMetadataDetail">{{ $t('view_metadata') }}</span>
    </div>
</template>

<script lang="ts">
import { AccountMetadataDisplayTs } from './AccountMetadataDisplayTs';
export default class AccountMetadataDisplay extends AccountMetadataDisplayTs {}
</script>

<style lang="less" scoped>
@import './AccountMetadataDisplay.less';
</style>
