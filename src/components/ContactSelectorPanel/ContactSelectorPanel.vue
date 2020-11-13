<template>
    <div class="account-selector-panel">
        <div v-auto-scroll="'active-background'" class="account-switch-body-container scroll">
            <div
                v-for="(item, index) in allContacts"
                :key="index"
                :class="['account-tile', isActiveContact(item) ? 'active-background' : 'inactive-background', 'pointer']"
                @click="selectedContactId = item.id"
            >
                <div class="mosaic_data">
                    <span class="img_container">
                        <img v-if="isActiveContact(item)" src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        <img v-else src="@/views/resources/img/symbol/XYMCoin.png" class="grayed-xym-logo" />
                    </span>
                    <span class="mosaic_name">{{ item.name }}</span>
                </div>
            </div>
        </div>

        <div class="account-switch-footer-container">
            <span type="button" class="add-account pointer button" @click="hasAddAccountModal = true">
                <img src="@/views/resources/img/newicons/Add.svg" class="icon-left-button" />
                {{ $t('add_contact') }}
            </span>

            <div
                v-if="addressBook.getAllContacts().length > 0"
                class="account-switch-header-right-container"
                @click="hasBackupProfileModal = true"
            >
                <span type="button" class="back-up pointer button" @click="downloadAddressBook">
                    <img src="@/views/resources/img/newicons/Download.svg" class="icon-left-button" />
                    {{ $t('backup_address_book') }}
                </span>
            </div>

            <div
                v-if="addressBook.getAllContacts().length === 0"
                class="account-switch-header-right-container"
                @click="hasImportProfileModal = true"
            >
                <span type="button" class="back-up pointer button" @click="hasImportProfileModal = true">
                    <img src="@/views/resources/img/navbar/import.svg" class="icon-left-button" />
                    {{ $t('import_address_book') }}
                </span>
            </div>
        </div>

        <ModalContactCreation v-if="hasAddAccountModal" :visible="hasAddAccountModal" @close="hasAddAccountModal = false" />
        <ModalImportAddressBook v-if="hasImportProfileModal" :visible="hasImportProfileModal" @close="hasImportProfileModal = false" />
    </div>
</template>

<script lang="ts">
import { ContactSelectorPanelTs } from './ContactSelectorPanelTs';
import './ContactSelectorPanel.less';

export default class ContactSelectorPanel extends ContactSelectorPanelTs {}
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
