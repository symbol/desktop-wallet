<template>
    <div class="modal-metadata">
        <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            @on-cancel="$emit('close-modal')"
        >
            <FormRow>
                <template v-slot:label> {{ $t('metadata') }}: </template>
                <template v-slot:inputs>
                    <div class="select-container">
                        <Select
                            v-model="metadata.scopedMetadataKey"
                            :placeholder="$t('form_label_scoped_metadata_key_hint')"
                            class="select-size select-style"
                        >
                        </Select>
                    </div>
                </template>
            </FormRow>
            <FormRow noLabel="true">
                <template v-slot:inputs>
                    <div class="value-container">
                        <textarea
                            class="metadata-value-input"
                            :placeholder="$t('form_label_value_hint')"
                            v-model="metadata.value" 
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
