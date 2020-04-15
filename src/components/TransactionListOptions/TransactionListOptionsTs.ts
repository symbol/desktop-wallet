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
import {NetworkType} from 'symbol-sdk'
// child components
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
import {Signer} from '@/store/Wallet'
import {WalletModel} from '@/core/database/entities/WalletModel'
import {TransactionGroup} from '@/store/Transaction'


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
  @Prop({default: TransactionGroup.confirmed}) currentTab: TransactionGroup

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
    this.$store.dispatch('wallet/SET_CURRENT_SIGNER', {publicKey})
  }

  /**
   * Hook called when refresh button is clicked
   * @protected
   */
  protected refresh(): void {
    this.$store.dispatch('transaction/LOAD_TRANSACTIONS', {group: this.currentTab})
  }

  /**
   * Hook called @ component creation
   * Starts a subscription to handle REST calls for refreshing transactions
   */
  public created(): void {
    this.refresh()
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
