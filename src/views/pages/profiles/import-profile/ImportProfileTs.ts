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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Formatters } from '@/core/utils/Formatters';
import { mapGetters } from 'vuex';
import { MnemonicPassPhrase, Network } from 'symbol-hd-wallets';
import { AccountInfo, Address, MosaicId, RepositoryFactory } from 'symbol-sdk';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { AccountService } from '@/services/AccountService';
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';

@Component({
    components: {
        MosaicAmountDisplay,
    },
    computed: {
        ...mapGetters({
            currentMnemonic: 'temporary/mnemonic',
            networkType: 'network/networkType',
            networkMosaic: 'mosaic/networkMosaic',
            networkCurrency: 'mosaic/networkCurrency',
            currentProfile: 'profile/currentProfile',
            currentPassword: 'temporary/password',
            selectedAccounts: 'account/selectedAddressesToInteract',
            optInSelectedAccounts: 'account/selectedAddressesOptInToInteract',
        }),
    },
})
export default class ImportProfileTs extends Vue {
    /**
     * Formatting helpers
     * @protected
     */
    protected formatters = Formatters;
    /**
     * List of steps
     * @var {string[]}
     */
    public StepBarTitleList = ['create_profile', 'mnemonic_phrase', 'select_accounts', 'finish'];

    /**
     * Network's currency mosaic id
     * @see {Store.Mosaic}
     * @var {MosaicId}
     */
    public networkMosaic: MosaicId;

    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    /**
     * Temporary stored mnemonic pass phrase
     * @see {Store.Temporary}
     * @var {MnemonicPassPhrase}
     */
    public currentMnemonic: string;

    /**
     * Account Service
     * @var {AccountService}
     */
    public accountService: AccountService;

    /**
     * List of addresses
     * @var {Address[]}
     */
    public addressesList: Address[] = [];

    /**
     * List of opt in addresses
     * @var {Address[]}
     */
    public optInAddressesList: Address[] = [];

    /**
     * Balances map
     * @var {any}
     */
    public addressMosaicMap = {};

    /**
     * Map of selected accounts
     * @var {number[]}
     */
    public selectedAccounts: number[];

    /**
     * Map of selected accounts
     * @var {number[]}
     */
    public optInSelectedAccounts: number[];

    /**
     * Indicates if account balance and addresses are already fetched
     */
    private initialized: boolean = false;
    private optInInitialized: boolean = false;

    /**
     * Hook called when the page is mounted
     * @return {void}
     */
    async mounted() {
        this.accountService = new AccountService();
        Vue.nextTick().then(() => {
            setTimeout(() => this.initAccounts(), 300);
        });
        Vue.nextTick().then(() => {
            setTimeout(() => this.initOptInAccounts(), 300);
        });
        await this.$store.dispatch('temporary/initialize');
        this.$store.commit('account/resetSelectedAddressesToInteract');
        this.$store.commit('account/resetSelectedAddressesOptInToInteract');
    }

    @Watch('selectedAccounts')
    /**
     * Fetch account balances and map to address
     * @return {void}
     */
    private async initAccounts() {
        if (this.initialized || !this.currentProfile || !this.currentProfile.networkType) {
            return;
        }

        // - generate addresses
        this.addressesList = this.accountService.getAddressesFromMnemonic(
            new MnemonicPassPhrase(this.currentMnemonic),
            this.currentProfile.networkType,
            10,
        );
        const repositoryFactory = this.$store.getters['network/repositoryFactory'] as RepositoryFactory;
        // fetch accounts info
        const accountsInfo = await repositoryFactory.createAccountRepository().getAccountsInfo(this.addressesList).toPromise();
        if (!accountsInfo) {
            return;
        }
        // map balances
        this.addressMosaicMap = {
            ...this.addressMosaicMap,
            ...this.mapBalanceByAddress(accountsInfo, this.networkMosaic),
        };

        this.initialized = true;
    }

    /**
     * Fetch account balances and map to address
     * @return {void}
     */
    @Watch('optInSelectedAccounts')
    private async initOptInAccounts() {
        if (this.optInInitialized || !this.currentProfile || !this.currentProfile.networkType) {
            return;
        }

        // - generate addresses
        const optInAccounts = this.accountService.generateAccountsFromMnemonic(
            new MnemonicPassPhrase(this.currentMnemonic),
            this.currentProfile.networkType,
            10,
            Network.BITCOIN,
        );

        // whitelist opt in accounts
        if (optInAccounts.length === 0) {
            return;
        }
        this.optInAddressesList = optInAccounts.map((account) => account.address);

        // fetch accounts info
        const repositoryFactory = this.$store.getters['network/repositoryFactory'] as RepositoryFactory;
        const accountsInfo = await repositoryFactory.createAccountRepository().getAccountsInfo(this.optInAddressesList).toPromise();
        // map balances
        this.addressMosaicMap = {
            ...this.addressMosaicMap,
            ...this.mapBalanceByAddress(accountsInfo, this.networkMosaic),
        };

        this.optInInitialized = true;
    }

    public mapBalanceByAddress(accountsInfo: AccountInfo[], mosaic: MosaicId): Record<string, number> {
        return accountsInfo
            .map(({ mosaics, address }) => {
                // - check balance
                const hasNetworkMosaic = mosaics.find((mosaicOwned) => mosaicOwned.id.equals(mosaic));

                // - account doesn't hold network mosaic so the balance is zero
                if (hasNetworkMosaic === undefined) {
                    return {
                        address: address.plain(),
                        balance: 0,
                    };
                }
                // - map balance to address
                const balance = hasNetworkMosaic.amount.compact();
                return {
                    address: address.plain(),
                    balance: balance,
                };
            })
            .reduce((acc, { address, balance }) => ({ ...acc, [address]: balance }), {});
    }

    public getCurrentStep(): number {
        switch (this.$route.name) {
            default:
            case 'profiles.importProfile.info':
                return 0;
            case 'profiles.importProfile.importMnemonic':
                return 1;
            case 'profiles.importProfile.walletSelection':
                return 2;
            case 'profiles.importProfile.finalize':
                return 3;
        }
    }

    public getStepClassName(index: number): string {
        return this.getCurrentStep() == index ? 'active' : this.getCurrentStep() > index ? 'done' : '';
    }

    /**
     * Called when clicking on an address to remove it from the selection
     * @protected
     * @param {number} pathNumber
     */
    protected onRemoveAddress(pathNumber: number): void {
        this.$store.commit('account/removeFromSelectedAddressesToInteract', pathNumber);
    }
    /**
     * Called when clicking on an address to remove it from the selection
     * @protected
     * @param {number} pathNumber
     */
    protected onRemoveOptInAddress(pathNumber: number): void {
        this.$store.commit('account/removeFromSelectedAddressesOptInToInteract', pathNumber);
    }
}
