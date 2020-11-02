<template>
    <div class="account-switch-container">
        <div class="account-switch-header-container">
            <div class="account-switch-header-left-container">
                <h1 class="section-title">
                    {{ $t('account_management') }}
                </h1>
            </div>
        </div>
        <div v-auto-scroll="'active-background'" class="account-switch-body-container scroll">
            <div
                v-for="(item, index) in currentAccounts"
                :key="index"
                :class="['account-tile', isActiveAccount(item) ? 'active-background' : 'inactive-background', 'pointer']"
                @click="currentAccountIdentifier = item.id"
            >
                <div class="mosaic_data">
                    <span class="img_container">
                        <img v-if="isActiveAccount(item)" src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        <img v-else src="@/views/resources/img/symbol/XYMCoin.png" class="grayed-xym-logo" />
                    </span>
                    <span class="mosaic_name">{{ item.name }}</span>
                    <span class="mosaic_value">
                        <span :class="['amount', 'overflow_ellipsis', 'green']">
                            <MosaicAmountDisplay :absolute-amount="balances[item.address]" />
                            <!-- <AmountDisplay
                                :value="balances[item.address] ? balances[item.address] : 0"
                                :decimals="6"
                                :size="'normal'"
                                :show-ticker="false"
                                :ticker="false"
                            /> -->
                        </span>
                    </span>
                </div>

                <!--div class="account-tile-inner-container">
                    <div class="account-tile-upper-container">
                        <div class="account-name">
                            <span>{{ item.name }}</span>
                        </div>
                    </div>

                    <div class="account-tile-lower-container">
                        <div class="account-amount">
                            <MosaicAmountDisplay :absolute-amount="balances[item.address]" :size="'bigger'" />
                        </div>
                    </div>
                </div-->
            </div>
        </div>

        <div class="account-switch-footer-container">
            <span type="button" class="add-account pointer button" @click="hasAddAccountModal = true">
                <img src="@/views/resources/img/newicons/Add.svg" class="icon-left-button" />
                {{ $t('button_add_account') }}
            </span>

            <div v-if="!isPrivateKeyProfile" class="account-switch-header-right-container" @click="hasBackupProfileModal = true">
                <span type="button" class="back-up pointer button" @click="hasAddAccountModal = true">
                    <img src="@/views/resources/img/newicons/Download.svg" class="icon-left-button" />
                    {{ $t('backup_profile') }}
                </span>
            </div>
            <ModalFormSubAccountCreation v-if="hasAddAccountModal" :visible="hasAddAccountModal" @close="hasAddAccountModal = false" />

            <ModalBackupProfile v-if="hasBackupProfileModal" :visible="hasBackupProfileModal" @close="hasBackupProfileModal = false" />
        </div>
    </div>
</template>

<script lang="ts">
import { AccountSelectorPanelTs } from './AccountSelectorPanelTs';
import './AccountSelectorPanel.less';

export default class AccountSelectorPanel extends AccountSelectorPanelTs {}
</script>

<style lang="less" scoped>
.walletMethod {
    text-align: center;
}

.button-add-account {
    height: 0.35rem !important;
    padding: 0 0.3rem;
    margin: auto;
}
</style>
