<template>
    <div class="step-2-wrapper" @mouseover="shouldTrackMouse && handleMousemove($event)">
        <img src="@/views/resources/img/login/connector-pink.png" />
        <Progress stroke-color="#ff00ff" :percent="percent" />
    </div>
</template>

<script lang="ts">
import GenerateMnemonicTs from './GenerateMnemonicTs';
export default class GenerateMnemonic extends GenerateMnemonicTs {}
</script>
<style lang="less" scoped>
@import './GenerateMnemonic.less';
</style>
