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
import {MosaicId, Mosaic,Deadline,UInt64,AggregateTransaction,RepositoryFactoryHttp,SignedTransaction,LockFundsTransaction, MultisigAccountInfo, NetworkType, PublicAccount, Transaction} from 'symbol-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {SymbolLedger} from '@/core/utils/Ledger'
// internal dependencies
import {WalletModel,WalletType} from '@/core/database/entities/WalletModel'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {TransactionService} from '@/services/TransactionService'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'
import {ValidationObserver} from 'vee-validate'
import {Signer} from '@/store/Wallet'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'
@Component({
  computed: {
    ...mapGetters({
      generationHash: 'network/generationHash',
      networkType: 'network/networkType',
      defaultFee: 'app/defaultFee',
      currentWallet: 'wallet/currentWallet',
      selectedSigner: 'wallet/currentSigner',
      currentSignerMultisigInfo: 'wallet/currentSignerMultisigInfo',
      currentWalletMultisigInfo: 'wallet/currentWalletMultisigInfo',
      isCosignatoryMode: 'wallet/isCosignatoryMode',
      stagedTransactions: 'wallet/stagedTransactions',
      networkMosaic: 'mosaic/networkMosaic',
      networkCurrency: 'mosaic/networkCurrency',
      signers: 'wallet/signers',
      signedTransactions: 'wallet/signedTransactions',
      mosaicsInfo: 'mosaic/mosaicsInfoList',
      mosaicsInfoByHex: 'mosaic/mosaicsInfo',
      mosaicsNames: 'mosaic/mosaicsNames',
      namespacesNames: 'namespace/namespacesNames',
  
      currentPeer: 'network/currentPeer',
      currentAccount: 'account/currentAccount',
    }),
  },
})
export class FormTransactionBase extends Vue {
/// region store getters
  /**
   * Network generation hash
   */
  public generationHash: string

  /**
   * Network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Default fee setting
   */
  public defaultFee: number

  /**
   * Currently active wallet
   */
  public currentWallet: WalletModel

  /**
   * Currently active signer
   */
  public selectedSigner: Signer

  /**
   * Current wallet multisig info
   * @type {MultisigAccountInfo}
   */
  public currentWalletMultisigInfo: MultisigAccountInfo

  /**
   * Current signer multisig info
   * @var {MultisigAccountInfo}
   */
  public currentSignerMultisigInfo: MultisigAccountInfo

  /**
   * Whether the form is in cosignatory mode (cosigner selected)
   * @var {boolean}
   */
  public isCosignatoryMode: boolean

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Currently staged transactions
   * @var {Transaction[]}
   */
  public stagedTransactions: Transaction[]

  /**
   * Public key of the current signer
   * @var {any}
   */
  public currentSigner: PublicAccount

  public signers: Signer[]

  public networkCurrency: NetworkCurrencyModel

  /**
   * Type the ValidationObserver refs
   * @type {{
   *     observer: InstanceType<typeof ValidationObserver>
   *   }}
   */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  /// end-region store getters

  /// region property watches
  @Watch('currentWallet')
  onCurrentWalletChange() {
    this.resetForm() // @TODO: probably not the best way
    this.resetFormValidation()
  }

  /// end-region property watches

  /**
   * Whether the form is currently awaiting a signature
   * @var {boolean}
   */
  public isAwaitingSignature: boolean = false

  /**
   * Transaction factory
   * @var {TransactionFactory}
   */
  public factory: TransactionFactory

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async created() {
    this.factory = new TransactionFactory(this.$store)
    this.resetForm()
  }

  /**
   * Hook called when the component is being destroyed (before)
   * @return {void}
   */
  public beforeDestroy() {
    // reset the selected signer if it is not the current wallet
    if (this.selectedSigner.publicKey !== this.currentWallet.publicKey) {
      this.$store.dispatch('wallet/SET_CURRENT_SIGNER', {publicKey: this.currentWallet.publicKey})
    }
  }

  /**
   * Current signer's multisig accounts
   * @readonly
   * @type {{publicKey: string, label: string}[]}
   */
  get multisigAccounts(): Signer[] {
    const signers = this.signers
    // if "self" is multisig, also return self
    if (this.currentWalletMultisigInfo && this.currentWalletMultisigInfo.isMultisig()) {
      return signers
    }

    // all signers except current wallet
    return [...signers].splice(1)
  }

  get hasConfirmationModal(): boolean {
    return this.isAwaitingSignature
  }

  set hasConfirmationModal(f: boolean) {
    this.isAwaitingSignature = f
  }

  /// end-region computed properties getter/setter

  /**
   * Reset the form with properties
   * @throws {Error} If not overloaded in derivate component
   */
  protected resetForm() {
    throw new Error('Method \'resetForm()\' must be overloaded in derivate components.')
  }

  /**
   * Getter for whether forms should aggregate transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected isAggregateMode(): boolean {
    throw new Error('Method \'isAggregateMode()\' must be overloaded in derivate components.')
  }

  /**
   * Getter for whether forms should aggregate transactions in BONDED
   * @return {boolean}
   */
  protected isMultisigMode(): boolean {
    return this.isCosignatoryMode === true
  }

