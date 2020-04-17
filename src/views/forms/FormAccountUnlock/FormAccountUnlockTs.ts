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
import {Account, EncryptedPrivateKey, NetworkType, Password, Address} from 'symbol-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
// internal dependencies
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletModel,WalletType} from '@/core/database/entities/WalletModel'
import {AccountService} from '@/services/AccountService'
import {NotificationType} from '@/core/utils/NotificationType'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: {
    ValidationProvider,
    FormWrapper,
    FormRow,
    ErrorTooltip,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    currentPass: 'temporary/password',
  })},
})
export class FormAccountUnlockTs extends Vue {
  /**
   * Current network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Currently active wallet
   * @var {WalletModel}
   */
  public currentWallet: WalletModel

  public currentPass: Password
  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    password: '',
  }

  /// region computed properties getter/setter
  /// end-region computed properties getter/setter

  /**
   * Attempt decryption of private key to unlock
   * account.
   * @return {void}
   */

  public get isLedger():boolean{
    return this.currentWallet.type == WalletType.fromDescriptor('Ledger')
  }

  public accountService = new AccountService()

  public processVerification() {
    // - create encrypted payload for active wallet
    const encrypted = new EncryptedPrivateKey(
      this.currentWallet.encPrivate,
      this.currentWallet.encIv,
    )

    try {
      // - attempt decryption
      const password = new Password(this.formItems.password)
      const passwordHash = AccountService.getPasswordHash(new Password(this.formItems.password))
      // read account's password hash and compare
      const currentAccount = this.accountService.getAccountByName(this.currentWallet.accountName)
      const accountPass = currentAccount.password

      if (accountPass !== passwordHash) {
        return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR)
      }
        
      if(this.isLedger && accountPass == passwordHash){
        const publickey = this.currentWallet.publicKey
        const addr = Address.createFromPublicKey(publickey,this.networkType)
        return this.$emit('success',{account: currentAccount,addr, password})
      } 
      else {
        const privateKey: string = encrypted.decrypt(password)

        if (privateKey.length === 64) {
          const unlockedAccount = Account.createFromPrivateKey(privateKey, this.networkType)
          return this.$emit('success', {account: unlockedAccount, password})
        }
      } 

      return this.$emit('error', this.$t('error_invalid_password'))
    } catch (e) {
      this.$emit('error', e)
    }
  }
}
