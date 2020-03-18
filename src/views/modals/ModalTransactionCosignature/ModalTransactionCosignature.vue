<template>
  <div class="transaction_modal">
    <Modal v-model="show"  :transfer="false" @close="show = false"
      :footer-hide="true">
      <div class="modal-header" slot="header">
        <img src="@/views/resources/img/modal/modal-confirm-header.png" />
        <span>{{$t('modal_title_transaction_details')}}</span>
      </div>
      <TransactionDetails :transaction="transaction" />

      <div v-if="cosignatures && cosignatures.length">
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_has_cosignature') }}</span>
          <div v-for="(cosignature, index) in cosignatures" :key="index"
            class="row-cosignatory-modification-display-cosignature accent-pink-background inputs-container mx-1">
            <div>
              <Icon :type="'md-checkbox-outline'" size="20" />
              <span>{{$t('label_signed_by')}}</span>
              <span><b>{{cosignature.signer.publicKey}}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!needsCosignature">
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
          <p>{{ $t('transaction_needs_cosignature_explain_signed') }}</p>
        </div>
      </div>
      <div v-else>
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
          <p>{{ $t('transaction_needs_cosignature_explain') }}</p>
        </div>

        <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onTransactionsSigned" @error="onError" />
        <FormAccountUnlock v-else @success="onAccountUnlocked" @error="onError" />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
  import { ModalTransactionCosignatureTs } from './ModalTransactionCosignatureTs'
  export default class ModalTransactionCosignature extends ModalTransactionCosignatureTs { }
</script>
<style lang="less" scoped>
  @import "./ModalTransactionCosignature.less";
</style>