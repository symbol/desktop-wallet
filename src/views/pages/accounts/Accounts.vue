<template>
    <div class="accounts-main-container">
        <div class="left-container">
            <div class="left-top-container">
                <AccountSelectorPanel />
            </div>
            <div class="left-bottom-container">
                <!--TODO: Display hidden accounts following AccountSelectorPanel style.-->
                <div class="hidden-account-header">
                    <h1 class="section-title">
                        {{ $t('hidden_accounts') }}
                    </h1>
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="header-container">
                <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
            </div>

            <div class="bottom-container">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { AccountsTs } from './AccountsTs';
export default class Accounts extends AccountsTs {}
</script>

<style lang="less" scoped>
@import './Accounts.less';

.hidden-account-header {
    padding: 0.17rem 0 0.4rem 0.2rem;
    .section-title {
        font-weight: 600;
        color: @purpleDark;
        font-family: @symbolFont;
    }
}
</style>
