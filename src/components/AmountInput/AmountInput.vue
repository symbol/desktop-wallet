<template>
    <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="amount"
        :name="$t('amount')"
        :rules="validationRules.amount"
        tag="div"
        class="inputs-container"
    >
        <ErrorTooltip :errors="errors">
            <input v-model="relativeValue" class="input-style amount-input-size" type="text" />
            <input v-if="!isOffline" v-model="totalAvailableAmount" class="input-style total-amount-input-size" :disabled="true" />
            <p v-if="isAmountGreaterThanBalance && !isOffline" class="warning-label">{{ $t('not_enough_balance') }}</p>
        </ErrorTooltip>
    </ValidationProvider>
</template>

<script lang="ts">
import { AmountInputTs } from './AmountInputTs';
export default class AmountInput extends AmountInputTs {}
</script>
<style lang="less" scoped>
@import './AmountInput.less';
</style>
