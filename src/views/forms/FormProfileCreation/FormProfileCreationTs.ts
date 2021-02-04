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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Password, PublicAccount } from 'symbol-sdk';
// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { NotificationType } from '@/core/utils/NotificationType';
import { ProfileService } from '@/services/ProfileService';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { NetworkTypeHelper } from '@/core/utils/NetworkTypeHelper';
import { FilterHelpers } from '@/core/utils/FilterHelpers';
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';
import { AccountService } from '@/services/AccountService';
import { LedgerService } from '@/services/LedgerService';

/// end-region custom types

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        FormWrapper,
        FormRow,
    },
    computed: {
        ...mapGetters({
            generationHash: 'network/generationHash',
            currentProfile: 'profile/currentProfile',
        }),
    },
})
export class FormProfileCreationTs extends Vue {
    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public profileService: ProfileService;

    isLedger = false;

    created() {
        this.profileService = new ProfileService();
        const { isLedger } = this.$route.meta;
        this.isLedger = isLedger;
    }

    /**
     * Currently active network type
     * @see {Store.Network}
     * @var {string}
     */
    public generationHash: string;

    /**
     * Accounts repository
     * @var {ProfileService}
     */
    public accountService = new ProfileService();

    /**
     * Ledger Accounts repository
     * @var {ProfileService}
     */
    public ledgerAccountService = new AccountService();

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /**
     * Form fields
     * @var {Object}
     */
    public formItems = {
        profileName: '',
        password: '',
        passwordAgain: '',
        hint: '',
        networkType: this.$store.getters['network/networkType'],
    };

    /**
     * Network types
     * @var {NetworkNodeEntry[]}
     */
    public networkTypeList = NetworkTypeHelper.networkTypeList;

    /**
     * Type the ValidationObserver refs
     * @type {{
     *     observer: InstanceType<typeof ValidationObserver>
     *   }}
     */
    public $refs!: {
        observer: InstanceType<typeof ValidationObserver>;
    };

    /// region computed properties getter/setter
    get nextPage() {
        return this.$route.meta.nextPage;
    }

    /// end-region computed properties getter/setter

    /**
     * Error notification handler
     */
    private errorNotificationHandler(error: any) {
        if (error.errorCode) {
            switch (error.errorCode) {
                case 'NoDevice':
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_no_device');
                    return;
                case 'ledger_not_supported_app':
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_not_supported_app');
                    return;
                case 26628:
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_device_locked');
                    return;
                case 27904:
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_not_opened_app');
                    return;
                case 27264:
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_not_using_xym_app');
                    return;
                case 27013:
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_user_reject_request');
                    return;
            }
        } else if (error.name) {
            switch (error.name) {
                case 'TransportOpenUserCancelled':
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_no_device_selected');
                    return;
            }
        }
        this.$store.dispatch('notification/ADD_ERROR', this.$t('create_profile_failed', { reason: error.message || error }));
    }

    /**
     * Submit action, validates form and creates account in storage
     * @return {void}
     */
    public submit() {
        // @VEE
        this.persistAccountAndContinue();
        this.resetValidations();
    }

    /**
     *  resets form validation
     */

    public resetValidations(): void {
        this.$refs && this.$refs.observer && this.$refs.observer.reset();
    }

    /**
     * Persist created account and redirect to next step
     * @return {void}
     */
    private persistAccountAndContinue() {
        // -  password stored as hash (never plain.)
        const passwordHash = ProfileService.getPasswordHash(new Password(this.formItems.password));

        const account: ProfileModel = {
            profileName: this.formItems.profileName,
            accounts: [],
            seed: '',
            password: passwordHash,
            hint: this.formItems.hint,
            networkType: this.formItems.networkType,
            generationHash: this.generationHash,
            termsAndConditionsApproved: false,
        };
        // use repository for storage
        this.accountService.saveProfile(account);

        // execute store actions
        this.$store.dispatch('profile/SET_CURRENT_PROFILE', account);
        this.$store.dispatch('temporary/SET_PASSWORD', this.formItems.password);
        if (!this.isLedger) {
            this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS);

            // flush and continue
            this.$router.push({ name: this.nextPage });
        } else {
            this.importDefaultLedgerAccount(this.formItems.networkType)
                .then((res) => {
                    this.ledgerAccountService.saveAccount(res);
                    // - update app state
                    this.$store.dispatch('profile/ADD_ACCOUNT', res);
                    this.$store.dispatch('account/SET_CURRENT_ACCOUNT', res);
                    this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', [res.id]);
                    this.$store.dispatch('temporary/RESET_STATE');
                    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS);
                    this.$router.push({ name: 'profiles.accessLedger.finalize' });
                })
                .catch((error) => {
                    this.errorNotificationHandler(error);
                });
        }
    }

    /**
     * filter tags
     */
    public stripTagsProfile() {
        this.formItems.profileName = FilterHelpers.stripFilter(this.formItems.profileName);
        this.formItems.hint = FilterHelpers.stripFilter(this.formItems.hint);
    }

    /**
     * Get a account instance of Ledger from default path
     * @return {AccountModel}
     */
    private async importDefaultLedgerAccount(networkType: number): Promise<AccountModel> {
        const defaultPath = AccountService.getAccountPathByNetworkType(networkType);
        const ledgerService = new LedgerService(networkType);
        const isAppSupported = await ledgerService.isAppSupported();
        if (!isAppSupported) {
            throw { errorCode: 'ledger_not_supported_app' };
        }
        const profileName = this.formItems.profileName;
        const accountService = new AccountService();
        this.$store.dispatch('notification/ADD_SUCCESS', 'verify_device_information');
        const accountResult = await accountService.getLedgerPublicKeyByPath(networkType, defaultPath);
        const publicKey = accountResult;
        const address = PublicAccount.createFromPublicKey(publicKey, networkType).address;

        // add account to list
        const accName = this.currentProfile.profileName;

        return {
            id: SimpleObjectStorage.generateIdentifier(),
            name: accName,
            profileName: profileName,
            node: '',
            type: AccountType.fromDescriptor('Ledger'),
            address: address.plain(),
            publicKey: publicKey.toUpperCase(),
            encryptedPrivateKey: '',
            path: defaultPath,
            isMultisig: false,
        };
    }
}
