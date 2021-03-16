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
import { AccountInfo, Address, MosaicId, PublicAccount, NetworkType, RepositoryFactory } from 'symbol-sdk';
import { Network } from 'symbol-hd-wallets';
// internal dependencies
import { DerivationService } from '@/services/DerivationService';
import { AccountService } from '@/services/AccountService';
import { NotificationType } from '@/core/utils/NotificationType';
import { Formatters } from '@/core/utils/Formatters';
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { ProfileService } from '@/services/ProfileService';
import _ from 'lodash';

@Component({
    computed: {
        ...mapGetters({
            networkType: 'network/networkType',
            networkMosaic: 'mosaic/networkMosaic',
            networkCurrency: 'mosaic/networkCurrency',
            currentProfile: 'profile/currentProfile',
            addressesList: 'account/addressesList',
            optInAddressesList: 'account/optInAddressesList',
            selectedAccounts: 'account/selectedAddressesToInteract',
            selectedOptInAccounts: 'account/selectedAddressesOptInToInteract',
        }),
    },
    components: { MosaicAmountDisplay },
})
export default class AccountSelectionTs extends Vue {
    /**
     * Form is being submitted
     */
    protected isLoading: boolean = false;

    /**
     * Formatting helpers
     * @protected
     */
    protected formatters = Formatters;

    /**
     * Network's currency mosaic id
     * @see {Store.networkType}
     * @var {NetworkType}
     */
    public networkType: NetworkType;

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
     * Derivation Service
     * @var {DerivationService}
     */
    public derivation: DerivationService;

    /**
     * Account Service
     * @var {AccountService}
     */
    public accountService: AccountService;

    /**
     * Profile service
     * @var {ProfileService}
     */
    public profileService: ProfileService = new ProfileService();

    /**
     * Balances map
     * @var {any}
     */
    public addressBalanceMap: { [address: string]: number } = {};

    /**
     * Balances map
     * @var {any}
     */
    public optInAddressBalanceMap: { [address: string]: number } = {};

    /**
     * Map of selected accounts
     * @var {number[]}
     */
    public selectedAccounts: number[];

    /**
     * Map of selected opt in accounts
     * @var {number[]}
     */
    public selectedOptInAccounts: number[];

    /**
     * List of addresses
     * @var {Address[]}
     */
    public addressesList: Address[];

    /**
     * List of opt in addresses
     * @var {Address[]}
     */
    public optInAddressesList: { address: Address; index: number }[];

    public networkCurrency: NetworkCurrencyModel;

    /**
     * Hook called when the page is mounted
     * @return {void}
     */
    async mounted() {
        this.derivation = new DerivationService(this.currentProfile.networkType);
        this.accountService = new AccountService();
        await this.$store.dispatch('temporary/initialize');
        this.$store.commit('account/resetAddressesList');
        this.$store.commit('account/resetOptInAddressesList');
        this.$store.commit('account/resetSelectedAddressesToInteract');
        this.$store.commit('account/resetSelectedAddressesOptInToInteract');

        Vue.nextTick().then(() => {
            setTimeout(async () => {
                this.isLoading = true;
                await this.initAccounts();
                await this.initOptInAccounts();
                this.isLoading = false;
            }, 200);
        });
    }

    public previous() {
        this.$router.push({ name: 'profiles.accessLedger.info' });
    }

