<template>
    <div>
        Aggregate transaction
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { AggregateTransactionTs } from './AggregateTransactionTs';

export default class InputLock extends AggregateTransactionTs {}
</script>

<style lang="less" scoped>
@import './AggregateTransaction.less';
</style>
