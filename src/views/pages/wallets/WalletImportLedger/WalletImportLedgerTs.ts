import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {NetworkType,SimpleWallet} from "symbol-sdk"
import {SymbolLedger} from '@/core/utils/Ledger'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
// internal dependencies
import {WalletModel,WalletType} from '@/core/database/entities/WalletModel'
import { AccountModel } from '@/core/database/entities/AccountModel'
import {NotificationType} from '@/core/utils/NotificationType'
import { Password } from 'symbol-sdk'
import {WalletService} from '@/services/WalletService'
import {AccountService} from '@/services/AccountService'
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
  public currentAccount: AccountModel
  public currentPassword: Password
  public currentMnemonic: MnemonicPassPhrase
  public walletService: WalletService
  public accountService: AccountService
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


  toWalletDetails() {
    this.$Notice.success({
      title: this['$t']('Imported_wallet_successfully') + '',
    })
    this.$router.push('/dashboard')
  }
  // deleteAccountAndBack() {
  //   // - delete the temporary account from storage
  //   const identifier = this.currentAccount.
  //   this.accounts.delete(identifier)
  //   this.$store.dispatch('account/RESET_STATE')

  //   // - back to previous page
  //   this.$router.push({ name: 'accounts.importAccount.info' })
  // }
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
    const existingWallets = this.walletService.getWallets()
    existingWallets.filter(wallet=>{
      const accountName1 = wallet.accountName
      let networkTypeLocal
      for (let i = 0, m = existingWallets.length; i < m; i ++) {
        const accounts = this.accountService.getAccounts()
        const account = accounts[i]
        const accountName2 = account.accountName
        if (accountName2 == accountName1){
          networkTypeLocal = account.networkType
          if ( networkTypeLocal == networkType && wallet.type === WalletType.fromDescriptor('Ledger')){
            num+=1 
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
      this.walletService.saveWallet(res)

      // - update app state
      this.$store.dispatch('account/ADD_WALLET', res)
      this.$store.dispatch('wallet/SET_CURRENT_WALLET', res)
      this.$store.dispatch('wallet/SET_KNOWN_WALLETS', this.currentAccount.wallets)
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.toWalletDetails()
      this.$store.dispatch('SET_UI_DISABLED', {
        isDisabled: false,
        message: '',
      })
      }
    )
  }
  async importAccountFromLedger() {
    const { accountIndex, networkType, walletName } = this.ledgerForm
    try {
      this.$Notice.success({
        title: this['$t']('Verify information in your device!') + '',
      })
      const transport = await TransportWebUSB.create()
      const symbolLedger = new SymbolLedger(transport, 'XYM')
      const accountResult = await symbolLedger.getAccount(`m/44'/43'/${networkType}'/0'/${accountIndex}'`)
      const { address, publicKey, path } = accountResult
      transport.close()

      // add wallet to list
      const accName = Object.values(this.currentAccount)[2]
      return {
        id: SimpleObjectStorage.generateIdentifier(),
        accountName:accName,
        name:"Ledger Wallet",
        node: '',
        type:  WalletType.fromDescriptor('Ledger'),
        address:address,
        publicKey: publicKey,
        encPrivate: '',
        encIv: '',
        path: path,
        isMultisig: false
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

  createFromLedger(
    name: string,
    networkType: NetworkType,
    path: string,
    publicKey: string,
    address: string){
    try {     
      
      // add wallet to list
      const accName = Object.values(this.currentAccount)[2]
      return {
        accountName:accName,
        name:"Ledger Wallet",
        type:  WalletType.fromDescriptor('Ledger'),
        address:address,
        publicKey: publicKey,
        path: path,
        isMultisig: false
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
