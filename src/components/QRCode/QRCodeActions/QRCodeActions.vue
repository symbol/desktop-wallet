<template>
    <div>
        <ContactQRAction v-if="qrCode.type == 1" :qr-code="qrCode" :on-success="onSuccess" />
        <TransactionQRAction v-else-if="qrCode.type == 3" :qr-code="qrCode" :on-success="onSuccess" />
        <CosignatureQRAction
            v-if="qrCode.type == 4"
            :qr-code="qrCode"
            :on-success="onSuccess"
            :confirm-action="confirmAction"
            :confirm-text="confirmText"
        />
        <MnemonicQRAction v-else-if="qrCode.type == 5" :qr-code="qrCode" :on-success="onSuccess" />
        <SignedTransactionQRAction v-else-if="qrCode.type == 8" :qr-code="qrCode" :on-success="onSuccess" />
        <CosignatureSignedTransactionQRAction v-else-if="qrCode.type == 9" :qr-code="qrCode" :on-success="onSuccess" />
    </div>
</template>

<script lang="ts">
import QRCodeActionsTs from './QRCodeActionsTs';

export default class QRCodeActions extends QRCodeActionsTs {}
</script>

<style lang="less" scoped>
@import './QRCodeActions.less';
</style>
