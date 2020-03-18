<template>
  <div class="container">
    <Modal v-model="show" class-name="modal-transaction-confirmation"
      :title="$t('modal_title_transaction_confirmation')" :transfer="false" :footer-hide="true">
      <div class="modal-header" slot="header">
        <img src="@/views/resources/img/modal/modal-confirm-header.png" />
        <span>{{$t('modal_title_transaction_confirmation')}}</span>
      </div>
      <div class="transactionConfirmationBody">
        <div class="stepItem1">
          <div v-for="(transaction, index) in stagedTransactions" :key="index" class="info_container">
            <div v-if="!!stagedTransactions">
              <TransactionDetails :transaction="transaction" />
            </div>
          </div>
          <div class="confirm-form">
            <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onTransactionsSigned" @error="onError" />
            <FormAccountUnlock v-else @success="onAccountUnlocked" @error="onError" />
          </div>
        </div>
      </div>

      <div slot="footer" class="modal-footer">
        <div v-if="stagedTransactions && stagedTransactions.length > 1">
          <span
            class="clear-staged-transactions"
            @click="$store.dispatch('wallet/CLEAR_STAGED_TRANSACTIONS'); show = false"
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
  export default class ModalTransactionConfirmation extends ModalTransactionConfirmationTs { }
</script>

<style lang="less" scoped>
  @import './ModalTransactionConfirmation.less';
</style>
