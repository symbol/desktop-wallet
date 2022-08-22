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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ValidationProvider } from 'vee-validate';
// internal dependencies
import { AddressBook, IContact } from 'symbol-address-book';
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue';
// @ts-ignore
import ModalFormSubAccountCreation from '@/views/modals/ModalFormSubAccountCreation/ModalFormSubAccountCreation.vue';
// @ts-ignore
import ModalImportAddressBook from '@/views/modals/ModalImportAddressBook/ModalImportAddressBook.vue';
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue';
// @ts-ignore
import ModalBackupProfile from '@/views/modals/ModalBackupProfile/ModalBackupProfile.vue';
// @ts-ignore
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';
// @ts-ignore
import ModalContactCreation from '@/views/modals/ModalContactCreation/ModalContactCreation.vue';
import { UIHelpers } from '@/core/utils/UIHelpers';
import { CommonHelpers } from '@/core/utils/CommonHelpers';

@Component({
    components: {
        MosaicAmountDisplay,
        ModalFormSubAccountCreation,
        ModalImportAddressBook,
        ErrorTooltip,
        FormLabel,
        ValidationProvider,
        AmountDisplay,
        ModalBackupProfile,
        ModalContactCreation,
        NavigationLinks,
    },
    computed: {
        ...mapGetters({
            addressBook: 'addressBook/getAddressBook',
            selectedContact: 'addressBook/getSelectedContact',
            isBlackListedSelected: 'addressBook/getBlackListedContactsSelected',
        }),
    },
})
export class ContactSelectorPanelTs extends Vue {
    /**
     * Address book
     * @see {Store.addressBook}
     * @var {AddressBook}
     */
    public addressBook: AddressBook;
    /**
     * Selected contact
     * @see {Store.addressBook}
     * @var {IContact}
     */
    public selectedContact: IContact;

    public hasAddAccountModal: boolean = false;
    public activeIndex = 0;
    public hasImportProfileModal: boolean = false;
    public panelItems = ['white_list', 'black_list'];
    public commonHelpers = CommonHelpers;
    public isBlackListedSelected: boolean;

    public get activePanel() {
        return this.activeIndex;
    }

    public set activePanel(panel) {
        this.activeIndex = panel;
    }

    /**
     * gets blacklisted contacts
     */
    public get blackListedContacts(): IContact[] {
        return this.addressBook.getBlackListedContacts();
    }

    /**
     * gets whitelisted contacts
     */
    public get whiteListedContacts(): IContact[] {
        return this.addressBook.getWhiteListedContacts();
    }

    public set selectedContactId(id: string) {
        const newSelectedContact = this.addressBook.getContactById(id);
        this.$store.commit('addressBook/setSelectedContact', newSelectedContact);
    }
    public get selectedContactId() {
        return this.selectedContact.id;
    }

    public isActiveContact(contact: IContact): boolean {
        if (!this.selectedContact) {
            return false;
        }
        return this.selectedContact.id === contact.id;
    }

    public downloadAddressBook() {
        UIHelpers.downloadBytesAsFile(this.addressBook.toJSON(), `address-book.json`, 'application/json');
    }

    mounted() {
        if (this.isBlackListedSelected) {
            this.activeIndex = 1;
        }
    }

    /// end-region computed properties getter/setter
}
