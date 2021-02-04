<template>
    <div class="account-detail-row-3cols">
        <span v-if="!publicKey" class="label">{{ $t('account_public_key') }}:</span>
        <div class="value accountPublicKey">{{ publicKey || account.publicKey }}</div>
        <ButtonCopyToClipboard v-if="account" v-model="account.publicKey">
            <img src="@/views/resources/img/account/cloneIcon.svg" class="copy-icon" />
        </ButtonCopyToClipboard>
        <ButtonCopyToClipboard v-else v-model="publicKey">
            <img src="@/views/resources/img/account/cloneIcon.svg" class="copy-icon" />
        </ButtonCopyToClipboard>
    </div>
</template>

<script lang="ts">
import { AccountPublicKeyDisplayTs } from './AccountPublicKeyDisplayTs';
export default class AccountPublicKeyDisplay extends AccountPublicKeyDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
    width: 0.24rem;
    height: 0.24rem;
    margin-right: 0.18rem;
    cursor: pointer;
}

.accountPublicKey {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
}

.value {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
