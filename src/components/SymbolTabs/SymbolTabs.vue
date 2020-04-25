<template>
  <div class="symbol-tab-container" :class="[direction === 'horizontal' ? 'horizontal' : 'vertical']">
    <div class="symbol-tab-nav">
      <div
        v-for="({label},index) in tabPaneNavigators" :key="index" class="nav-item"
        :class="[index === activeNavIndex ? 'active-item' : 'inactive-item']" @click="onTabChange(index)"
      >
        <span>{{ label }}</span>
      </div>
    </div>
    <div class="symbol-tabs-content">
      <div class="tabs-content" :style="contentStyle">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { SymbolTabsTs } from './SymbolTabsTs'
export default class SymbolTabs extends SymbolTabsTs { }
</script>
<style lang="less" scoped>
  @import "./SymbolTabs.less";
</style>
