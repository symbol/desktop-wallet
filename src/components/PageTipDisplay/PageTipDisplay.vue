<template>
  <div class="page-tip-wrapper">
    <div class="tip-title">
      {{ $t(tipTitle) }}
    </div>
    <div v-for="(item, index) in tipContent" :key="index" class="tip-content-paragraph">
      {{ $t(item) }}
    </div>
  </div>
</template>

<script lang="ts">
import { PageTipDisplayTs } from './PageTipDisplayTs'
import './PageTipDisplay.less'
export default class PageTipDisplay extends PageTipDisplayTs{}
</script>
