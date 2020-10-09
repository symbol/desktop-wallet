/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Vue, Component, Prop } from 'vue-property-decorator'
// import { officialIcons } from '@/views/resources/Images'

// //@ts-ignore
// import UploadQRCode from '@/components/QRCode/UploadQRCode/UploadQRCode.vue'

// //@ts-ignore
// import QRCodePassword from '@/components/QRCode/QRCodePassword/QRCodePassword.vue'

// //@ts-ignore
// import ModalWizardDisplay from '@/views/modals/ModalWizardDisplay/ModalWizardDisplay.vue'

// // @ts-ignore
// import QRCodeActions from '@/components/QRCode/QRCodeActions/QRCodeActions.vue'

// @Component({
//   components: { UploadQRCode, QRCodePassword, ModalWizardDisplay, QRCodeActions },
// })
@Component
export class ModalNetworkNotMatchingProfileTs extends Vue {
  @Prop({ default: false }) visible: boolean
  /**
   * Internal visibility state
   * @type {boolean}
   */
  protected get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  protected set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  private async logout() {
    await this.$store.dispatch('profile/LOG_OUT')
    this.$emit('close')
    this.$router.push({ name: 'profiles.login' })
  }
  private async createNewProfile() {
    await this.$store.dispatch('profile/LOG_OUT')
    this.$emit('close')
    this.$router.push({ name: 'profiles.importProfile.importStrategy' })
  }
  private closeAndChangeNetwork() {
    this.$emit('close')
  }
}
