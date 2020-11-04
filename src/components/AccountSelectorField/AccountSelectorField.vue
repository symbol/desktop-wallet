<template>
    <div v-if="currentAccounts.length" class="switch_account">
        <img v-if="showIcon" class="navbar-icon" src="@/views/resources/img/navbar/account.svg" />
        <i-select
            v-model="currentAccountIdentifier"
            :class="{
                'select-size select-style': defaultFormStyle,
                'max-z-index': true,
            }"
            :transfer="true"
        >
            <i-option v-for="{ id, name } in currentAccounts" :key="id" :value="id">
                {{ truncate(name) }}
            </i-option>
        </i-select>
    </div>
</template>

<script lang="ts">
import { AccountSelectorFieldTs } from './AccountSelectorFieldTs';
export default class AccountSelectorField extends AccountSelectorFieldTs {}
</script>
<style lang="less" scoped>
@import './AccountSelectorField.less';
</style>
