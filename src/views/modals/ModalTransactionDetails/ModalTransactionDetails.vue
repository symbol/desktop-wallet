<template>
  <div class="transaction_modal">
    <Modal
      v-model="show"
      :transfer="false"
      @close="show = false"
      :footer-hide="true"
    >
    <div class="modal-header" slot="header">
      <img src="@/views/resources/img/modal/modal-confirm-header.png" />
      <span>{{$t('modal_title_transaction_details')}}</span>
    </div>
      <TransactionDetails :transaction="transaction" />
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalTransactionDetailsTs} from './ModalTransactionDetailsTs'
import './ModalTransactionDetails.less'

export default class ModalTransactionDetails extends ModalTransactionDetailsTs {}
</script>
