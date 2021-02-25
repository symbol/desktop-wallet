<template>
    <div>
        <button @click="$router.push({ name: 'profiles.login' })">Go to login</button>
        Content
        <FormOfflineTransferTransaction :show-transaction-actions="false" @transactionSigned="onSignedOfflineTransaction" />
        <div v-if="qrCode" class="image-container">
            <QRCodeDisplay :qr-code="qrCode" alt="singed_transaction_qr_code" show-download="true" :download-name="'signedTransaction'" />
        </div>
    </div>
</template>

<script lang="ts">
import OfflineTransactionTs from './OfflineTransactionTs';
export default class OfflineTransaction extends OfflineTransactionTs {}
</script>
<style lang="less" scoped>
@import './OfflineTransaction.less';
</style>
