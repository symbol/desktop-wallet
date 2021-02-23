<template>
    <div>
        <button @click="$router.push({ name: 'profiles.login' })">Go to login</button>
        Content
        <FormOfflineTransferTransaction :recipient="recipient" :show-transaction-actions="false" />
    </div>
</template>

<script lang="ts">
import OfflineTransactionTs from './OfflineTransactionTs';
export default class OfflineTransaction extends OfflineTransactionTs {}
</script>
<style lang="less" scoped>
@import './OfflineTransaction.less';
</style>
