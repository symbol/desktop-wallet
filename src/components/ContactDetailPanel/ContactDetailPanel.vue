<template>
    <div v-if="selectedContact" class="account-detail-outer-container">
        <div class="account-detail-inner-container">
            <div class="left-container">
                <AccountContactQR :account="selectedContactPublicAccount" />
            </div>
            <div class="right-container">
                <div class="account-details-grid">
                    <FormInputEditable
                        :model="selectedContact"
                        :value="selectedContact.name"
                        :new-value="selectedContact.name"
                        :editing="false"
                        :label="$t('contact_name')"
                        :on-edit="saveProperty('name')"
                    />
                    <FormInputEditable
                        :model="selectedContact"
                        :value="selectedContact.address"
                        :new-value="selectedContact.address"
                        :editing="false"
                        :label="$t('contact_address')"
                        :on-edit="saveProperty('address')"
                    />
                    <FormInputEditable
                        :model="selectedContact"
                        :value="selectedContact.phone"
                        :new-value="selectedContact.phone"
                        :editing="false"
                        :label="$t('contact_phone')"
                        :on-edit="saveProperty('phone')"
                    />
                    <FormInputEditable
                        :model="selectedContact"
                        :value="selectedContact.email"
                        :new-value="selectedContact.email"
                        :editing="false"
                        :label="$t('contact_email')"
                        :on-edit="saveProperty('email')"
                    />
                    <FormInputEditable
                        :model="selectedContact"
                        :value="selectedContact.notes"
                        :new-value="selectedContact.notes"
                        :editing="false"
                        :label="$t('contact_notes')"
                        :on-edit="saveProperty('notes')"
                    />
                </div>
                <button @click="showDeleteModal = true"> REMOVE </button>
            </div>
        </div>
        <ModalConfirmDelete :visible="showDeleteModal" @close="showDeleteModal = false" @delete="removeContact" />
    </div>
</template>

<script lang="ts">
import { ContactDetailPanelTs } from './ContactDetailPanelTs';
export default class ContactDetailPanel extends ContactDetailPanelTs {}
</script>

<style lang="less" scoped>
@import './ContactDetailPanel.less';
</style>
