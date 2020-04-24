/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {NetworkType, Password} from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {SymbolLedger} from '@/core/utils/Ledger'
import {formDataConfig} from '@/views/forms/FormDefaults'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {DerivationService} from '@/services/DerivationService'
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {NotificationType} from '@/core/utils/NotificationType'
import {WalletService} from '@/services/WalletService'
import {WalletsModel,WalletType} from '@/core/database/entities/WalletsModel'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'

// configuration
import appConfig from '@/../config/app.conf.json'
const {MAX_SEED_WALLETS_NUMBER} = appConfig.constants

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
    ModalFormAccountUnlock,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
    knownWallets: 'wallet/knownWallets',
    currentWallets: 'wallet/currentWallets',
    currentWallet: 'wallet/currentWallet',
  })},
})
export class FormSubWalletCreationTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  public hasSubAccount: boolean
  /**
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: string[]

  /**
   * current wallets identifiers
   * @var {string[]}
   */
  public currentWallets: string[]

  /**
   * Currently active network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public wallets: WalletService

  /**
   * Derivation paths service
   * @var {DerivationService}
   */
  public paths: DerivationService

  /**
   * Accounts repository
   * @var {AccountsRepository}
   */
  public accountsRepository: AccountsRepository

  /**
   * Wallets repository
   * @var {WalletsRepository}
   */
  public walletsRepository: WalletsRepository

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Whether account is currently being unlocked
   * @var {boolean}
   */
  public isUnlockingAccount: boolean = false

  /**
   * Current unlocked password
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Form fields
   * @var {Object}
   */
  public formItems = {
    type: 'child_wallet',
    privateKey: '',
    name: '',
  }

  /**
   * Type the ValidationObserver refs 
   * @type {{
    *     observer: InstanceType<typeof ValidationObserver>
    *   }}
    */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }
 
  public created() {
    this.wallets = new WalletService(this.$store)
    this.paths = new DerivationService(this.$store)
    this.accountsRepository = new AccountsRepository()
    this.walletsRepository = new WalletsRepository()
  }

  /// region computed properties getter/setter
  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }

  public get knownPaths(): string[] {
    if (!this.knownWallets || !this.knownWallets.length) {
      return []
    }

    // filter wallets to only known wallet names
    const knownWallets = this.wallets.getWallets(
      (e) => this.knownWallets.includes(e.getIdentifier()),
    )
  
    return [...knownWallets].map(
      ({identifier, values}) => ({
        identifier,
        path: values.get('path'),
      }),
    ).filter(
      w => w.path && w.path.length,
    ).map(w => w.path)
  }
  /// end-region computed properties getter/setter

  /**
   * Submit action asks for account unlock
   * @return {void}
   */
  public currentWallet: WalletsModel

  public get isLedger():boolean{
    return this.currentWallet.values.get('type') == WalletType.fromDescriptor('Ledger')
  }

  public onSubmit() {
    const values = {...this.formItems}
    const type = values.type && [ 'child_wallet', 'privatekey_wallet' ].includes(values.type)
      ? values.type
      : 'child_wallet'
    if (this.isLedger && type == 'child_wallet'){
      this.deriveNextChildWallet(values.name)
    } 
    else this.hasAccountUnlockModal = true

  }

  /**
   * When account is unlocked, the sub wallet can be created
   */
  
  public async onAccountUnlocked(account: Account, password: Password) { 
    this.currentPassword = password

    // - interpret form items
    const values = {...this.formItems}
    const type = values.type && [ 'child_wallet', 'privatekey_wallet' ].includes(values.type)
      ? values.type
      : 'child_wallet'

    try {
      // - create sub wallet (can be either derived or by private key)
      let subWallet: WalletsModel
      switch(type) {
        default:
        case 'child_wallet':
          subWallet = this.deriveNextChildWallet(values.name)
          break

        case 'privatekey_wallet':
          subWallet = this.wallets.getSubWalletByPrivateKey(
            this.currentAccount,
            this.currentPassword,
            this.formItems.name,
            this.formItems.privateKey,
            this.networkType,
          )
          break
      }

      // - return if subWallet is undefined
      if (!subWallet) return

      // Verify that the import is repeated
      const hasAddressInfo = this.currentWallets.find(w => w['address'] === subWallet.values.get('address'))
      if (hasAddressInfo !== undefined){
        this.$store.dispatch('notification/ADD_ERROR', `This private key already exists. The account name is ${hasAddressInfo['name']}`)
        return null
      }

      // - remove password before GC
      this.currentPassword = null
      this.walletService.addWalletToAccount(this.currentAccount,subWallet);
    }
    catch (e) {
      this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.')
      console.error(e)
    }
  }

  /**
   * Use HD wallet derivation to get next child wallet
   * @param {string} childWalletName 
   * @return {WalletsModel}
   */
  private deriveNextChildWallet(childWalletName: string): WalletsModel | null {
    // - don't allow creating more than 10 wallets
    if (this.knownPaths.length >= MAX_SEED_WALLETS_NUMBER) { 
      this.$store.dispatch(
        'notification/ADD_ERROR',
        this.$t(NotificationType.TOO_MANY_SEED_WALLETS_ERROR, {maxSeedWalletsNumber: MAX_SEED_WALLETS_NUMBER}),
      )
      return null
    }
    if(this.isLedger){
      this.importSubAccountFromLedger(childWalletName).then(
        (res)=>{
          this.walletService.addWalletToAccount(this.currentAccount,res);
        }
      ).catch(
        (err)=> console.log(err)
      );
    } else {
      // - get next path
      const nextPath = this.paths.getNextAccountPath(this.knownPaths)

      this.$store.dispatch('diagnostic/ADD_DEBUG', `Adding child wallet with derivation path: ${nextPath}`)

      // - decrypt mnemonic
      const encSeed = this.currentAccount.values.get('seed')
      const passphrase = AESEncryptionService.decrypt(encSeed, this.currentPassword)
      const mnemonic = new MnemonicPassPhrase(passphrase)

      // create account by mnemonic
      const wallet = this.wallets.getChildWalletByPath(
        this.currentAccount,
        this.currentPassword,
        mnemonic,
        nextPath,
        this.networkType,
        childWalletName,
      )
      return wallet
    }   
  }

  async importSubAccountFromLedger(childWalletName: string):Promise<WalletsModel> |null{
    const subWalletName = childWalletName
    const accountPath = this.currentWallet.values.get('path')
    const currentAccountIndex = accountPath.substring(accountPath.length - 2,accountPath.length - 1)
    const numAccount = this.knownPaths.length
    let accountIndex
    if(numAccount <= Number(currentAccountIndex) ){
      accountIndex = numAccount + Number(currentAccountIndex)
    } else {
      accountIndex = numAccount + 1
    }
    this.$Notice.success({
      title: this['$t']('Verify information in your device!') + '',
    })
    const transport = await TransportWebUSB.create()
    const symbolLedger = new SymbolLedger(transport, 'XYM')
    const accountResult = await symbolLedger.getAccount(`m/44'/4343'/${this.networkType}'/0'/${accountIndex}'`)
    const { address, publicKey, path } = accountResult
    transport.close()

    const accName = Object.values(this.currentAccount)[2]
    
    const wallet = new WalletsModel(new Map<string, any>([
      [ 'accountName', accName ],
      [ 'name', subWalletName ],
      [ 'type', WalletType.fromDescriptor('Ledger') ],
      [ 'address', address ],
      [ 'publicKey', publicKey.toUpperCase() ],
      [ 'encPrivate', '' ],
      [ 'encIv', '' ],
      [ 'path', path ],
      [ 'isMultisig', false ],
    ]))
    return wallet
  }

  public walletService: WalletService
  public mounted() {
    this.walletService = new WalletService(this.$store)
    this.walletsRepository = new WalletsRepository()
    this.accountsRepository = new AccountsRepository()
  }
}
