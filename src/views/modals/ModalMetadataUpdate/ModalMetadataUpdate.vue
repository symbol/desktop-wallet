<template>
    <div class="modal-metadata-update">
        <Modal v-model="show" class-name="vertical-center-modal" :footer-hide="true" :transfer="false" @on-cancel="$emit('close-modal')">
            <FormMetadataCreation :type="type" @on-create="saveMetadata" @on-confirmation-success="show = false" />
        </Modal>
    </div>
</template>
<script lang="ts">
import { ModalMetadataUpdateTs } from './ModalMetadataUpdateTs';
export default class ModalMetadataUpdate extends ModalMetadataUpdateTs {}
</script>
<style lang="less" scoped>
@import './ModalMetadataUpdate.less';
</style>
