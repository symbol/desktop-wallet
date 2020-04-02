<template>
  <div class="transaction-list-options-container">
    <div v-if="signers && signers.length > 1" class="signers-container">
      <div v-if="!showSignerSelector" class="show-signer-selector">
        <span @click="showSignerSelector = true">
          {{ $t('see_transactions_other_account') }}
        </span>
      </div>
      <SignerSelector
        v-else
        v-model="selectedSigner"
        :signers="signers"
        :no-label="true"
        @input="onSignerSelectorChange"
      />
    </div>
    <div v-else>
      &nbsp;
    </div>
    <Icon
      type="md-refresh" class="refresh-button" size="30"
      @click="refresh"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListOptionsTs } from './TransactionListOptionsTs'
import './TransactionListOptions.less'

export default class TransactionListOptions extends TransactionListOptionsTs {}
</script>

<style lang="less" scoped>
@import "./TransactionListOptions.less";
</style>
