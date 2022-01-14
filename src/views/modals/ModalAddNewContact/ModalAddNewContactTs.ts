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
import { networkConfig } from '@/config';
import { AddressBook } from 'symbol-address-book';
import { NetworkType } from 'symbol-sdk';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters({
            addressBook: 'addressBook/getAddressBook',
            networkType: 'network/networkType',
        }),
    },
})
export class ModalAddNewContactTs extends Vue {
    @Prop({
        default: false,
    })
    visible: boolean;
    @Prop({
        default: '',
    })
    signerAddress: string;
    @Prop({
        default: '',
    })
    transactionHash: string;
    public contactName: string = '';
    public contactNote: string = '';
    public addressBook: AddressBook;
    public networkType: NetworkType;

    /**
     * Visibility state
     * @type {boolean}
     */
    get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     */
    set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    onClickSeeBlackList() {
        this.$store.commit('addressBook/setBlackListedContactsSelected', true);
        this.$router.push({ name: 'accounts.details' });
    }

    onClickSave() {
        const contacts = this.addressBook.getAllContacts();
        const isSameAddress = contacts.some((contact) => contact.address === this.signerAddress);

        if (isSameAddress) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('error_contact_already_exists'));
            return;
        }

        this.$store.dispatch('addressBook/ADD_CONTACT', {
            name: this.contactName,
            address: this.signerAddress,
            isBlackListed: false,
            notes: this.contactNote,
        });
        this.$emit('close');
        this.show = false;
    }

    public get explorerUrl() {
        return networkConfig[this.networkType].explorerUrl.replace(/\/+$/, '') + '/transactions/' + this.transactionHash;
    }

    public onSubmit() {
        this.show = false;
    }
}
