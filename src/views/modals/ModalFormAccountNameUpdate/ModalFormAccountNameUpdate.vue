<template>
    <div class="container">
        <Modal v-model="show" :title="$t('modal_title_enter_account_name')" :transfer="false" class-name="modal-container">
            <FormAccountNameUpdate @submit="onSubmit" />
            <div slot="footer" class="modal-footer"></div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalFormAccountNameUpdateTs } from './ModalFormAccountNameUpdateTs';
export default class ModalFormAccountNameUpdate extends ModalFormAccountNameUpdateTs {}
</script>
