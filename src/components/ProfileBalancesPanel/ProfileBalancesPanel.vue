<template>
    <div class="balances-panel-outer-container">
        <div class="balances-panel-container">
            <div
                :class="{
                    top_account_address: true,
                    radius: true,
                    grayed: isCosignatoryMode,
                    purpled: !isCosignatoryMode,
                    'xym-outline': true,
                }"
            >
                <div v-if="currentSignerAddress" class="account_address">
                    <div>
                        <div class="address-label">{{ $t('address') }}:</div>
                        <div class="address">{{ currentSignerAddress.pretty() }}</div>
                    </div>
                    <div class="copy-button">
                        <ButtonCopyToClipboard :value="currentSignerAddress.plain()" type="icon-white" />
                    </div>
                </div>
                <div v-if="networkCurrency" class="XEM_amount overflow_ellipsis">
                    <div>{{ networkCurrency.ticker }} {{ $t('balance') }}:</div>
                    <div class="amount">
                        <MosaicAmountDisplay :absolute-amount="absoluteBalance" :size="'biggest'" />
                    </div>
                </div>
            </div>

            <div class="bottom_account_info">
                <Spin v-if="!balanceMosaics.length" size="large" fix class="absolute" />
                <MosaicBalanceList />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ProfileBalancesPanelTs } from './ProfileBalancesPanelTs';
export default class ProfileBalancesPanel extends ProfileBalancesPanelTs {}
</script>
<style lang="less" scoped>
@import './ProfileBalancesPanel.less';
</style>
