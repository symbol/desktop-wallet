<template>
    <div class="modal-metadata">
        <Modal v-model="show" class-name="vertical-center-modal" :footer-hide="true" :transfer="false" @on-cancel="$emit('close-modal')">
            <div class="modal-title">{{ $t('metadata_value') }}</div>
            <FormRow>
                <template v-slot:label> {{ $t('metadata') }}: </template>
                <template v-slot:inputs>
                    <Select
                        v-model="metadataKey"
                        :placeholder="$t('form_label_scoped_metadata_key_hint')"
                        :disabled="true"
                        class="select-size select-style"
                    >
                        <Option :value="metadataKey">
                            {{ metadataKey }}
                        </Option>
                    </Select>
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label />
                <template v-slot:inputs>
                    <div class="value-container">
                        <textarea
                            v-model="metadata.value"
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
