<template>
    <div>
        <QRCodeDisplay :qr-code="qrCodeArgs" show-download="true" header="address_qr_code" :download-name="downloadName" />
    </div>
</template>

<script lang="ts">
import { AccountContactQRTs } from './AccountContactQRTs';
export default class AccountContactQR extends AccountContactQRTs {}
</script>
