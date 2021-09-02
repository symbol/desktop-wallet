<template>
    <div class="select-container">
        <div class="label-and-select">
            <div v-if="showFeeLabel" class="fee-label">{{ $t('fee') }}:</div>
            <Select
                v-if="!displayOnly"
                v-model="chosenMaxFee"
                :placeholder="$t('fee')"
                class="select-size select-style"
                :placement="placement"
                :transfer="true"
                @input="$emit('on-change')"
            >
                <Option v-for="{ maxFee, label } in feesCalculated" :key="maxFee" :value="maxFee">
                    {{ label }}
                </Option>
            </Select>
            <div v-else>
                {{ fees.find((i) => i.maxFee == chosenMaxFee).label }}
            </div>
        </div>
        <span v-if="showLowFeeWarning && !displayOnly" style="color: red;" :class="{ 'offline-warning-style': isOfflineTransaction }">
            <Icon type="ios-warning-outline" />
            {{ $t('low_fee_warning_message') }}
        </span>
    </div>
</template>

<script lang="ts">
import { MaxFeeSelectorTs } from './MaxFeeSelectorTs';
export default class MaxFeeSelector extends MaxFeeSelectorTs {}
</script>

<style lang="less" scoped>
@import './MaxFeeSelector.less';
</style>
