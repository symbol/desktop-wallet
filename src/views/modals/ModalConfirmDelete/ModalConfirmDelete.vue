<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" :title="$t('modal_title_enter_account_name')" :transfer="false">
            {{ $t('delete_confirmation_message') }}
            <div slot="footer" class="modal-footer">
                <button type="submit" class="centered-button button-style back-button float-right" @click="confirm">
                    {{ $t('confirm') }}
                </button>
                <button type="submit" class="centered-button button-style back-button float-right" @click="show = false">
                    {{ $t('close') }}
                </button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalConfirmDeleteTs } from './ModalConfirmDeleteTs';
export default class ModalConfirmDelete extends ModalConfirmDeleteTs {}
</script>

<style lang="less" scoped>
.float-right {
    float: right;
}
</style>
