<template>
    <AutoComplete
        v-model="rawValue"
        class="input-style auto-complete"
        :placeholder="$t(placeholder)"
        :transfer="true"
        :disabled="disabled"
        transfer-class-name="account-auto-complete-suggestions"
    >
        <div :style="autoCompletePopupStyle">
            <div v-for="group in autoCompletionGroups" :key="group.title" class="auto-complete-group">
                <div class="auto-complete-group-title">{{ $t(group.title) }}</div>
                <Option v-for="item in group.items" :key="item.address" :value="item.address" class="auto-complete-option">
                    <span class="auto-complete-option-name">{{ item.name }}</span>
                    <span class="auto-complete-option-address">{{ item.address }}</span>
                </Option>
            </div>
        </div>
    </AutoComplete>
</template>

<script lang="ts">
import { AccountAutoCompleteInputTs } from './AccountAutoCompleteInputTs';
export default class AccountAutoCompleteInput extends AccountAutoCompleteInputTs {}
</script>

<style lang="less" scoped>
@import './AccountAutoCompleteInput.less';
</style>
