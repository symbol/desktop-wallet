import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { NetworkType } from 'symbol-sdk'
import { SymbolLedger } from '@/core/utils/Ledger'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// internal dependencies
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel'
import { NotificationType } from '@/core/utils/NotificationType'
import { Password } from 'symbol-sdk'
import { AccountService } from '@/services/AccountService'
import { ProfileService } from '@/services/ProfileService'
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage'

// child components
// @ts-ignore

@Component({
  // components: {
  //   WalletBackupOptions,
  // },
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      currentProfile: 'profile/currentProfile',
      currentPassword: 'temporary/password',
      currentMnemonic: 'temporary/mnemonic',
      knownAccounts: 'wallet/knownAccounts',
      generationHash: 'network/generationHash',
      app: 'app',
    }),
  },
})
export class ImportLedgerProfileTs extends Vue {
  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {string}
   */
  public currentProfile: ProfileModel

  /**
   * Currently active network type
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string

  public currentAccount: AccountModel
  public currentPassword: Password
  public currentMnemonic: MnemonicPassPhrase
  public accountService: AccountService
  public profileService: ProfileService
  public knownAccounts: string[]
  public networkTypeList: { value: NetworkType; label: string }[] = [
    { value: NetworkType.MIJIN_TEST, label: 'MIJIN_TEST' },
    { value: NetworkType.MAIN_NET, label: 'MAIN_NET' },
    { value: NetworkType.TEST_NET, label: 'TEST_NET' },
    { value: NetworkType.MIJIN, label: 'MIJIN' },
  ]

  ledgerForm = {
    accountIndex: 0,
    accountName: 'Ledger Account',
  }

  public created() {
    this.accountService = new AccountService()
  }

  toAccountDetails() {
    this.$Notice.success({
      title: this['$t']('Imported Account Successfully') + '',
    })
    this.$router.push('/dashboard')
  }
  toBack() {
    this.$store.dispatch('account/RESET_STATE')
    this.$router.push('/profiles/create')
  }

  numExistingLedgerAccounts(networkType) {
    let num = 0
    const existingAccounts = this.accountService.getAccounts()
    existingAccounts.filter((wallet) => {
      const accountName1 = wallet.profileName
      let networkTypeLocal
      for (let i = 0, m = existingAccounts.length; i < m; i++) {
        const accounts = this.profileService.getProfiles()
        const account = accounts[i]
        const accountName2 = account.profileName
        if (accountName2 == accountName1) {
          networkTypeLocal = account.networkType
          if (networkTypeLocal == networkType && wallet.type === AccountType.fromDescriptor('Ledger')) {
            num += 1
          }
        }
      }
      return num
    })
    return num
  }

  public onSubmit() {
    this.importAccountFromLedger()
      .then((res) => {
        // - use repositories for storage

        this.accountService.saveAccount(res)
        // - update app state
        this.$store.dispatch('profile/ADD_ACCOUNT', res)
        this.$store.dispatch('account/SET_CURRENT_ACCOUNT', res)
        this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', [res.id])
        this.$store.dispatch('temporary/RESET_STATE')
        this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
        this.toAccountDetails()
      })
      .catch((error) => {
        {
          console.error(error)
        }
      })
  }
  async importAccountFromLedger(): Promise<AccountModel> {
    const { accountIndex, accountName } = this.ledgerForm
    const networkType = this.$store.getters['network/networkType']
    try {
      this.$Notice.success({
        title: this['$t']('Verify information in your device!') + '',
      })
      const transport = await TransportWebUSB.create()
      const symbolLedger = new SymbolLedger(transport, 'XYM')
      const accountResult = await symbolLedger.getAccount(`m/44'/4343'/${networkType}'/0'/${accountIndex}'`)
      const { address, publicKey, path } = accountResult
      transport.close()

      // add account to list
      const accName = this.currentProfile.profileName

      return {
        id: SimpleObjectStorage.generateIdentifier(),
        name: accountName,
        profileName: accName,
        node: '',
        type: AccountType.fromDescriptor('Ledger'),
        address: address.toUpperCase(),
        publicKey: publicKey.toUpperCase(),
        encryptedPrivateKey: '',
        path: path,
        isMultisig: false,
      }
    } catch (e) {
      this.$Notice.error({
        title: this['$t']('CONDITIONS OF USE NOT SATISFIED') + '',
      })
    }
  }
}
