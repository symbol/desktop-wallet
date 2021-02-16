<template>
    <div class="account-detail-row-3cols">
        <span class="label">{{ $t('account_address') }}:</span>
        <div class="value accountAddress">{{ prettyAddress }}</div>
        <ButtonCopyToClipboard v-model="address" type="icon-black" />
    </div>
</template>

<script lang="ts">
import { AccountAddressDisplayTs } from './AccountAddressDisplayTs';
export default class AccountAddressDisplay extends AccountAddressDisplayTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';
.accountAddress {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
}
</style>
