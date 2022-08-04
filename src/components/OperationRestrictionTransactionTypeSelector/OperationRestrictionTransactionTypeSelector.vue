<template>
    <div class="inputs-container select-container">
        <Select v-model="chosenValue" class="select-size select-style" :disabled="disabled">
            <Option v-for="[key, value] in transactionTypeList" :key="key" :value="value">
                {{ $t(`transaction_descriptor_${value}`) }}
            </Option>
        </Select>
    </div>
</template>

<script lang="ts">
import OperationRestrictionTransactionTypeSelectorTs from './OperationRestrictionTransactionTypeSelectorTs';

export default class OperationRestrictionTransactionTypeSelector extends OperationRestrictionTransactionTypeSelectorTs {}
</script>

<style lang="less" scoped>
@import './OperationRestrictionTransactionTypeSelector.less';
</style>
