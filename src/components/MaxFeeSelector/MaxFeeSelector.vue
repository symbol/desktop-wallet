<template>
    <div class="select-container">
        <Select
            v-if="!displayOnly"
            v-model="chosenMaxFee"
            :placeholder="$t('fee')"
            class="select-size select-style"
            @input="$emit('on-change')"
        >
            <Option v-for="{ maxFee, label } in feesCalculated" :key="maxFee" :value="maxFee">
                {{ label }}
            </Option>
        </Select>
        <div v-else>
            {{ fees.find((i) => i.maxFee == chosenMaxFee).label }}
        </div>
        <span v-if="transactionFees.minFeeMultiplier" style="color: red;">
            {{ `${$t('minimal_fee_transaction') + transactionFees.minFeeMultiplier}` }}
        </span>
    </div>
</template>

<script lang="ts">
import { MaxFeeSelectorTs } from './MaxFeeSelectorTs';
export default class MaxFeeSelector extends MaxFeeSelectorTs {}
</script>
