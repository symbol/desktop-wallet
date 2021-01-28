<template>
    <div>
        <QRCodeDisplay :qr-code="qrCodeArgs" show-download="true" header="contact_qr_code" :download-name="downloadName" />
    </div>
</template>

<script lang="ts">
import { AddressQRTs } from './AddressQRTs';
export default class AddressQR extends AddressQRTs {}
</script>
