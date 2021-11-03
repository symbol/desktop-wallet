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
            <Button
                v-if="!isOffline && !isAggregate"
                type="text"
                :title="$t('use_max_value')"
                class="input-style total-amount-input-size"
                :disabled="false"
                @click="useMaximumBalance()"
            >
                <Icon type="ios-information-circle-outline" />
                {{ totalAvailableAmount }}
            </Button>
            <input
                v-if="!isOffline && isAggregate"
                v-model="totalAvailableAmount"
                class="input-style total-amount-input-size"
                :disabled="true"
            />
            <p v-if="isNumber && !validAmount && !isOffline" class="warning-label">{{ $t('not_enough_balance') }}</p>
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
