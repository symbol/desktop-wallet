<template>
    <div v-if="currentAccounts.length" class="switch_account">
        <Select
            v-model="currentAccountIdentifier"
            :class="{ 'select-size select-style': defaultFormStyle, 'min-width': enableMinWidth }"
            style="max-height: 2rem;"
            @input="$emit('on-change')"
        >
            <img v-if="showIcon" slot="prefix" class="navbar-icon" src="@/views/resources/img/navbar/account.svg" />
            <!-- Adding :transfer="true" breaks the style and moves the dropdown to the document root -->
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
