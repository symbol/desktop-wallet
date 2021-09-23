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
            <div v-if="!isOffline">
                <input v-model="totalAvailableAmount" class="input-style total-amount-input-size" :disabled="true" />
                <p v-if="isAmountGreaterThanBalance" style="color: red;">{{ $t('not_enough_balance') }}</p>
            </div>
        </ErrorTooltip>
    </ValidationProvider>
</template>

<script lang="ts">
import { AmountInputTs } from './AmountInputTs';
export default class AmountInput extends AmountInputTs {}
</script>
<style lang="less" scoped>
.amount-input-size {
    width: 60%;
    height: 100%;
}
.total-amount-input-size {
    width: 40%;
    height: 100%;
    color: #515a6e;
    padding-left: 0.3rem;
}
</style>
