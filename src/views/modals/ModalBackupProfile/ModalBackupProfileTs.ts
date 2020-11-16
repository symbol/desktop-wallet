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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Account, NetworkType, Password, Crypto, Address } from 'symbol-sdk';
// internal dependencies
import { ProfileModel } from '@/core/database/entities/ProfileModel';
// child components
// @ts-ignore
import FormProfileUnlock from '@/views/forms/FormProfileUnlock/FormProfileUnlock.vue';
// resources
// @ts-ignore
import { AccountModel } from '@/core/database/entities/AccountModel';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';
import { SymbolPaperWallet, IAccountInfo, IHDAccountInfo } from 'symbol-paper-wallets';
import { AccountService } from '@/services/AccountService';
import { UIHelpers } from '@/core/utils/UIHelpers';

@Component({
    components: { FormProfileUnlock },
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            networkType: 'network/networkType',
            generationHash: 'network/generationHash',
            knownAccounts: 'account/knownAccounts',
        }),
    },
})
export class ModalBackupProfileTs extends Vue {
    @Prop({
        default: false,
    })
    visible: boolean;

    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {ProfileModel}
     */
    public currentProfile: ProfileModel;

    /**
     * Current networkType
     * @see {Store.Network}
     * @var {NetworkType}
     */
    public networkType: NetworkType;

    /**
     * Current generationHash
     * @see {Store.Network}
     * @var {string}
     */
    public generationHash: string;

    /**
     * Known accounts to the profile
     */
    public knownAccounts: AccountModel[];

    /**
     * Known accounts as paper-wallet IAccountInfo (array) type
     * @var {IAccountInfo[]}
     */
    public knownAccountInfos: IAccountInfo[];

    /**
     * Whether account is unlocked
     */
    public accountUnlocked: boolean = false;

    /**
     * Mnemonic words (space delimited)
     */
    private plainMnemonic: string = null;

    /**
     * Account Service
     * @var {AccountService}
     */
    public accountService: AccountService;

    public downloadInProgress: boolean = false;

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

    /**
     * Hook called when the account has been unlocked
     * @param {Account} account
     */
    public onAccountUnlocked(payload: { account: Account; password: Password }) {
        // decrypt seed
        const encSeed = this.currentProfile.seed;
        this.plainMnemonic = Crypto.decrypt(encSeed, payload.password.value);
        this.accountUnlocked = true;

        this.knownAccountInfos = this.knownAccounts.map(
            (account) =>
                ({
                    name: account.name,
                    address: Address.createFromRawAddress(account.address).pretty(),
                    publicKey: account.publicKey,
                    privateKey: Crypto.decrypt(account.encryptedPrivateKey, payload.password.value),
                } as IAccountInfo),
        );
    }

    /**
     * Hook called when child component FormProfileUnlock or
     * HardwareConfirmationButton emit the 'error' event.
     * @param {string} message
     * @return {void}
     */
    public onError(error: string) {
        this.$emit('error', error);
    }

    /**
     * Life cycle hook
     */
    public created() {
        this.accountService = new AccountService();
    }

    /**
     * Hook called when the download button is clicked
     * @return {void}
     */
    public async onDownload() {
        if (!this.plainMnemonic) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('mnemonic_not_found'));
            return;
        }
        Vue.set(this, 'downloadInProgress', true);
        setTimeout(async () => {
            await this.generateAndDownloadPaperWallet();
            Vue.set(this, 'downloadInProgress', false);
        }, 800); // labor illusion
    }

    /**
     * Generates and downloads paper-wallet for the root account and the profile(known) accounts
     */
    protected async generateAndDownloadPaperWallet(): Promise<boolean> {
        const rootAccount: Account = this.accountService.getAccountByPath(new MnemonicPassPhrase(this.plainMnemonic), this.networkType);
        const rootAccountInfo: IHDAccountInfo = {
            mnemonic: this.plainMnemonic,
            rootAccountPublicKey: rootAccount.publicKey,
            rootAccountAddress: rootAccount.address.pretty(),
        };

        const paperWallet = new SymbolPaperWallet(rootAccountInfo, this.knownAccountInfos, this.networkType, this.generationHash);
        const pdfArray: Uint8Array = await paperWallet.toPdf();
        return UIHelpers.downloadBytesAsFile(pdfArray, `paper-wallet-${this.currentProfile.profileName}`, 'application/pdf');
    }
}
