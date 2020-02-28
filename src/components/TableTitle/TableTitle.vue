<template>
  <div class="table-title-wrapper">
    <span class="table-title">
      <slot />
    </span>
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import './TableTitle.less'

@Component
export default class TableTitle extends Vue {}
</script>