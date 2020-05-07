import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {NetworkType} from 'symbol-sdk'
import {SymbolLedger} from '@/core/utils/Ledger'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
// internal dependencies
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel'
import {NotificationType} from '@/core/utils/NotificationType'
import { Password } from 'symbol-sdk'
import {AccountService} from '@/services/AccountService'
import {ProfileService} from '@/services/ProfileService'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'

// child components
// @ts-ignore

@Component({
  // components: {
  //   WalletBackupOptions,
  // },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
    currentProfile: 'profile/currentProfile',
    currentPassword: 'temporary/password',
    currentMnemonic: 'temporary/mnemonic',
    knownAccounts: 'wallet/knownAccounts',
    generationHash: 'network/generationHash',
    // activeAccount:'account',
    app:'app',
  })},
})
export class WalletImportLedgerTs extends Vue {
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

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentAccount: AccountModel
  public currentPassword: Password
  public currentMnemonic: MnemonicPassPhrase
  public accountService: AccountService
  public profileService: ProfileService
  public knownAccounts: string[]
  public networkTypeList: {value: NetworkType, label: string}[] = [
    {value: NetworkType.MIJIN_TEST, label: 'MIJIN_TEST'},
    {value: NetworkType.MAIN_NET, label: 'MAIN_NET'},
    {value: NetworkType.TEST_NET, label: 'TEST_NET'},
    {value: NetworkType.MIJIN, label: 'MIJIN'},
  ]

  ledgerForm = {
    networkType: NetworkType.TEST_NET,
    accountIndex: 0,
    walletName: 'Ledger Wallet',
  }

  public created() {
    this.accountService = new AccountService()
  }

  toAccountDetails() {
    this.$Notice.success({
      title: this['$t']('Imported_wallet_successfully') + '',
    })
    this.$router.push('/dashboard')
  }
  toBack() {
    // this.deleteAccountAndBack();
    this.$store.dispatch('account/RESET_STATE')
    this.$router.push('/accounts/create')
  }
  onNetworkSelected(){
    this.ledgerForm = this.getDefaultFormValues(this.ledgerForm.networkType)
  }
  numExistingLedgerAccounts(networkType){
    let num = 0
    const existingWallets = this.accountService.getAccounts()
    existingWallets.filter(wallet=>{
      const accountName1 = wallet.profileName
      let networkTypeLocal
      for (let i = 0, m = existingWallets.length; i < m; i ++) {
        const accounts = this.profileService.getProfiles()
        const account = accounts[i]
        const accountName2 = account.profileName
        if (accountName2 == accountName1){
          networkTypeLocal = account.networkType
          if ( networkTypeLocal == networkType && wallet.type === AccountType.fromDescriptor('Ledger')){
            num += 1 
          } 
        }    
      }
      return num
    })
    return num
  }

  getDefaultFormValues(networkType) {
    const numExistingLedgerAccounts = this.numExistingLedgerAccounts(networkType)
    const networkName = this.networkTypeList.find(network => network.value === networkType).label

    return {
      networkType: networkType,
      accountIndex: numExistingLedgerAccounts,
      walletName: `${networkName} Ledger Account ${numExistingLedgerAccounts + 1}`,
    }
  }

  public onSubmit(){
    this.importAccountFromLedger().then(
      (res)=>{
        // - use repositories for storage
        this.accountService.saveAccount(res)
        // - update app state
        this.$store.dispatch('profile/ADD_ACCOUNT', res)
        this.$store.dispatch('account/SET_CURRENT_ACCOUNT', res)
        this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', [res.id])
        this.$store.dispatch('temporary/RESET_STATE')
        this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
        this.toAccountDetails()
        // this.$store.dispatch('SET_UI_DISABLED', {
        //   isDisabled: false,
        //   message: '',
        // })
      },
    ).catch((error)=>{
      {
        console.error(error);
      }
    })
  }
  async importAccountFromLedger(): Promise<AccountModel> {
    const { accountIndex, networkType, walletName } = this.ledgerForm
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
        name: walletName,
        profileName:accName,
        node: '',
        type:  AccountType.fromDescriptor('Ledger'),
        address:address.toUpperCase(),
        publicKey: publicKey.toUpperCase(),
        encryptedPrivateKey:'',
        path: path,
        isMultisig: false,
      }
    } catch (e) {
      this.$store.dispatch('SET_UI_DISABLED', {
        isDisabled: false,
        message: '',
      })
      this.$Notice.error({
        title: this['$t']('CONDITIONS_OF_USE_NOT_SATISFIED') + '',
      })
    }
  }
}
