import { Vue, Component, Prop } from 'vue-property-decorator'

//@ts-ignore
import UploadQRCode from '@/components/QRCode/UploadQRCode/UploadQRCode.vue'

//@ts-ignore
import QRCodePassword from '@/components/QRCode/QRCodePassword/QRCodePassword.vue'

//@ts-ignore
import ModalWizardDisplay from '@/views/modals/ModalWizardDisplay/ModalWizardDisplay.vue'

// @ts-ignore
import QRCodeActions from '@/components/QRCode/QRCodeActions/QRCodeActions.vue'

import { QRCode, QRCodeType } from 'symbol-qr-library'

@Component({
  components: { UploadQRCode, QRCodePassword, ModalWizardDisplay, QRCodeActions },
})
export class ModalImportQRTs extends Vue {
  @Prop({ default: false }) readonly visible: boolean

  @Prop({ default: [QRCodeType.AddContact, QRCodeType.RequestTransaction, QRCodeType.ExportObject] })
  readonly validQrTypes!: QRCodeType[]

  /**
   * json content of uploaded qrcode
   * @type string
   */
  qrcodeJson: string = null

  /**
   * generated QR Code from uploaded qrcode image(json)
   * @type QRCode
   */
  qrCode: QRCode = null

  wizardSteps = {
    items: ['upload_qr_code', 'preview_and_action'],
    icons: [],
    currentStepInx: 0,
  }

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

  /**
   * QR Code upload & decode complete handler
   * @param {string} json decoded from uploaded qrcode
   */
  public onUploadComplete(json) {
    this.qrcodeJson = json
    setTimeout(() => (this.wizardSteps.currentStepInx = 1), 1200) // labor illusion
  }

  /**
   * QRCode generation complete handler
   * @param ${QRCode} qrCode generated
   */
  public onQrCodeGenerated(qrCode: QRCode) {
    this.qrCode = qrCode
  }
}
