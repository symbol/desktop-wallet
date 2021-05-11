<template>
    <div class="transaction_modal">
        <Modal v-model="show" :title="$t('modal_title_transaction_details')" :transfer="false" :footer-hide="true" @close="show = false">
            <TransactionOptinPayoutDetails v-if="isOptinTransaction" :current-account="currentAccount" :transaction="transaction" />
            <TransactionDetails v-else :transaction="transaction" />
            <div slot="footer" class="modal-footer"></div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalTransactionDetailsTs } from './ModalTransactionDetailsTs';
export default class ModalTransactionDetails extends ModalTransactionDetailsTs {}
</script>
<style lang="less" scoped>
@import './ModalTransactionDetails.less';
</style>
