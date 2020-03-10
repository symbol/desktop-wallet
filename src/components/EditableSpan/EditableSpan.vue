<template>
  <div class="editable-span-wrapper">
    <div v-show="showInput" class="input-box">
      <Input
        ref="valueInput" v-model="value"
        type="number"
        @on-blur="showInput = false"
      />
    </div>
    <div v-show="!showInput" class="display-box">
      {{ value }}
    </div>
    <div class="icon-box">
      <Icon type="md-create" @click="showInput = !showInput" />
    </div>
  </div>
</template>

<script lang="ts">
import {EditableSpanTs} from './EditableSpanTs'
import './EditableSpan.less'
export default class EditableSpan extends EditableSpanTs {}
</script>
