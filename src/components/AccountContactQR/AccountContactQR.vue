<template>
    <div>
        <div class="clearfix centered">
            <img class="qr-code-image" :src="qrCode$" />
        </div>
        <div class="clearfix centered">
            <span class="qr-code-title">{{ $t('address_qr_code') }}</span>
        </div>
        <div class="clearfix centered">
            <a :href="qrCode$" :download="downloadName">{{ $t('button_download_qr') }}</a>
        </div>
    </div>
</template>

<script lang="ts">
import { AccountContactQRTs } from './AccountContactQRTs';
export default class AccountContactQR extends AccountContactQRTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';
.centered {
    text-align: center;
}

.qr-code-title {
    font-size: 16px;
    text-align: center;
    font-weight: 400;
    color: @primary;
}

.qr-code-image {
    width: 2rem;
    height: 2rem;
}
</style>
