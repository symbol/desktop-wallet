<template>
    <div>
        <Modal v-model="show" class="restriction-transaction-modal-container" :footer-hide="true">
            <div class="body-wrapper">
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
                        <AccountRestrictionsList
                            v-if="!addNewFormVisible"
                            class="table-section"
                            restriction-tx-type="ADDRESS"
                            @deleteRestriction="onDeleteRestriction"
                        />
                        <FormAccountRestrictionTransaction
                            v-if="addNewFormVisible"
                            restriction-tx-type="ADDRESS"
                            :restriction-to-be-deleted="restrictionToBeDeleted"
                            @on-confirmation-success="hideAddNewForm"
                        />
                        <div class="tab-footer">
                            <button v-if="!addNewFormVisible" class="button-style inverted-button pl-2 pr-2" @click="showAddNewForm">
                                {{ $t('add_address_restrictions') }}
                            </button>
                            <button
                                v-if="addNewFormVisible"
                                class="centered-button button-style button danger-button pl-2 pr-2"
                                @click="hideAddNewForm"
                            >
                                {{ $t('cancel') }}
                            </button>
                        </div>
                    </div>
                    <div v-if="knownTabs[currentTabIndex] === 'MOSAIC' && !!currentAccount" class="restriction-wrapper">
                        <h1 class="title">Mosaic restrictions</h1>
                        <AccountRestrictionsList
                            v-if="!addNewFormVisible"
                            class="table-section"
                            restriction-tx-type="MOSAIC"
                            @deleteRestriction="onDeleteRestriction"
                        />
                        <FormAccountRestrictionTransaction
                            v-if="addNewFormVisible"
                            restriction-tx-type="MOSAIC"
                            :restriction-to-be-deleted="restrictionToBeDeleted"
                            @on-confirmation-success="hideAddNewForm"
                        />
                        <div class="tab-footer">
                            <button v-if="!addNewFormVisible" class="button-style inverted-button pl-2 pr-2" @click="showAddNewForm">
                                {{ $t('add_mosaic_restrictions') }}
                            </button>
                            <button
                                v-if="addNewFormVisible"
                                class="centered-button button-style button danger-button pl-2 pr-2"
                                @click="hideAddNewForm"
                            >
                                {{ $t('cancel') }}
                            </button>
                        </div>
                    </div>
                    <div v-if="knownTabs[currentTabIndex] === 'OPERATION' && !!currentAccount" class="restriction-wrapper">
                        <h1 class="title">Operation restrictions</h1>
                        <AccountRestrictionsList
                            v-if="!addNewFormVisible"
                            class="table-section"
                            restriction-tx-type="TRANSACTION_TYPE"
                            @deleteRestriction="onDeleteRestriction"
                        />
                        <FormAccountRestrictionTransaction
                            v-if="addNewFormVisible"
                            restriction-tx-type="TRANSACTION_TYPE"
                            :restriction-to-be-deleted="restrictionToBeDeleted"
                            @on-confirmation-success="hideAddNewForm"
                        />
                        <div class="tab-footer">
                            <button
                                v-if="!addNewFormVisible"
                                class="button-style inverted-button pl-2 pr-2 pl-2 pr-2"
                                @click="showAddNewForm"
                            >
                                {{ $t('add_operation_restrictions') }}
                            </button>
                            <button
                                v-if="addNewFormVisible"
                                class="centered-button button-style button danger-button"
                                @click="hideAddNewForm"
                            >
                                {{ $t('cancel') }}
                            </button>
                        </div>
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
