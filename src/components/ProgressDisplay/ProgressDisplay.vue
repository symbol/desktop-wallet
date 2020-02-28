<template>
  <div class="progress-wrapper">
    <Progress :stroke-width="20" stroke-color="rgba(82,0,198,1)" :percent="value" />
    <div class="tip-box">
      {{ $t('Move_your_mouse') }}
    </div>
  </div>
</template>

<script lang="ts">
import {ProgressDisplayTs} from './ProgressDisplayTs'
import './ProgressDisplay.less'
export default class ProgressDisplay extends ProgressDisplayTs {}
</script>
<style lang="less" scoped>
</style>
