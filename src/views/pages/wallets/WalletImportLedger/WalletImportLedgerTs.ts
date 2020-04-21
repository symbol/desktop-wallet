import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {NetworkType} from 'symbol-sdk'
import {SymbolLedger} from '@/core/utils/Ledger'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
// internal dependencies
import {WalletModel,WalletType} from '@/core/database/entities/WalletModel'
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { AccountModel } from '@/core/database/entities/AccountModel'
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
    currentWallet: 'wallet/currentWallet',
    currentAccount: 'account/currentAccount',
    currentPassword: 'temporary/password',
    currentMnemonic: 'temporary/mnemonic',
    knownWallets: 'wallet/knownWallets',
    // activeAccount:'account',
    app:'app',
  })},
})
export class WalletImportLedgerTs extends Vue {
  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentAccount: ProfileModel
  public currentPassword: Password
  public currentMnemonic: MnemonicPassPhrase
  public walletService: AccountService
  public accountService: ProfileService
  public knownWallets: string[]
  public networkTypeList: {value: NetworkType, label: string}[] = [
    {value: NetworkType.MIJIN_TEST, label: 'MIJIN_TEST'},
    {value: NetworkType.MAIN_NET, label: 'MAIN_NET'},
    {value: NetworkType.TEST_NET, label: 'TEST_NET'},
    {value: NetworkType.MIJIN, label: 'MIJIN'},
  ]
  // activeAccount: StoreAccount
  // app:AppInfo
  public currentWallet: WalletModel

  ledgerForm = {
    networkType: NetworkType.TEST_NET,
    accountIndex: 0,
    walletName: 'Ledger Wallet',
  }

  public created() {
    this.walletService = new AccountService()
  }

  toWalletDetails() {
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
  numExistingLedgerWallets(networkType){
    let num = 0
    const existingWallets = this.walletService.getAccounts()
    existingWallets.filter(wallet=>{
      const accountName1 = wallet.profileName
      let networkTypeLocal
      for (let i = 0, m = existingWallets.length; i < m; i ++) {
        const accounts = this.accountService.getProfiles()
        const account = accounts[i]
        const accountName2 = account.profileName
        if (accountName2 == accountName1){
          networkTypeLocal = account.networkType
          if ( networkTypeLocal == networkType && wallet.type === WalletType.fromDescriptor('Ledger')){
            num += 1 
          } 
        }    
      }
      return num
    })
    return num
  }

  getDefaultFormValues(networkType) {
    const numExistingLedgerWallets = this.numExistingLedgerWallets(networkType)
    const networkName = this.networkTypeList.find(network => network.value === networkType).label

    return {
      networkType: networkType,
      accountIndex: numExistingLedgerWallets,
      walletName: `${networkName} Ledger Account ${numExistingLedgerWallets + 1}`,
    }
  }

  public onSubmit(){
    this.importAccountFromLedger().then(
      (res)=>{
        // - use repositories for storage
        this.walletService.saveAccount(res)

        // - update app state
        this.$store.dispatch('account/ADD_WALLET', res)
        this.$store.dispatch('wallet/SET_CURRENT_WALLET', res)
        this.$store.dispatch('wallet/SET_KNOWN_WALLETS', this.currentAccount.accounts)
        this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
        this.toWalletDetails()
        this.$store.dispatch('SET_UI_DISABLED', {
          isDisabled: false,
          message: '',
        })
      },
    )
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

      // add wallet to list
      
      const accName = this.currentAccount.profileName

      return {
        id: SimpleObjectStorage.generateIdentifier(),
        name: walletName,
        profileName:accName,
        node: '',
        type:  WalletType.fromDescriptor('Ledger'),
        address:address,
        publicKey: publicKey,
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
