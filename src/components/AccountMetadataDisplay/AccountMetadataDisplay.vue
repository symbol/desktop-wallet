<template>
    <div v-if="show" class="account-detail-row-3cols">
        <span class="label">{{ $t('metadata') }}:</span>
        <Select v-model="chosenValue" class="select-size select-style">
            <Option v-for="metadataModel in metadataList" :key="metadataModel.metadataId" :value="metadataModel.metadataId">
                {{ `${metadataModel.scopedMetadataKey} : ${metadataModel.value}` }}
            </Option>
        </Select>
        <div>
            <img src="@/views/resources/img/icons/View.svg" class="metadata-detail-button" @click="$emit('on-view-metadata')" />
            <img src="@/views/resources/img/icons/settings.png" class="metadata-detail-button" @click="emitMetadataValue" />
        </div>
    </div>
</template>

<script lang="ts">
import { AccountMetadataDisplayTs } from './AccountMetadataDisplayTs';
export default class AccountMetadataDisplay extends AccountMetadataDisplayTs {}
</script>

<style lang="less" scoped>
@import './AccountMetadataDisplay.less';
</style>
