<template>
    <div class="accounts-main-container">
        <div class="left-container">
            <div :class="[activePanel === 0 ? 'left-top-container' : 'left-top-full-container']">
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
        </div>
        <div v-if="activePanel === 0" class="right-container">
            <div class="header-container">
                <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />

                <Poptip placement="bottom-end" class="endpoint-poptip">
                    <div class="button-container">
                        <div class="header-end">
                            <ButtonAdd :disabled="false" />
                        </div>
                    </div>
                    <div slot="content" class="node-selector-container">
                        <div class="node-list-container">
                            <div class="node-list-content">
                                <ul v-auto-scroll="'active'">
                                    <li class="list-item pointer" @click="showMetadataModal = true">{{ $t('add_metadata') }}</li>
                                    <li class="list-item pointer" @click="showConfirmOpenRestrictionsModal = true">
                                        {{ $t('add_account_restrictions') }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Poptip>
            </div>

            <div class="bottom-container">
                <router-view />
            </div>
        </div>
        <div v-if="activePanel === 1" class="right-container">
            <div class="header-container">
                <div class="tabs horizontal">
                    <span class="tab-item active">{{ $t('contact_information') }}</span>
                </div>
            </div>
            <div class="bottom-container">
                <ContactDetailPanel />
            </div>
        </div>
        <ModalMetadataUpdate v-if="showMetadataModal" :visible="showMetadataModal" @close="showMetadataModal = false" />
        <ModalConfirm
            v-model="showConfirmOpenRestrictionsModal"
            :title="$t('open_restrictions_warning_title')"
            :message="$t('open_restrictions_warning_text')"
            @confirmed="showAccountRestrictionsModal = true"
        />
        <ModalAccountRestrictions
            v-if="showAccountRestrictionsModal"
            :visible="showAccountRestrictionsModal"
            @close="showAccountRestrictionsModal = false"
        />
    </div>
</template>

<script lang="ts">
import { AccountsTs } from './AccountsTs';
export default class Accounts extends AccountsTs {}
</script>

<style lang="less" scoped>
@import './Accounts.less';

.hidden-account-header {
    padding: 0 0.4rem;
    margin: 0.2rem 0;
    .section-title {
        font-weight: 600;
        color: @purpleDark;
        font-family: @symbolFont;
    }
}

.account-switch-container {
    display: grid;
    height: 100%;
    grid-template-rows: 0.6rem auto;

    ::-webkit-scrollbar-track {
        background-color: transparent;
    }
}
</style>
