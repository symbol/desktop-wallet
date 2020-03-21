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
// external dependencies
import {mapGetters} from 'vuex'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {Address, NetworkType} from 'symbol-sdk'
import {asyncScheduler, Subject} from 'rxjs'
import {throttleTime} from 'rxjs/operators'

// child components
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
import {RESTDispatcher} from '@/core/utils/RESTDispatcher'
import {Signer} from '@/store/Wallet'
import {WalletModel} from '@/core/database/entities/WalletModel'

// custom types
type group = 'confirmed' | 'unconfirmed' | 'partial'

@Component({
  components: {SignerSelector},
  computed: {
    ...mapGetters({
      currentSigner: 'wallet/currentSigner',
      currentWallet: 'wallet/currentWallet',
      networkType: 'network/networkType',
      signers: 'wallet/signers',
    }),
  },
})
export class TransactionListOptionsTs extends Vue {
  @Prop({default: 'confirmed'}) currentTab: group

  /**
   * Minimum interval in ms between each refresh call
   * @private
   * @type {number}
   */
  private REFRESH_CALLS_THROTTLING: number = 500

  /**
   * Observable of public keys to fetch for
   *
   * @private
   * @type {Observable<string>}
   */
  private refreshStream$: Subject<{ publicKey: string, group: group }> = new Subject

  /**
   * Currently active wallet
   * @var {WalletModel}
   */
  protected currentWallet: WalletModel

  /**
   * Network type
   * @var {NetworkType}
   */
  protected networkType: NetworkType

  /**
   * Selected signer from the store
   * @protected
   * @type {string}
   */
  public currentSigner: Signer

  /**
   * Form fields
   * @var {Object}
   */
  public formItems = {
    currentSignerPubicKey: this.currentSigner && this.currentSigner.publicKey || '',
  }

  /**
   * Whether to show the signer selector
   * @protected
   * @type {boolean}
   */
  protected showSignerSelector: boolean = false

  public signers: Signer[]

  /**
   * Hook called when the signer selector has changed
   * @protected
   */
  protected onSignerSelectorChange(publicKey: string): void {
    // set selected signer if the chosen account is a multisig one
    this.formItems.currentSignerPubicKey = publicKey

    // clear previous account transactions
    this.$store.dispatch('wallet/RESET_TRANSACTIONS')

    // dispatch actions using the rest dispatcher
    const dispatcher = new RESTDispatcher(this.$store.dispatch)
    dispatcher.add('wallet/SET_CURRENT_SIGNER', {publicKey})
    dispatcher.add('wallet/REST_FETCH_TRANSACTIONS', {
      group: this.currentTab,
      address: Address.createFromPublicKey(publicKey, this.networkType).plain(),
      pageSize: 100,
    })

    dispatcher.throttle_dispatch()
  }

  /**
   * Hook called when refresh button is clicked
   * @protected
   */
  protected refresh(): void {
    this.refreshStream$.next({publicKey: this.currentSigner.publicKey, group: this.currentTab})
  }

  /**
   * Hook called @ component creation
   * Starts a subscription to handle REST calls for refreshing transactions
   */
  public created(): void {
    this.refreshStream$
      .pipe(
        throttleTime(this.REFRESH_CALLS_THROTTLING, asyncScheduler, {leading: true, trailing: true}),
      )
      .subscribe(({publicKey, group}) => {
      // dispatch REST call
        this.$store.dispatch('wallet/REST_FETCH_TRANSACTIONS', {
          group,
          address: Address.createFromPublicKey(publicKey, this.networkType).plain(),
          pageSize: 100,
        })
      })
  }

  public mounted(): void {
    this.formItems.currentSignerPubicKey = this.currentSigner && this.currentSigner.publicKey || ''
  }

  /**
   * Watch for currentWallet changes
   * Necessary to set the default signer in the selector
   * @param currentSigner the new signer
   */
  @Watch('currentSigner')
  onCurrentSignerChange(currentSigner: Signer): void {
    this.formItems.currentSignerPubicKey = currentSigner.publicKey
  }

  /**
   * Hook called before the component is destroyed
   */
  beforeDestroy(): void {
    // reset the selected signer if it is not the current wallet
    this.onSignerSelectorChange(this.currentWallet.publicKey)
  }
}
