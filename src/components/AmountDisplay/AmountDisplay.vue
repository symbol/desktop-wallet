<template>
    <span class="amount-display-container">
        <span :class="['integer-part', size]">{{ integerPart }}</span>
        <span :class="['fractional-part', size]">{{ fractionalPart }}</span>
        <span v-if="showTicker" :class="['ticker', size]">&nbsp;({{ displayedTicker }})</span>

        <div v-if="hasCustomMosaic" class="tooltip">
            <img :src="mosaicIcon" class="warning-icon" />
            <div class="tooltiptext">
                <div v-for="mosaic in mosaicList" :key="mosaic.id">
                    {{ `${'- ' + mosaic.id + ': ' + mosaic.amount}` }}
                </div>
            </div>
        </div>
        <img v-if="hasMessage" :src="messagesIcon" class="warning-icon" />
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
    .coloring {
        color: #44004e;
        padding: 2px;
    }
    .warning-icon {
        height: 0.2rem;
    }
    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 6px 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .tooltip .tooltiptext::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
}
</style>
