/*
 * Copyright 2020-present NEM (https://nem.io)
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
import { Address, NetworkType, SignedTransaction } from 'symbol-sdk';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue';
// @ts-ignore
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector.vue';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { ProfileService } from '@/services/ProfileService';
import { AccountService } from '@/services/AccountService';
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { NetworkTypeHelper } from '@/core/utils/NetworkTypeHelper';
import { NotificationType } from '@/core/utils/NotificationType';
import { Signer } from '@/store/Account';
import { SettingsModel } from '@/core/database/entities/SettingsModel';
import { SettingService } from '@/services/SettingService';
// @ts-ignore
import FormTransferTransaction from '@/views/forms/FormTransferTransaction/FormTransferTransaction.vue';
import _ from 'lodash';

@Component({
    components: {
        ErrorTooltip,
        ValidationProvider,
        ValidationObserver,
        LanguageSelector,
        SignerSelector,
        FormWrapper,
        MessageInput,
        RecipientInput,
        FormRow,
        MaxFeeAndSubmit,
        FormTransferTransaction,
    },
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            isAuthenticated: 'profile/isAuthenticated',
        }),
    },
})
export class FormOfflineTransferTransactionTs extends Vue {
    /**
     * Display the application version. This is injected in the app when built.
     */
    public packageVersion = process.env.PACKAGE_VERSION || '0';

    /**
     * All known profiles
     */
    private profiles: ProfileModel[];

    /**
     * Profiles indexed by network type
     */
    private profilesClassifiedByNetworkType: {
        networkType: NetworkType;
        profiles: ProfileModel[];
    }[];

    private performingLogin = false;

    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    public signers: Signer[] = [];

    /**
     * Profiles repository
     * @var {ProfileService}
     */
    public profileService = new ProfileService();

    public accountService = new AccountService();

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /**
     * Form items
     */
    public formItems: any = {
        currentProfileName: '',
        signerAddress: Address,
        recipientRaw: null,
        hasHint: false,
        maxFee: 0,
    };

    public previousProfileName: string;
    public loaded: boolean = false;

    /**
     * All known profiles names
     */
    protected get profileNames(): string[] {
        return this.profiles.map(({ profileName }) => profileName);
    }

    /**
     * Hook called when the page is mounted
     * @return {void}
     */
    public created() {
        // filter out invalid profiles
        this.profiles = this.profileService.getProfiles().filter((p) => p.accounts.length > 0);

        if (!this.profiles.length) {
            return;
        }

        const profilesGroupedByNetworkType = _.groupBy(this.profiles, (p) => p.networkType);
        this.profilesClassifiedByNetworkType = Object.values(profilesGroupedByNetworkType).map((profiles) => ({
            networkType: profiles[0].networkType,
            profiles: profiles,
        }));

        // accounts available, iterate to first profile
        this.formItems.currentProfileName = this.profiles[0].profileName;
        this.onProfileNameChange();
    }

    /**
     * Getter for network type label
     * @param {NetworkType} networkType
     * @return {string}
     */
    public getNetworkTypeLabel(networkType: NetworkType): string {
        return NetworkTypeHelper.getNetworkTypeLabel(networkType);
    }

    /**
     * Submit action, validates form and logs in user if valid
     * @return {void}
     */
    public async submit() {
        if (this.performingLogin) {
            return;
        }

        if (!this.formItems.currentProfileName.length) {
            return this.$store.dispatch('notification/ADD_ERROR', NotificationType.PROFILE_NAME_INPUT_ERROR);
        }

        if (!this.formItems.password.length || this.formItems.password.length < 8) {
            return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR);
        }

        this.performingLogin = true;
        // now compare password hashes
        return;
    }

    public async onProfileNameChange() {
        this.loaded = false;
        const currentProfileName = this.formItems.currentProfileName;
        const profile = this.profileService.getProfileByName(currentProfileName);
        if (!profile) {
            return;
        }

        const settingService = new SettingService();

        const settings: SettingsModel = settingService.getProfileSettings(currentProfileName, profile.networkType);

        const knownAccounts: AccountModel[] = this.accountService.getKnownAccounts(profile.accounts);

        if (knownAccounts.length == 0) {
            throw new Error('knownAccounts is empty');
        }

        const defaultAccountId = settings.defaultAccount ? settings.defaultAccount : knownAccounts[0].id;
        if (!defaultAccountId) {
            throw new Error('defaultAccountId could not be resolved');
        }
        const defaultAccount = knownAccounts.find((w) => w.id == defaultAccountId);
        if (!defaultAccount) {
            throw new Error(`defaultAccount could not be resolved from id ${defaultAccountId}`);
        }

        await this.$store.dispatch('profile/SET_CURRENT_PROFILE', profile);
        await this.$store.dispatch('network/CONNECT', { networkType: profile.networkType, isOffline: true });
        this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', profile.accounts);
        await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', defaultAccount);
        this.$store.dispatch('diagnostic/ADD_DEBUG', 'Profile login successful with currentProfileName: ' + currentProfileName);
        await this.$store.dispatch('network/REST_NETWORK_RENTAL_FEES');
        const signers = knownAccounts.map((account) => ({
            address: Address.createFromRawAddress(account.address),
            label: account.name,
            multisig: account.isMultisig,
            requiredCosignatures: 0,
        }));
        this.$store.commit('account/signers', signers);

        this.loaded = true;
    }

    isLedgerProfile(): boolean {
        const profileService = new ProfileService();
        const currentProfileName = this.formItems.currentProfileName;
        const profile = profileService.getProfileByName(currentProfileName);
        const existingLedgerAccounts = profile.accounts.find((w) => {
            if (this.accountService.getAccount(w).type == AccountType.fromDescriptor('Ledger')) {
                return w;
            }
        });
        if (existingLedgerAccounts !== ('' || undefined)) {
            return true;
        }
        return false;
    }

    /**
     * Hook called when the child component ModalTransactionConfirmation triggers
     * the event 'signed'
     */
    public onSignedOfflineTransaction(signedTransaction: SignedTransaction) {
        this.$emit('transactionSigned', signedTransaction);
    }
}
