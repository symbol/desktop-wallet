<template>
  <div>
    <div class="debug-console-trigger" @click="hasDebugConsoleModal = true">
      <Icon :type="'ios-code-working'" size="20" class="debug-console-trigger-icon" />
      <span>&nbsp;{{ $t('top_window_console') }}</span>
    </div>
    <ModalDebugConsole
      v-if="hasDebugConsoleModal"
      :visible="hasDebugConsoleModal"
      :title="$t('modal_title_debug_console')"
      @close="hasDebugConsoleModal = false"
    />
  </div>
</template>
<script lang="ts">
import { DebugConsoleTs } from './DebugConsoleTs'
export default class DebugConsole extends DebugConsoleTs {}
</script>
<style lang="less" scoped>
@import './DebugConsole.less';
</style>
