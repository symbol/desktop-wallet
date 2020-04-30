<template>
  <div class="container">
    <Modal
      v-model="show"
      class-name="modal-transaction-confirmation"
      :title="$t('modal_title_transaction_confirmation')"
      :transfer="false"
    >
      <div>
        <div v-if="!!stagedTransactions">
          <div v-for="(transaction, index) in stagedTransactions" :key="index">
            <TransactionDetails :transaction="transaction" />
          </div>

          <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onTransactionsSigned" @error="onError" />
          <FormProfileUnlock v-else @success="onAccountUnlocked" @error="onError" />
        </div>
      </div>

      <div slot="footer" class="modal-footer">
        <div v-if="stagedTransactions && stagedTransactions.length > 1">
          <span
            class="clear-staged-transactions"
            @click="
              $store.dispatch('account/CLEAR_STAGED_TRANSACTIONS')
              show = false
            "
          >
            {{ $t('clear_staged_transactions') }}
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { ModalTransactionConfirmationTs } from './ModalTransactionConfirmationTs'
export default class ModalTransactionConfirmation extends ModalTransactionConfirmationTs {}
</script>

<style lang="less" scoped>
@import './ModalTransactionConfirmation.less';
</style>
