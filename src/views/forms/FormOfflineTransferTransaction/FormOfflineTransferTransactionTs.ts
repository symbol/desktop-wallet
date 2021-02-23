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
import {
    Address,
    EncryptedMessage,
    Message,
    Mosaic,
    MosaicId,
    NamespaceId,
    PlainMessage,
    RawUInt64,
    Transaction,
    TransferTransaction,
    UInt64,
    Account,
    PublicAccount, NetworkType,
} from 'symbol-sdk';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountType } from '@/core/database/entities/AccountModel';
import { Formatters } from '@/core/utils/Formatters';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';
import { AddressValidator, AliasValidator } from '@/core/validation/validators';
import { ITransactionEntry } from '@/views/pages/dashboard/invoice/DashboardInvoicePageTs';
// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate';
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';
// @ts-ignore
import MosaicAttachmentInput from '@/components/MosaicAttachmentInput/MosaicAttachmentInput.vue';
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue';
// @ts-ignore
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import ModalTransactionUriImport from '@/views/modals/ModalTransactionUriImport/ModalTransactionUriImport.vue';
// @ts-ignore
import TransactionUriDisplay from '@/components/TransactionUri/TransactionUriDisplay/TransactionUriDisplay.vue';
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue';
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';

// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { FilterHelpers } from '@/core/utils/FilterHelpers';
import { TransactionCommand } from '@/services/TransactionCommand';
import { appConfig } from '@/config';
import ErrorTooltip from "@/components/ErrorTooltip/ErrorTooltip.vue";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector.vue";
import {ProfileModel} from "@/core/database/entities/ProfileModel";
import {ProfileService} from "@/services/ProfileService";
import {AccountService} from "@/services/AccountService";
import {ValidationRuleset} from "@/core/validation/ValidationRuleset";
import {NetworkTypeHelper} from "@/core/utils/NetworkTypeHelper";
import {NotificationType} from "@/core/utils/NotificationType";
import {Signer} from "@/store/Account";
import {MultisigService} from "@/services/MultisigService";
const { DECIMAL_SEPARATOR } = appConfig.constants;

export interface MosaicAttachment {
    mosaicHex: string;
    amount: string; // Relative amount
    id?: MosaicId;
    name?: string;
    uid?: number;
}

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

        const reducer = (accumulator: { networkType: NetworkType; profiles: ProfileModel[] }[], currentValue: ProfileModel) => {
            const currentAccumulator = accumulator.find((a) => a.networkType == currentValue.networkType);
            if (currentAccumulator) {
                currentAccumulator.profiles.push(currentValue);
                return accumulator;
            } else {
                return [...accumulator, { networkType: currentValue.networkType, profiles: [currentValue] }];
            }
        };

        this.profilesClassifiedByNetworkType = this.profiles.reduce(reducer, []);
        if (!this.profiles.length) {
            return;
        }
        // accounts available, iterate to first profiles
        this.formItems.currentProfileName = this.profiles[0].profileName;
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

    public onProfileNameChange() {
        try {
            const currentProfileName = this.formItems.currentProfileName;
            const profile = this.profileService.getProfileByName(currentProfileName);
            const accounts = profile.accounts.map(id => this.accountService.getAccount(id));
            if (accounts.length > 0) {
                this.signers = new MultisigService().getSigners(profile.networkType, accounts, accounts[0], undefined, undefined);
                //console.log(accounts);
            }
        } catch (e) {
            this.signers = [];
        }
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
}
