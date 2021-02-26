<template>
    <div class="modal-metadata-update">
        <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            :title="$t(modalTitle)"
            @on-cancel="$emit('close-modal')"
        >
            <FormMetadataCreation
                :value="value"
                :edit-mode="editMode"
                :type="type"
                :metadata-list="metadataList"
                @on-create="saveMetadata"
                @on-confirmation-success="show = false"
            />
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
