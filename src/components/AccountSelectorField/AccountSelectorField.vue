<template>
  <div v-if="currentAccounts.length" class="account-switch account-switch-trigger">
    <Icon v-if="!defaultFormStyle" type="ios-folder-outline" />
    <i-select
      v-model="currentAccountIdentifier"
      :class="{
        'select-size select-style': defaultFormStyle,
        'max-z-index': true,
      }"
    >
      <i-option v-for="{ id, name } in currentAccounts" :key="id" :value="id">
        {{ truncate(name) }}
      </i-option>
    </i-select>
  </div>
</template>

<script lang="ts">
import { AccountSelectorFieldTs } from './AccountSelectorFieldTs'
export default class AccountSelectorField extends AccountSelectorFieldTs {}
</script>
<style lang="less" scoped>
@import './AccountSelectorField.less';
</style>
