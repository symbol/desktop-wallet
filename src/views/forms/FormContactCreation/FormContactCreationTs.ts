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
// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';
// configuration
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { FilterHelpers } from '@/core/utils/FilterHelpers';
import { AddressBook } from 'symbol-address-book/AddressBook';
import { Address } from 'symbol-sdk';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        FormWrapper,
        FormRow,
        ModalFormProfileUnlock,
    },
    computed: {
        ...mapGetters({
            addressBook: 'addressBook/getAddressBook',
            currentProfile: 'profile/currentProfile',
        }),
    },
})
export class FormContactCreationTs extends Vue {
    /**
     * Validation rules
     */
    public validationRules = ValidationRuleset;

    public addressBook: AddressBook;

    public currentProfile: ProfileModel;

    /**
     * Form fields
     * @var {Object}
     */
    public formItems = {
        name: '',
        address: '',
        isBlackListed: false,
    };

    /**
     * Type the ValidationObserver refs
     * @type {{
     *     observer: InstanceType<typeof ValidationObserver>
     *   }}
     */
    public $refs!: {
        observer: InstanceType<typeof ValidationObserver>;
    };

    public get isButtonDisabled(): boolean {
        return !this.formItems.name.trim() || !this.formItems.address.trim();
    }

    /// end-region computed properties getter/setter

    /**
     * Submit action asks for account unlock
     * @return {void}
     */
    public onSubmit(type: 'white_list' | 'black_list') {
        const address = Address.createFromRawAddress(this.formItems.address);

        if (address.networkType !== this.currentProfile.networkType) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('error_contact_does_not_match_profile'));
            return;
        }

        const contacts = this.addressBook.getAllContacts();
        const isSameAddress = contacts.some((contact) => contact.address === address.plain());

        if (isSameAddress) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('error_contact_already_exists'));

            return;
        }

        this.$store.dispatch('addressBook/ADD_CONTACT', {
            name: this.formItems.name,
            address: address.plain(),
            isBlackListed: type === 'black_list',
        });
        this.$emit('submit');
    }

    /**
     * filter tags
     */
    public stripTagsAccountName() {
        this.formItems.name = FilterHelpers.stripFilter(this.formItems.name);
    }
}
