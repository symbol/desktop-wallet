<template>
    <div class="modal-metadata-update">
        <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="$emit('close-modal')"
        >
            Here is Metadata List:
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
