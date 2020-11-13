<template>
    <div v-if="selectedContact" class="account-detail-outer-container">
        <div class="account-detail-inner-container">
            <div class="left-container">
                <AddressQR :contact="selectedContact" />
            </div>
            <div class="right-container">
                <div class="account-details-grid">
                    <div class="detail-row">
                        <FormInputEditable
                            :model="selectedContact"
                            :value="selectedContact.name"
                            :new-value="selectedContact.name"
                            :editing="false"
                            :label="$t('contact_name')"
                            :on-edit="saveProperty('name')"
                        />
                    </div>
                    <div class="detail-row">
                        <FormInputEditable
                            :model="selectedContact"
                            :value="selectedContact.address"
                            :new-value="selectedContact.address"
                            :editing="false"
                            :rules="validationRules.addressOrPublicKey"
                            :label="$t('contact_address')"
                            :on-edit="saveProperty('address')"
                        />
                    </div>
                    <div class="detail-row">
                        <FormInputEditable
                            :model="selectedContact"
                            :value="selectedContact.phone"
                            :new-value="selectedContact.phone"
                            :editing="false"
                            :rules="''"
                            :label="$t('contact_phone')"
                            :on-edit="saveProperty('phone')"
                        />
                    </div>
                    <div class="detail-row">
                        <FormInputEditable
                            :model="selectedContact"
                            :value="selectedContact.email"
                            :new-value="selectedContact.email"
                            :editing="false"
                            :rules="''"
                            :label="$t('contact_email')"
                            :on-edit="saveProperty('email')"
                        />
                    </div>
                    <div class="detail-row">
                        <FormInputEditable
                            :model="selectedContact"
                            :value="selectedContact.notes"
                            :new-value="selectedContact.notes"
                            :editing="false"
                            :rules="''"
                            :label="$t('contact_notes')"
                            :on-edit="saveProperty('notes')"
                        />
                    </div>
                    <div class="detail-row" style="margin-top: 1rem;">
                        <div class="bottom-buttons-container">
                            <div></div>
                            <button type="button" class="centered-button button-style button danger-button" @click="showDeleteModal = true">
                                {{ $t('delete_contact') }}
                            </button>
                        </div>
                    </div>
                </div>
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

.title {
    color: @primary;
    font-size: 18px;
}

.bottom-buttons-container {
    margin-left: auto;
    margin-right: 1em;
    width: 50%;
    display: grid;
    grid-template-columns: 50% 50%;
}
.bottom-buttons-container button {
    margin: 0 0.5em;
}

.overflow-elipsis {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
