<template>
  <span class="amount-display-container">
    <span :class="['integer-part', size]">{{ integerPart }}</span>
    <span :class="['fractional-part', size]">{{ fractionalPart }}</span>
    <span v-if="showTicker" class="ticker">&nbsp;{{ displayedTicker }}</span>
  </span>
</template>

<script lang="ts">
import {AmountDisplayTs} from './AmountDisplayTs'

export default class AmountDisplay extends AmountDisplayTs {}
</script>

<style scoped lang="less">
@import "./AmountDisplay.less";
</style>
