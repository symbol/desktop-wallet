<template>
  <div class="import-mnemonic-wrapper">
    <div class="import-mnemonic-type">
      <RadioGroup v-model="mnemonicType">
        <Radio label="1">
          <span>{{ $t('twelve_words') }}</span>
        </Radio>
        <Radio label="2">
          <span>{{ $t('twenty_four_words') }}</span>
        </Radio>
      </RadioGroup>
    </div>
    <textarea v-model="mnemonicContent" class="show-mnemonic" @change="submitData" />
    <!--<p class="bottom-text">
      {{ $t('mnemonic_hash_code') }}：
      <span>{{ hashCode }}</span>
    </p>-->
  </div>
</template>

<script>
import ImportMnemonicTs from './ImportMnemonicTs'
import './ImportMnemonic.less'
export default class ImportMnemonic extends ImportMnemonicTs {}
</script>
