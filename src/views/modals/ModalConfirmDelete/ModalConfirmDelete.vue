<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" :title="$t('modal_title_delete')" :transfer="false">
            {{ $t('delete_confirmation_message') }}
            <button type="submit" class="position centered-button button-style inverted-button pl-2 pr-2" @click="confirm">
                {{ $t('confirm') }}
            </button>
            <div slot="footer" class="modal-footer"></div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalConfirmDeleteTs } from './ModalConfirmDeleteTs';
export default class ModalConfirmDelete extends ModalConfirmDeleteTs {}
</script>

<style lang="less" scoped>
@import '../../../views/resources/css/variables.less';

.float-right {
    float: right;
}

/deep/ .ivu-modal-body {
    font-size: @bigFont !important;
    margin-left: 3.5rem;
    color: @primary;
    margin-right: 1.5rem;
}

.position {
    margin-left: 0.5rem;
}
</style>
