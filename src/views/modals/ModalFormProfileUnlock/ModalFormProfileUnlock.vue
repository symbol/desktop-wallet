<template>
    <div class="container">
        <Modal v-model="show" :title="title ? title : $t('modal_account_unlock_title')" :transfer="true" class-name="modal-container">
            <span v-if="message" class="text">{{ message }} </span>
            <FormProfileUnlock @success="onAccountUnlocked" @error="onError" />
            <div slot="footer" class="modal-footer">
                <!--<button type="submit" class="centered-button button-style back-button float-right" @click="show = false">
                    {{ $t('close') }}
                </button>-->
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalFormProfileUnlockTs } from './ModalFormProfileUnlockTs';
export default class ModalFormProfileUnlock extends ModalFormProfileUnlockTs {}
</script>
<style lang="less" scoped>
.text {
    font-size: 18px !important;
    color: #44004e;
    margin-left: 50px;
}
</style>
