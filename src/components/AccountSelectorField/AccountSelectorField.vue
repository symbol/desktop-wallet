<template>
    <div v-if="currentAccounts.length" class="switch_account">
        <img v-if="showIcon" class="navbar-icon" src="@/views/resources/img/navbar/account.svg" />
        <Select v-model="currentAccountIdentifier" class="select-size select-style" transfer="true">
            <Option v-for="{ id, name } in currentAccounts" :key="id" :value="id">
                {{ truncate(name) }}
            </Option>
        </Select>
    </div>
</template>

<script lang="ts">
import { AccountSelectorFieldTs } from './AccountSelectorFieldTs';
export default class AccountSelectorField extends AccountSelectorFieldTs {}
</script>
<style lang="less" scoped>
@import './AccountSelectorField.less';
</style>
