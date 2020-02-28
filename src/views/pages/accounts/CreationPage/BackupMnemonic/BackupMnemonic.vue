<template>
  <div class="backup-mnemonic-page-wrapper">
    <div class="backup-mnemonic-page-container">
      <div class="page-tip-container">
        <PageTipDisplay 
          :tip-content="tipContents"
        />
      </div>
      <div class="backup-mnemonic-container">
        <MnemonicDisplay :mnemonic-list="mnemonicList" />
      </div>
    </div>
    <div class="button-container">
      <ButtonStep @click="$router.go(-1)">
        {{ $t('Previous_step') }}
      </ButtonStep>
      <ButtonStep :primary="true" @click="$router.push({name: $route.meta.nextPage})">
        {{ $t('Next_step') }}
      </ButtonStep>
    </div>
  </div>
</template>

<script>
import BackupMnemonicTs from './BackupMnemonicTs'
import './BackupMnemonic.less'
export default class BackupMnemonic extends BackupMnemonicTs {

}
</script>
