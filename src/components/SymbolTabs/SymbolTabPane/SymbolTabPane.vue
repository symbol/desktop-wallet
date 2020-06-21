<template>
  <div class="tab-content-container" :class="[currentActiveIndex === currentIndex ? 'active-content' : '']">
    <div v-if="currentActiveIndex === currentIndex">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { SymbolTabPaneTs } from './SymbolTabPaneTs'
export default class SymbolTabPane extends SymbolTabPaneTs {}
</script>

<style lang="less" scoped>
@import './SymbolTabPane.less';
</style>