  /**
   * Getter for transactions that will be staged
   * @throws {Error} If not overloaded in derivate component
   */
  protected getTransactions(): Transaction[] {
    throw new Error('Getter method \'getTransactions()\' must be overloaded in derivate components.')
  }

  /**
   * Setter for transactions that will be staged
   * @param {Transaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: Transaction[]) {
    const error = `setTransactions() must be overloaded. Call got ${transactions.length} transactions.`
    throw new Error(error)
  }

  /**
   * Hook called when the confirmation modal must open
   * @see {FormTransactionBase}
   * @throws {Error} If not overloaded in derivate component
   */
  protected onShowConfirmationModal() {
    this.hasConfirmationModal = true
  }

  /**
   * Hook called when a signer is selected.
   * @param {string} publicKey
   */
  public async onChangeSigner(publicKey: string) {
    await this.$store.dispatch('wallet/SET_CURRENT_SIGNER', {publicKey})
  }

  /**
   * Process form input
   * @return {void}
   */
  public currentAccount: AccountModel
  public currentPeer: Record<string, any>
  public signedTransactions: SignedTransaction[]

  public async onSubmit() {
    const transactions = this.getTransactions()

    this.$store.dispatch('diagnostic/ADD_DEBUG', 'Adding ' + transactions.length + ' transaction(s) to stage (prepared & unsigned)')

    // - check whether transactions must be aggregated
    // - also set isMultisig flag in case of cosignatory mode
    if (this.isAggregateMode()) {
      this.$store.commit('wallet/stageOptions', {
        isAggregate: true,
        isMultisig: this.isMultisigMode(),
        
      })
    }     
  const options = this.$store.getters['wallet/stageOptions']
  //check isLedger wallet
  if(this.currentWallet.type == WalletType.fromDescriptor('Ledger')){
    this.$Notice.success({
      title: this['$t']('Verify information in your device!') + ''
    })
    const transport = await TransportWebUSB.create();
    const symbolLedger = new SymbolLedger(transport, "XYM");
    const currentPath = this.currentWallet.path
    const networkType = this.currentAccount.networkType
    const accountResult = await symbolLedger.getAccount(currentPath)
    const { address, publicKey, path } = accountResult;
    const defaultFee = this.$store.getters['app/defaultFee']

    try {
      //Get account from ledger.
      const signedTransactions =[]
      this.currentSigner = PublicAccount.createFromPublicKey(publicKey,networkType)
      // const currentSigner = this.$store.getters['wallet/currentSigner']
      if (options.isAggregate){
        if(!options.isMultisig){ 
          const aggregateTx = AggregateTransaction.createComplete(
            Deadline.create(),
            // - format as `InnerTransaction`
            transactions.map(t => t.toAggregate(this.currentSigner)),
            networkType,
            [],
            UInt64.fromUint(defaultFee),
          )

          const signature = await symbolLedger.signTransaction(path,aggregateTx, this.generationHash, publicKey)
          transport.close()
          this.$store.commit('wallet/addSignedTransaction', signature)
          signedTransactions.push(signature)
          
          // - notify diagnostics
          this.$store.dispatch('diagnostic/ADD_DEBUG', `Signed aggregate transaction with account ${address} and result: ${JSON.stringify({ // addr.plain()
            hash: signature.hash,
            payload: signature.payload,
          })}`)
          // - reset transaction stage
          this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')
          // - notify about successful transaction announce
          const debug = `Count of transactions signed:  ${signedTransactions.length}`
          this.$store.dispatch('diagnostic/ADD_DEBUG', debug)
          this.$store.dispatch('notification/ADD_SUCCESS', 'success_transactions_signed')
          await this.onConfirmationSuccess(this.currentSigner)
        } 
        else if(options.isMultisig ) { 
          const currentSigner = this.$store.getters['wallet/currentSigner']
          const multisigAccount = PublicAccount.createFromPublicKey(
            currentSigner.publicKey,
            this.networkType,
          )

          const networkMosaic = this.$store.getters['mosaic/networkMosaic']
          const signedTransactions = []
          const networkConfiguration = this.$store.getters['network/networkConfiguration'] as NetworkConfigurationModel
      
          // - aggregate staged transactions
          const aggregateTx = AggregateTransaction.createBonded(
            Deadline.create(),
            // - format as `InnerTransaction`
            transactions.map(t => t.toAggregate(multisigAccount)),
            networkType,
            [],
            UInt64.fromUint(defaultFee),
          )

          // - sign aggregate transaction and create lock
          const signedTx = await symbolLedger.signTransaction(path,aggregateTx, this.generationHash, publicKey) 
          const hashLock = LockFundsTransaction.create(
            Deadline.create(),
            new Mosaic(
              networkMosaic,
              UInt64.fromNumericString(networkConfiguration.lockedFundsPerAggregate),
            ),
            UInt64.fromUint(1000), 
            signedTx,
            networkType,
            UInt64.fromUint(defaultFee),
          )

          this.$Notice.success({
            title: this['$t']('Sign LockFundTransaction to finish your registration!') + '',
          })
          // - sign hash lock and push
          const signedLock = await symbolLedger.signTransaction(currentPath,hashLock, this.generationHash, publicKey)

          // - push signed transactions (order matters)
          this.$store.commit('wallet/addSignedTransaction', signedLock)
          this.$store.commit('wallet/addSignedTransaction', signedTx)
          signedTransactions.push(signedLock)
          signedTransactions.push(signedTx)

          // - notify diagnostics
          this.$store.dispatch('diagnostic/ADD_DEBUG', `Signed hash lock and aggregate bonded for account ${multisigAccount.address.plain() 
          } with cosignatory ${this.currentWallet.address} and result: ${JSON.stringify({
            hashLockTransactionHash: signedTransactions[0].hash,
            aggregateTransactionHash: signedTransactions[1].hash,
          })}`)
          // - reset transaction stage
          this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

          // - notify about successful transaction announce
          const debug = `Count of transactions signed:  ${signedTransactions.length}`
          this.$store.dispatch('diagnostic/ADD_DEBUG', debug)
          this.$store.dispatch('notification/ADD_SUCCESS', 'success_transactions_signed')
          this.$emit('success', this.currentWallet)
          this.$emit('close')
          const currenwalletPublicAccount = PublicAccount.createFromPublicKey(this.currentWallet.publicKey,networkType)
          await this.onConfirmationSuccess(currenwalletPublicAccount)
        } 
      } else {
        await Promise.all(transactions.map(
          async (transaction) => {
            await this.$store.dispatch(
              'wallet/ADD_STAGED_TRANSACTION',
              transaction,
            )
            // - sign transaction with \a account
            const signature = await symbolLedger.signTransaction(path, transaction, this.generationHash, publicKey)
            transport.close()
            this.$store.commit('wallet/addSignedTransaction', signature)
            signedTransactions.push(signature)

            // - notify diagnostics
            this.$store.dispatch('diagnostic/ADD_DEBUG',
              `Signed transaction with account ${this.currentSigner.address.plain()} and result: ${JSON.stringify(
                {
                  hash: signature.hash,
                  payload: signature.payload,
                })}`)
            
            // - reset transaction stage
            this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

            // - notify about successful transaction announce
            const debug = `Count of transactions signed:  ${signedTransactions.length}`
            this.$store.dispatch('diagnostic/ADD_DEBUG', debug)
            this.$store.dispatch('notification/ADD_SUCCESS', 'success_transactions_signed')
            this.$emit('success', this.currentWallet)
            this.$emit('close')
            const currenwalletPublicAccount = PublicAccount.createFromPublicKey(this.currentWallet.publicKey,networkType)
            await this.onConfirmationSuccess(currenwalletPublicAccount)

          }))
        }
      } catch (err) {
        transport.close()
        this.$Notice.error({
          title: this['$t']('Transaction canceled!') + '',
        })
        console.log(err)
      }  
    }
    // This account is not Ledger account
    else{
      await Promise.all(transactions.map(
        async (transaction) => {
          await this.$store.dispatch(
            'wallet/ADD_STAGED_TRANSACTION',
            transaction,
          )
          // - open signature modal
          this.onShowConfirmationModal()
        }))
    }
    this.resetForm()
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'success'
   * @return {void}
   */
  public async onConfirmationSuccess(issuer: PublicAccount) {
    // if the form was in multisig, set the signer to be the main wallet
    // this triggers resetForm in the @Watch('currentWallet') hook
    if (this.isMultisigMode()) {
      this.$store.dispatch('wallet/SET_CURRENT_WALLET', this.currentWallet)
    } else {
      this.resetForm()
    }

    this.hasConfirmationModal = false
    this.$emit('on-confirmation-success')

    // XXX does the user want to broadcast NOW ?

    // - read transaction stage options
    const options = this.$store.getters['wallet/stageOptions']
    const service = new TransactionService(this.$store)
    let results: BroadcastResult[] = []

    // - case 1 "announce partial"
    if (options.isMultisig) {
      results = await service.announcePartialTransactions(issuer)
    }
    // - case 2 "announce complete"
    else {
      results = await service.announceSignedTransactions()
    }

    // - notify about errors and exit
    const errors = results.filter(result => false === result.success)
    if (errors.length) {
      errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
      return
    }

    // - notify about broadcast success (_transactions now unconfirmed_)
    const message = options.isMultisig
      ? 'success_transaction_partial_announced'
      : 'success_transactions_announced'
    this.$store.dispatch('notification/ADD_SUCCESS', message)

    // Reset form validation
    this.resetFormValidation()
  }

  /**
   * Reset form validation
   * @private
   */
  private resetFormValidation(): void {
    this.$refs && this.$refs.observer && this.$refs.observer.reset()
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'error'
   * @return {void}
   */
  public onConfirmationError(error: string) {
    this.$store.dispatch('notification/ADD_ERROR', error)
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'close'
   * @return {void}
   */
  public onConfirmationCancel() {
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')
    this.hasConfirmationModal = false
  }


}
