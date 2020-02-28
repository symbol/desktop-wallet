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
import {Vue, Component} from 'vue-property-decorator'
import {MnemonicPassPhrase} from 'nem2-hd-wallets'
import CryptoJS from 'crypto-js'

// internal dependencies
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {NotificationType} from '@/core/utils/NotificationType'

// @ts-ignore
import ProgressDisplay from '@/components/ProgressDisplay/ProgressDisplay.vue'


@Component({
  components: {
    ProgressDisplay,
  },
})
export default class GenerateMnemonicTs extends Vue {
  /**
   * Entropy storage
   * @var {string}
   */
  private entropy = ''

  /**
   * Whether component should track mouse move
   * @var {boolean}
   */
  public shouldTrackMouse: boolean = true
  
  value: number = 0

  /**
   * Track and handle mouse move event
   * @param {Vue.Event} event
   * @return {void} 
   */
  public handleMousemove({x, y}) {
    if (this.value < 100) {
      this.entropy += AESEncryptionService.generateRandomBytes(8, /* raw=*/false)
      this.value ++
      return
    }

    // stop tracking
    this.shouldTrackMouse = false
    return this.saveMnemonicAndGoToNextPage()
  }

  submit() {
    this.$router.push({name: 'accounts.creation.backupMnemonic'})
  }
  /**
   * Save mnemonic and redirect to next page
   * return {void}
   */
  private async saveMnemonicAndGoToNextPage() {
    try {
      console.info(this.entropy,'this.entropy');
      // act
      const entropy = CryptoJS.SHA256(this.entropy).toString()
      const seed = MnemonicPassPhrase.createFromEntropy(entropy)
      console.log(seed)
      // update state
      this.$store.dispatch('temporary/SET_MNEMONIC', seed)
      this.$store.dispatch('notification/ADD_SUCCESS', this.$t('Generate_entropy_increase_success'))

      // redirect
      return this.$router.push({name: 'accounts.creation.backupMnemonic'})
    }
    catch (error) {
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.MNEMONIC_GENERATION_ERROR)
    }
  }
}
