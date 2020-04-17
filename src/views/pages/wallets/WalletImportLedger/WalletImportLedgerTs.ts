import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {NetworkType,SimpleWallet} from "symbol-sdk"
import {SymbolLedger} from '@/core/utils/ledger'
import {formDataConfig} from "@/views/forms/FormDefaults";
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
// internal dependencies
import {WalletsModel,WalletType} from '@/core/database/entities/WalletsModel'
import { AccountsModel } from '@/core/database/entities/AccountsModel'
// import {AppWallet} from '@/core/model/AppWallet'
import {NotificationType} from '@/core/utils/NotificationType'
// import {StoreAccount} from '@/core/model/types'
// import {WalletType} from '@/core/database/entities/WalletsModel'
// import {networkTypeConfig} from '@/config/view/setting'
// import { AppInfo } from '@/core/model/types'
import { Password } from 'symbol-sdk'
import {WalletService} from '@/services/WalletService'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {AccountsRepository} from '@/repositories/AccountsRepository'
// child components
// @ts-ignore
import WalletBackupOptions from '@/components/WalletBackupOptions/WalletBackupOptions.vue'
import { type } from 'os'


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
    app:'app'
  })},
})
export class WalletImportLedgerTs extends Vue {
  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentAccount: AccountsModel
  public currentPassword: Password
  public currentMnemonic: MnemonicPassPhrase
  public walletService: WalletService
  public knownWallets: string[]
  public accounts: AccountsRepository
  public walletsRepository: WalletsRepository
  public accountsRepository: AccountsRepository
  public networkTypeConfig: Array<{
    value: NetworkType,
    label: string
}> = [
        {
            value: NetworkType.MIJIN_TEST,
            label: 'MIJIN_TEST'
        }, {
            value: NetworkType.MAIN_NET,
            label: 'MAIN_NET'
        }, {
            value: NetworkType.TEST_NET,
            label: 'TEST_NET'
        }, {
            value: NetworkType.MIJIN,
            label: 'MIJIN'
        },
    ]
  // activeAccount: StoreAccount
  // app:AppInfo
  public currentWallet: WalletsModel
  NetworkTypeList = this.networkTypeConfig
  ledgerForm = formDataConfig.ledgerImportForm
  name: string | undefined
  address: string | undefined
  publicKey: string | undefined
  networkType: NetworkType | undefined
  active: boolean | undefined
  path: string
  sourceType: Number

  toWalletDetails() {
    this.$Notice.success({
        title: this['$t']('Imported_wallet_successfully') + ''
    })
    this.$router.push('/dashboard')
  }
  deleteAccountAndBack() {
    // - delete the temporary account from storage
    const identifier = this.currentAccount.getIdentifier()
    this.accounts.delete(identifier)
    this.$store.dispatch('account/RESET_STATE')

    // - back to previous page
    this.$router.push({ name: 'accounts.importAccount.info' })
  }
  toBack() {
    // this.deleteAccountAndBack();
    this.$router.push('/accounts/create')
  }
  onNetworkSelected(){
    this.ledgerForm = this.getDefaultFormValues(this.ledgerForm.networkType);
  }
  numExistingLedgerWallets(networkType){
    let num = 0
    const existingWallets = Object.values(this.walletsRepository.collect())
    existingWallets.filter(wallet=>{
      const accountName1 = wallet.values.get('accountName')
      let networkTypeLocal
      for (let i = 0, m = existingWallets.length; i < m; i ++) {
        const accounts = this.accountsRepository.collect()
        const account = accounts[i]
        const accountName2 = account.values.get('accountName')
        if (accountName2==accountName1){
          networkTypeLocal = account.values.get('networkType')
          if ( networkTypeLocal == networkType && wallet.values.get("type")=== WalletType.fromDescriptor('Ledger')){
            num+=1 
          } 
        }    
      }
      return   num
      })
    return num;
  }

  getDefaultFormValues(networkType) {
      const numExistingLedgerWallets = this.numExistingLedgerWallets(networkType);
      const networkName = this.networkTypeConfig.find(network => network.value === networkType).label;

      return {
          networkType: networkType,
          accountIndex: numExistingLedgerWallets,
          walletName: `${networkName} Ledger Account ${numExistingLedgerWallets + 1}`
      }
  }

async importAccountFromLedger() {
  const { accountIndex, networkType, walletName } = this.ledgerForm
  try {
      this.$Notice.success({
        title: this['$t']('Verify information in your device!') + ''
      })
      const transport = await TransportWebUSB.create();
      const symbolLedger = new SymbolLedger(transport, "XYM");
      const accountResult = await symbolLedger.getAccount(`m/44'/43'/${networkType}'/0'/${accountIndex}'`)
      const { address, publicKey, path } = accountResult;
      transport.close()

      this.createFromLedger(
          walletName,
          networkType,
          path,
          publicKey.toUpperCase(),
          address,);
      this.toWalletDetails();

      this.$store.dispatch('SET_UI_DISABLED', {
          isDisabled: false,
          message: ""
      });

  } catch (e) {
      this.$store.dispatch('SET_UI_DISABLED', {
          isDisabled: false,
          message: ""
      });
      this.$Notice.error({
          title: this['$t']('CONDITIONS_OF_USE_NOT_SATISFIED') + ''
      })
  }
}
public mounted() {
  this.walletService = new WalletService(this.$store)
  this.walletsRepository = new WalletsRepository()
  this.accountsRepository = new AccountsRepository()
}
createFromLedger(
  name: string,
  networkType: NetworkType,
  path: string,
  publicKey: string,
  address: string,){
  try {     
      this.name = name
      this.address = address
      this.publicKey = publicKey
      this.networkType = networkType
      this.active = true
      this.path = path
      this.sourceType = WalletType.fromDescriptor('Ledger')
      // add wallet to list
      const accName = Object.values(this.currentAccount)[2];
      const wallet = new WalletsModel(new Map<string, any>([
        [ 'accountName', accName],
        [ 'name', 'Ledger Wallet 1' ],
        [ 'type', this.sourceType ],
        [ 'address', this.address ],
        [ 'publicKey', this.publicKey ],
        [ 'path', this.path ],
        [ 'isMultisig', false ],
      ]))
      // add wallet to account
      const wallets = this.currentAccount.values.get('wallets')
      wallets.push(wallet.getIdentifier())
      
      this.currentAccount.values.set('wallets', wallets)
      // use repository for storage
      this.walletsRepository.create(wallet.values)
      this.accountsRepository.update(
      this.currentAccount.getIdentifier(),
      this.currentAccount.values,
      )
      this.$store.dispatch('account/ADD_WALLET', wallet)
      this.$store.dispatch('wallet/SET_CURRENT_WALLET', {model: wallet})
      this.$store.dispatch('wallet/SET_KNOWN_WALLETS', wallets)
      this.$store.dispatch('temporary/RESET_STATE')
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      return this
    } catch (error) {
        throw new Error(error)
    }
  }
}
