<template>
  <div>
    <ContactQRAction v-if="qrCode.type == 1" :qr-code="qrCode" :on-success="onSuccess" />
    <TransactionQRAction v-else-if="qrCode.type == 3" :qr-code="qrCode" :on-success="onSuccess" />
    <MnemonicQRAction v-else-if="qrCode.type == 6" :qr-code="qrCode" :on-success="onSuccess" />
    <!-- TODO: implement
      <CosignatureQRAction v-if="qrCode.type == 5" :qr-code="qrCode" />
     -->
  </div>
</template>

<script lang="ts">
import QRCodeActionsTs from './QRCodeActionsTs'

export default class QRCodeActions extends QRCodeActionsTs {}
</script>

<style lang="less" scoped>
@import './QRCodeActions.less';
</style>