    /**
     * Error notification handler
     */
    private errorNotificationHandler(error: any) {
        if (error.message && error.message.includes('cannot open device with path')) {
            error.errorCode = 'ledger_connected_other_app';
        }
        if (error.message && error.message.includes('A transfer error')) {
            return;
        }
        if (error.errorCode) {
            switch (error.errorCode) {
                case 'NoDevice':
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_no_device');
                    return;
                case 'ledger_not_supported_app':
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_not_supported_app');
                    return;
                case 'ledger_connected_other_app':
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_connected_other_app');
                    return;
                case 26628:
                    this.$store.dispatch('notification/ADD_ERROR', 'ledger_device_locked');
                    return;
                case 26368:
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
     * Finalize the account selection process by adding
     * the selected accounts to storage.
     * @return {void}
     */
    public async submit() {
        // cannot submit without selecting at least one account
        if (!this.selectedAccounts.length) {
            return this.$store.dispatch('notification/ADD_ERROR', NotificationType.IMPORT_EMPTY_ACCOUNT_LIST);
        }
        return this.$router.push({ name: 'profiles.accessLedger.finalize' });
    }

    /**
     * Fetch account balances and map to address
     * @return {void}
     */
    private async initAccounts() {
        try {
            // - generate addresses
            const addressesList = await this.accountService.getLedgerAccounts(this.currentProfile.networkType, 10);
            this.$store.commit('account/addressesList', addressesList);

            // fetch accounts info
            const repositoryFactory = this.$store.getters['network/repositoryFactory'] as RepositoryFactory;
            if (repositoryFactory) {
                const accountsInfo = await repositoryFactory.createAccountRepository().getAccountsInfo(this.addressesList).toPromise();
                // map balances
                this.addressBalanceMap = {
                    ...this.addressBalanceMap,
                    ...this.mapBalanceByAddress(accountsInfo, this.networkMosaic, this.addressesList),
                };
            } else {
                this.$store.dispatch('notification/ADD_ERROR', 'symbol_node_cannot_connect');
                return;
            }
        } catch (error) {
            this.errorNotificationHandler(error);
        }
    }

    /**
     * Fetch account balances and map to address
     * @return {void}
     */
    private async initOptInAccounts() {
        try {
            // - generate addresses
            const possibleOptInAccounts: any[] = await this.accountService.getLedgerPublicKey(
                this.currentProfile.networkType,
                10,
                Network.BITCOIN,
            );

            // whitelist opt in accounts
            const key = this.currentProfile.networkType === NetworkType.MAIN_NET ? 'mainnet' : 'testnet';
            const whitelisted = process.env.KEYS_WHITELIST[key];
            const optInAccounts = possibleOptInAccounts
                .map((publicKey, index) => ({
                    publicKey: publicKey.toUpperCase(),
                    index: index,
                }))
                .filter((account) => whitelisted.indexOf(account.publicKey) >= 0);
            if (optInAccounts.length === 0) {
                return;
            }
            const optInAddressesList = optInAccounts.map((account) => ({
                address: PublicAccount.createFromPublicKey(account.publicKey, this.currentProfile.networkType).address,
                index: account.index,
            }));
            this.$store.commit('account/optInAddressesList', optInAddressesList);

            const optInAddresses = this.optInAddressesList.map((account) => account.address);

            // fetch accounts info
            const repositoryFactory = this.$store.getters['network/repositoryFactory'] as RepositoryFactory;
            if (repositoryFactory) {
                const accountsInfo = await repositoryFactory.createAccountRepository().getAccountsInfo(optInAddresses).toPromise();
                // map balances
                this.optInAddressBalanceMap = {
                    ...this.optInAddressBalanceMap,
                    ...this.mapBalanceByAddress(accountsInfo, this.networkMosaic, optInAddresses),
                };
            } else {
                this.$store.dispatch('notification/ADD_ERROR', 'symbol_node_cannot_connect');
                return;
            }
        } catch (error) {
            this.errorNotificationHandler(error);
        }
    }

    public mapBalanceByAddress(accountsInfo: AccountInfo[], mosaicId: MosaicId, addressList: Address[]): { [address: string]: number } {
        const addressToAccountInfo = _.keyBy(accountsInfo, (a) => a.address.plain());
        return _.chain(addressList)
            .keyBy((a) => a.plain())
            .mapValues((a) => addressToAccountInfo[a.plain()]?.mosaics.find((m) => m.id.equals(mosaicId))?.amount.compact() ?? 0)
            .value();
    }

    /**
     * Called when clicking on an address to add it to the selection
     * @param {number} pathNumber
     */
    protected onAddAddress(pathNumber: number): void {
        this.$store.commit('account/addToSelectedAddressesToInteract', pathNumber);
    }
    /**
     * Called when clicking on an address to add it to the selection optin
     * @param {number} pathNumber
     */
    protected onAddAddressOptIn(pathNumber: number): void {
        this.$store.commit('account/addToSelectedAddressesOptInToInteract', pathNumber);
    }
}
