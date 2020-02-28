<template>
  <div class="step-bar-wrapper">
    <div class="node-container">
      <div
        v-for="(item, index) in finalStepList" :key="index" class="step-group"
        :class="{'child-node': item.isChild, 'isActive': index < currentStep}"
      >
        <div class="line-box" />
        <div class="node-box">
          <div class="node-circle">
            {{ item.isChild ? '' : item.index }}
          </div>
          <div class="node-text">
            {{ $t(item.text) }}
          </div>
        </div>
      </div>
      <div v-if="finalStepList.length > 0" class="line-box" />
    </div>
  </div>
</template>

<script lang="ts">
import { StepBarTs } from './StepBarTs'
import './StepBar.less'
export default class StepBar extends StepBarTs {}
</script>
