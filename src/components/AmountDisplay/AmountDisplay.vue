<template>
    <span class="amount-display-container">
        <span :class="['integer-part', size]">{{ integerPart }}</span>
        <span :class="['fractional-part', size]">{{ fractionalPart }}</span>
        <span v-if="showTicker" :class="['ticker', size]"> ({{ displayedTicker }})</span>
    </span>
</template>

<script lang="ts">
import { AmountDisplayTs } from './AmountDisplayTs';

export default class AmountDisplay extends AmountDisplayTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.amount-display-container {
    .normal {
        font-size: @normalFont;
    }
    .smaller {
        font-size: @smallerFont;
    }
    .bigger {
        font-size: @biggerFont;
    }
    .biggest {
        font-size: @biggestFont;
    }

    .integer-part {
        opacity: 1;
    }
    .fractional-part {
        opacity: 0.4;
    }
}
</style>
