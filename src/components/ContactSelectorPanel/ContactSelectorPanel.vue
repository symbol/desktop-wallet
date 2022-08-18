<template>
    <div>
        <div class="account-selector-panel">
            <div v-auto-scroll="'active-background'" class="account-switch-body-container scroll">
                <NavigationLinks
                    :direction="'horizontal'"
                    :items="panelItems"
                    :current-item-index="activePanel"
                    translation-prefix="tab_contact_"
                    @selected="(i) => (activePanel = i)"
                />
                <div v-if="activePanel == 1">
                    <div
                        v-for="(item, index) in blackListedContacts"
                        :key="index"
                        :class="['contact-title', isActiveContact(item) ? 'active-background' : 'inactive-background', 'pointer']"
                        @click="selectedContactId = item.id"
                    >
                        <div class="contact-item">
                            <img v-if="isActiveContact(item)" src="@/views/resources/img/icons/malicious-actor.svg" alt />
                            <img v-else src="@/views/resources/img/icons/malicious-actor.svg" class="contact-icon-inactive" alt />
                            <span class="contact-info">
                                <p class="trunc-text">{{ item.name }}</p>
                                <p class="trunc-text address">{{ item.address }}</p>
                            </span>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div
                        v-for="(item, index) in whiteListedContacts"
                        :key="index"
                        :class="['contact-title', isActiveContact(item) ? 'active-background' : 'inactive-background', 'pointer']"
                        @click="selectedContactId = item.id"
                    >
                        <div class="contact-item">
                            <img v-if="isActiveContact(item)" src="@/views/resources/img/icons/whitelisted_contact.svg" alt />
                            <img v-else src="@/views/resources/img/icons/whitelisted_contact.svg" class="contact-icon-inactive" alt />
                            <span class="contact-info">
                                <p class="trunc-text">{{ item.name }}</p>
                                <p class="trunc-text address">{{ item.address }}</p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="account-switch-footer-container">
                <span type="button" class="action-button pointer button" @click="hasAddAccountModal = true">
                    <img src="@/views/resources/img/newicons/Add.svg" class="icon-left-button" />
                    {{ $t('add_contact') }}
                </span>

                <div
                    v-if="addressBook.getAllContacts().length > 0"
                    class="account-switch-header-right-container"
                    @click="hasBackupProfileModal = true"
                >
                    <span type="button" class="action-button pointer button" @click="downloadAddressBook">
                        <img src="@/views/resources/img/newicons/Download.svg" class="icon-left-button" />
                        {{ $t('backup_address_book') }}
                    </span>
                </div>

                <div class="account-switch-header-right-container" @click="hasImportProfileModal = true">
                    <span type="button" class="action-button pointer button" @click="hasImportProfileModal = true">
                        <img src="@/views/resources/img/navbar/import.svg" class="icon-left-button" />
                        {{ $t('import_address_book') }}
                    </span>
                </div>
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
