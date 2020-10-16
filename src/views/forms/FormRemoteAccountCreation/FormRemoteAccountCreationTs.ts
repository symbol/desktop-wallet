// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { Password, Account, RepositoryFactory, Crypto } from 'symbol-sdk';
import { mapGetters } from 'vuex';

// internal dependencies
import { RemoteAccountService } from '@/services/RemoteAccountService';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { ProfileModel } from '@/core/database/entities/ProfileModel';

// child components
// @ts-ignore
import FormProfileUnlock from '@/views/forms/FormProfileUnlock/FormProfileUnlock.vue';
// @ts-ignore
import AccountAddressDisplay from '@/components/AccountAddressDisplay/AccountAddressDisplay.vue';
// @ts-ignore
import AccountPublicKeyDisplay from '@/components/AccountPublicKeyDisplay/AccountPublicKeyDisplay.vue';
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue';

@Component({
    components: {
        FormProfileUnlock,
        AccountAddressDisplay,
        AccountPublicKeyDisplay,
        ProtectedPrivateKeyDisplay,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            currentProfile: 'profile/currentProfile',
            repositoryFactory: 'network/repositoryFactory',
        }),
    },
})
export class FormRemoteAccountCreationTs extends Vue {
    /**
     * Remote account to be created
     */
    protected remoteAccount: Account = null;
    /**
     * Currently selected account
     */
    private currentAccount: AccountModel;
    /**
     * Current profile
     */
    private currentProfile: ProfileModel;
    /**
     * Repository factory
     */
    private repositoryFactory: RepositoryFactory;

    /**
     * Hook called when child component FormProfileUnlock emits
     * the 'success' event.
     * @param {Password} password
     * @return {void}
     */
    public async onAccountUnlocked({ password, account }): Promise<void> {
        this.$store.dispatch('diagnostic/ADD_INFO', `Account ${account.address.plain()} unlocked successfully.`);

        if (this.currentAccount.encRemoteAccountPrivateKey) {
            // the current account already has a remote account
            this.createRemoteAccountFromEncPrivateKey(password);
        } else {
            // a new remote account has to be created
            await this.createRemoteAccount(password);
            this.persistRemoteAccount(password);
        }

        this.$emit('setRemoteAccount', this.remoteAccount);
        this.$emit('toggleNext', true);
    }

    /**
     * Decrypts an existing encrypted remote account private key from the current account
     * @private
     * @param {Password} password
     */
    private createRemoteAccountFromEncPrivateKey(password: Password): void {
        const remoteAccountPrivateKey = Crypto.decrypt(this.currentAccount.encRemoteAccountPrivateKey, password.value);
        this.remoteAccount = Account.createFromPrivateKey(remoteAccountPrivateKey, this.currentProfile.networkType);
    }
    /**
     * Creates a remote account
     * @private
     * @param {Password} password
     * @returns {Promise<void>}
     */
    private async createRemoteAccount(password: Password): Promise<void> {
        this.remoteAccount = await new RemoteAccountService(
            this.currentAccount,
            this.currentProfile,
            this.repositoryFactory.createAccountRepository(),
        ).getAvailableRemoteAccount(password);
    }

    /**
     * Perists the remote account in the current account object
     * @private
     * @param {Password} password
     */
    private persistRemoteAccount(password: Password): void {
        const encRemoteAccountPrivateKey = Crypto.encrypt(this.remoteAccount.privateKey, password.value);
        this.$store.dispatch('account/UPDATE_CURRENT_ACCOUNT_REMOTE_ACCOUNT', encRemoteAccountPrivateKey);
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
     * Hook called when the component is mounted
     */
    public created() {
        this.$emit('toggleNext', false);
    }
}
