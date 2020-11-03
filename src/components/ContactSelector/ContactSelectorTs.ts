/*
 * Copyright 2020 NEM (https://nem.io)
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
//@ts-ignore
import ModalNetworkNotMatchingProfile from '@/views/modals/ModalNetworkNotMatchingProfile/ModalNetworkNotMatchingProfile.vue';
import { IContact, AddressBook } from 'symbol-address-book';

@Component({
    components: { ModalNetworkNotMatchingProfile },
    computed: {
        ...mapGetters({
            addressBook: 'addressBook/getAddressBook',
        }),
    },
})
export class ContactSelectorTs extends Vue {
    @Prop() onContactSelect: (id: string) => {};

    public poptipVisible: boolean = false;
    public addressBook: AddressBook;

    /// region computed properties getter/setter
    get contactList(): IContact[] {
        return this.addressBook.getAllContacts();
    }

    /// end-region computed properties getter/setter

    /**
     * Switch the currently active peer
     * @param id
     */
    public selectContact(id: string) {
        this.$emit('change', id);
        this.poptipVisible = false;
    }
    onPopTipShow() {
        this.$forceUpdate();
    }
}
