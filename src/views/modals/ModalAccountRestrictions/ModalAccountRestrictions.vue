<template>
    <div>
        <Modal v-model="show" class="settings-modal-container" :footer-hide="true">
            <div class="nav-links-wrapper">
                <div class="header-container">
                    <span class="title-style">{{ $t('account_restrictions') }}</span>
                </div>
                <div class="nav-wrapper">
                    <NavigationLinks
                        class="settings-tabs-container"
                        :items="availableTabs"
                        :translation-prefix="'account_restrictions_tab_'"
                        :current-item-index="currentTabIndex"
                        @selected="onTabChange"
                    />
                </div>
            </div>
            <div class="main-container">
                <div v-if="knownTabs[currentTabIndex] === 'ADDRESS' && !!currentAccount" class="restriction-wrapper">
                    <h1 class="title">Address restrictions</h1>
                    <AccountRestrictionsList v-if="!showAddNewForm" class="table-section" />
                    <FormAccountRestrictionTransaction v-if="showAddNewForm" />
                    <div class="tab-footer">
                        <button v-if="!showAddNewForm" class="button-style inverted-button pl-2 pr-2" @click="showAddNewForm = true">
                            {{ $t('add_address_restrictions') }}
                        </button>
                        <button
                            v-if="showAddNewForm"
                            class="centered-button button-style button danger-button pl-2 pr-2"
                            @click="showAddNewForm = false"
                        >
                            {{ $t('cancel') }}
                        </button>
                    </div>
                </div>
                <div v-if="knownTabs[currentTabIndex] === 'MOSAIC' && !!currentAccount" class="restriction-wrapper">
                    <h1 class="title">Mosaic restrictions</h1>
                    <AccountRestrictionsList v-if="!showAddNewForm" class="table-section" />
                    <FormAccountRestrictionTransaction v-if="showAddNewForm" />
                    <div class="tab-footer">
                        <button v-if="!showAddNewForm" class="button-style inverted-button pl-2 pr-2" @click="showAddNewForm = true">
                            {{ $t('add_mosaic_restrictions') }}
                        </button>
                        <button
                            v-if="showAddNewForm"
                            class="centered-button button-style button danger-button pl-2 pr-2"
                            @click="showAddNewForm = false"
                        >
                            {{ $t('cancel') }}
                        </button>
                    </div>
                </div>
                <div v-if="knownTabs[currentTabIndex] === 'OPERATION' && !!currentAccount" class="restriction-wrapper">
                    <h1 class="title">Operation restrictions</h1>
                    <AccountRestrictionsList v-if="!showAddNewForm" class="table-section" />
                    <FormAccountRestrictionTransaction v-if="showAddNewForm" />
                    <div class="tab-footer">
                        <button
                            v-if="!showAddNewForm"
                            class="button-style inverted-button pl-2 pr-2 pl-2 pr-2"
                            @click="showAddNewForm = true"
                        >
                            {{ $t('add_operation_restrictions') }}
                        </button>
                        <button
                            v-if="showAddNewForm"
                            class="centered-button button-style button danger-button"
                            @click="showAddNewForm = false"
                        >
                            {{ $t('cancel') }}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script lang="ts">
import { ModalAccountRestrictionsTs } from './ModalAccountRestrictionsTs';
export default class ModalAccountRestrictions extends ModalAccountRestrictionsTs {}
</script>
<style lang="less" scoped>
@import './ModalAccountRestrictions.less';
</style>
