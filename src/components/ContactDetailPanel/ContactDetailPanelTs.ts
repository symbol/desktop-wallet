/*
 * (C) Symbol Contributors 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// child components
// @ts-ignore
import AccountNameDisplay from '@/components/AccountNameDisplay/AccountNameDisplay.vue';
// @ts-ignore
import AddressQR from '@/components/AddressQR/AddressQR.vue';
// @ts-ignore
import AccountAddressDisplay from '@/components/AccountAddressDisplay/AccountAddressDisplay.vue';
// @ts-ignore
import FormInputEditable from '@/components/FormInputEditable/FormInputEditable.vue';
// @ts-ignore
import ModalConfirm from '@/views/modals/ModalConfirm/ModalConfirm.vue';
import { AddressBook, IContact } from 'symbol-address-book';
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { Address } from 'symbol-sdk';

@Component({
    components: {
        AccountNameDisplay,
        AddressQR,
        AccountAddressDisplay,
        FormInputEditable,
        ModalConfirm,
    },
    computed: {
        ...mapGetters({
            addressBook: 'addressBook/getAddressBook',
            selectedContact: 'addressBook/getSelectedContact',
        }),
        address: function () {
            return Address.createFromRawAddress(this.selectedContact.address).plain();
        },
    },
})
export class ContactDetailPanelTs extends Vue {
    public addressBook: AddressBook;
    public selectedContact: IContact;
    protected address: string;
    protected newName: string = '';
    protected newAddress: string = '';
    protected newPhone: string = '';
    protected newEmail: string = '';
    protected newNotes: string = '';
    public showDeleteConfirmModal: boolean = false;
    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    public showBlackWhiteListConfirmModal = false;
    public saveProperty(propName: string) {
        return (newVal: string) => {
            const contact = { ...this.selectedContact };

            if (propName === 'address') {
                const plainAddress = Address.createFromRawAddress(newVal).plain();
                contact[propName] = plainAddress;
            } else {
                contact[propName] = newVal;
            }

            try {
                this.$store.dispatch('addressBook/UPDATE_CONTACT', { id: this.selectedContact.id, contact });
            } catch {
                this.$store.dispatch('notification/ADD_ERROR', this.$t('error_contact_already_exists'));
            }

            this.$store.commit('addressBook/setSelectedContact', null);

            this.newName = '';
            this.newAddress = '';
            this.newPhone = '';
            this.newEmail = '';
            this.newNotes = '';

            this.$nextTick(() => {
                const selectedContact = this.addressBook.getContactById(contact.id);
                this.$store.commit('addressBook/setSelectedContact', selectedContact);
            });
        };
    }

    public get showDeleteModal() {
        return this.showDeleteConfirmModal;
    }

    public set showDeleteModal(val: boolean) {
        this.showDeleteConfirmModal = val;
    }

    public get showBlackWhiteListModal() {
        return this.showBlackWhiteListConfirmModal;
    }

    public set showBlackWhiteListModal(val: boolean) {
        this.showBlackWhiteListConfirmModal = val;
    }

    public removeContact() {
        this.$store.dispatch('addressBook/REMOVE_CONTACT', this.selectedContact.id);
        this.showDeleteConfirmModal = false;
    }

    public ToggleBlackListContact() {
        this.selectedContact.isBlackListed = !this.selectedContact?.isBlackListed;
        this.$store.dispatch('addressBook/UPDATE_CONTACT', { id: this.selectedContact.id, contact: this.selectedContact });
        this.showBlackWhiteListModal = false;
    }

    @Watch('addressBook', { immediate: true })
    onContactListChange() {
        return;
    }
}
