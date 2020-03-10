<template>
  <div class="signer-selector-display-wrapper">
    <div v-if="signers.length > 1" class="inputs-container select-container">
      <select
        v-model="chosenSigner"
        :placeholder="$t('publicKey')"
        class="select-size select-style"
      >
        <option
          v-for="item in signers"
          :key="item.publicKey"
          :value="item.publicKey"
        >
          {{ item.label }}
        </option>
      </select>
    </div>
    <div v-else class="signer-selector-single-signer-container">
      <span>
        {{ signers[0] ? signers[0].label : '' }}
      </span>
    </div>
  </div>
</template>


<script lang="ts">
import { SignerSelectorDisplayTs } from './SignerSelectorDisplayTs'
import './SignerSelectorDisplay.less'
export default class SignerSelectorDisplay extends SignerSelectorDisplayTs {}
</script>
