<template>
  <div class="window-controller">
    <div>
      <span class="cursor-pointer" @click="electronHelpers.minWindow" />
      <span
        v-if="electronHelpers.isMaximized"
        class="cursor-pointer not-window-max"
        @click="electronHelpers.maxWindow"
      />
      <span v-else class="cursor-pointer now-window-max" @click="electronHelpers.unMaximize" />
      <span class="cursor-pointer close-window" @click="electronHelpers.closeWindow" />
    </div>
  </div>
</template>

<script lang="ts">
import { WindowControlsTs } from './WindowControlsTs'
export default class WindowControls extends WindowControlsTs {}
</script>
<style lang="less" scoped>
@import './WindowControls.less';
</style>
