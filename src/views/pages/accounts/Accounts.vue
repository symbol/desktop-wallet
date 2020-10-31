<template>
    <div class="accounts-main-container">
        <div class="left-container">
            <div class="account-switch-container">
                <NavigationLinks
                    :direction="'horizontal'"
                    :items="panelItems"
                    :current-item-index="activePanel"
                    translation-prefix="tab_accounts_"
                    @selected="(i) => (activePanel = i)"
                />
                <AccountSelectorPanel v-if="activePanel === 0" />
                <ContactSelectorPanel v-if="activePanel === 1" />
            </div>
        </div>
        <div class="right-container" v-if="activePanel === 0">
            <div class="header-container">
                <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
            </div>

            <div class="bottom-container">
                <router-view />
            </div>
        </div>
        <div class="right-container" v-if="activePanel === 1">
            <div class="header-container">
            </div>
            <div class="bottom-container">
                <ContactDetailPanel />
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
</style>
