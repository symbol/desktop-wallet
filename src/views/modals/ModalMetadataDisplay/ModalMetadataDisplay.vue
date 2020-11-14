<template>
    <div class="modal-metadata">
        <Modal v-model="show" class-name="vertical-center-modal" :footer-hide="true" :transfer="false" @on-cancel="$emit('close-modal')">
            <div class="modal-title">{{ $t('metadata_value') }}</div>
            <FormRow>
                <template v-slot:label> {{ $t('metadata') }}: </template>
                <template v-slot:inputs>
                    <Select v-model="metadataKey" class="select-size select-style">
                        <Option
                            v-for="metadataModel in metadataList"
                            :key="metadataModel.scopedMetadataKey"
                            :value="metadataModel.scopedMetadataKey"
                        >
                            {{ metadataModel.scopedMetadataKey }}
                        </Option>
                    </Select>
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label />
                <template v-slot:inputs>
                    <div class="value-container">
                        <textarea
                            :value="selectedMetadata ? selectedMetadata.value : ''"
                            class="metadata-value-input"
                            :disabled="true"
                            :placeholder="$t('form_label_value_hint')"
                        />
                    </div>
                </template>
            </FormRow>
        </Modal>
    </div>
</template>
<script lang="ts">
import { ModalMetadataDisplayTs } from './ModalMetadataDisplayTs';
export default class ModalMetadataDisplay extends ModalMetadataDisplayTs {}
</script>
<style lang="less" scoped>
@import './ModalMetadataDisplay.less';
</style>
