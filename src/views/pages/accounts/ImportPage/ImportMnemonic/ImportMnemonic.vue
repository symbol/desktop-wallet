<template>
  <div class="import-mnemonic-page-wrapper">
    <span @click="jump">跳过</span>
    <div class="import-mnemonic-page-container">
      <div class="import-mnemonic-container">
        <ImportMnemonic @finish-data="updateMnemonic" />
      </div>
      <div class="page-tip-container">
        <PageTipDisplay 
          :tip-content="tipContents"
        />
      </div>
    </div>
    <div class="button-container">
      <ButtonStep @click="$router.go(-1)">
        {{ $t('Previous_step') }}
      </ButtonStep>
      <ButtonStep :primary="true" @click="submit">
        {{ $t('Next_step') }}
      </ButtonStep>
    </div>
  </div>
</template>

<script lang="ts">
import ImportMnemonicTs from './ImportMnemonicTs'
import './ImportMnemonic.less'
export default class ImportMnemonic extends ImportMnemonicTs {}
</script>

