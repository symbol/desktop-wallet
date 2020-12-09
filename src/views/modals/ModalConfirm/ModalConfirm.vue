<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" :title="$t(title)" :transfer="false" :ok-text="$t('confirm')" @on-ok="confirm">
            {{ $t(message) }}
        </Modal>
    </div>
</template>

<script lang="ts">
import ModalConfirmTs from './ModalConfirmTs';

export default class ModalConfirm extends ModalConfirmTs {}
</script>

<style lang="less" scoped>
@import './ModalConfirm.less';
</style>
