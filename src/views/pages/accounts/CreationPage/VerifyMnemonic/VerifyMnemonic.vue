<template>
  <div class="verify-mnemonic-page-wrapper">
    <span style="position: absolute; left: 300px; " @click="$router.push({name: $route.meta.nextPage})">
      跳过
    </span>
    <div class="page-tip-container">
      <PageTipDisplay 
        :tip-content="tipContents"
      />
    </div>
    <div class="verify-mnemonic-container">
      <MnemonicVerification
        :words="mnemonicWords"
        @success="$router.push({name: 'accounts.creation.accountInfo'})"
        @cancelled="$router.back()"
      />
    </div>
  </div>
</template>

<script>
import VerifyMnemonicTs from './VerifyMnemonicTs'
import './VerifyMnemonic.less'
export default class VerifyMnemonic extends VerifyMnemonicTs {

}
</script>
