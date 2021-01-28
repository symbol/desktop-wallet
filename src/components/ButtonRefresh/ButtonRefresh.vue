<template>
    <span>
        <Icon type="md-refresh" class="button-refresh" @click="$emit('click')" />
    </span>
</template>
<script lang="ts">
import { ButtonRefreshTs } from './ButtonRefreshTs';
export default class ButtonRefresh extends ButtonRefreshTs {}
</script>
<style lang="less" scoped>
@import './ButtonRefresh.less';
</style>
