<template>
  <div class="check-mnemonic-sec">
    <div class="skip cursor-pointer" @click="$router.push({ name: 'profiles.createProfile.finalize' })">
      {{ $t('skip') }}
    </div>
    <p class="set-title">
      {{ $t('Verify_mnemonics') }}
    </p>
    <div class="check-mnemonic-col">
      <div class="check-mnemonic-left">
        <MnemonicVerification
          :words="mnemonicWordsList"
          @success="$router.push({ name: 'profiles.createProfile.finalize' })"
          @cancelled="$router.back()"
        />
      </div>
      <div class="check-mnemonic-right">
        <p class="text1">
          {{ $t('Tips') }}
        </p>
        <p class="text">
          {{ $t('The_backup_is_wrong') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VerifyMnemonicTs from './VerifyMnemonicTs'
export default class VerifyMnemonic extends VerifyMnemonicTs {}
</script>
<style lang="less" scoped>
@import './VerifyMnemonic.less';
</style>
