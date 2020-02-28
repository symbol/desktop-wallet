<template>
  <div class="step-button radius" :class="{'primary-button': primary}" @click="$emit('click')">
    <span class="content">
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import { ButtonStepTs } from './ButtonStepTs'
import './ButtonStep.less'

export default class ButtonStep extends ButtonStepTs {}
</script>
