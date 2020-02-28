<template>
  <div class="mnemonic-display-wrapper">
    <MnemonicTag v-for="(item, index) in mnemonicList" :key="index" :tag-name="item" />
  </div>
</template>

<script lang="ts">
import { MnemonicDisplayTs } from './MnemonicDisplayTs'
import './MnemonicDisplay.less'
export default class MnemonicDisplay extends MnemonicDisplayTs {}
</script>
