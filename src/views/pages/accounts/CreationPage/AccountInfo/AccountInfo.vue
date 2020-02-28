<template>
  <div class="account-info-page-wrapper">
    <div class="page-tip-container">
      <PageTipDisplay 
        :tip-content="tipContents"
      />
    </div>
    <div class="account-info-container">
      <FormAccountSetting />
    </div>
  </div>
</template>

<script>
import AccountInfoTs from './AccountInfoTs'
import './AccountInfo.less'
export default class AccountInfo extends AccountInfoTs {

}
</script>
