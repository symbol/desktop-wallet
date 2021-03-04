<template>
    <div class="main-container">
        <div class="login-button">
            <button class="trigger-accountlink pointer" @click="onLoginClick">
                <img class="navbar-icon" :src="loginIcon" />
                <span class="color">{{ $t('go_to_login_offline') }}</span>
            </button>
        </div>
        <div class="left-container">
            <div class="title-container">
                <div class="wrapper">
                    <div class="title"><Icon type="ios-cloud-download-outline" /> {{ $t('offline_transactions_title') }}</div>
                    <div class="description-text">
                        <p class="mt">{{ $t('offline_transactions_text1') }}</p>
                        <p class="mt">{{ $t('offline_transactions_text2') }}</p>
                        <p class="mt">{{ $t('offline_transactions_text3') }}</p>
                        <p class="mt">{{ $t('offline_transactions_text4') }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-container">
            <NavigationTabs direction="horizontal" :custom-tab-entries="customTabEntries" />
            <div class="transaction-container">
                <router-view />
            </div>
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
