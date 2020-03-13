<template>
  <div class="create-mnemonic-sec" @keyup.enter="submit">
    <p class="set-title">
      {{ $t('Input_mnemonic') }}
    </p>
    <div class="create-mnemonic-col">
      <div class="create-mnemonic-left">
       <!--  <MnemonicInput ref="mnemonicInput"></MnemonicInput> -->
        <MnemonicInput @handle-words='setSeed'></MnemonicInput>
      <!--   <textarea v-model="formItems.seed" class="show-mnemonic" /> -->
        <div class="button-container">
          <div class="flex-container mt-3">
            <button type="button" class="button-style back-button" @click="deleteAccountAndBack">
              {{ $t('Return_password_setting') }}
            </button>
            <button type="submit" class="button-style validation-button"  @click="processVerification" :disabled="isAllow">
              {{ $t('Import_mnemonic') }}
            </button>
          </div>
        </div>
      </div>
      <div class="create-mnemonic-right">
        <p class="text">
          {{ $t('Input_mnemonic_tips') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ImportMnemonicTs from './ImportMnemonicTs'
export default class ImportMnemonic extends ImportMnemonicTs {}
</script>
<style lang="less" scoped>
@import "./importMnemonic.less";
</style>
