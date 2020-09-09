import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { QRCodeGenerator, QRCode, QRCodeType } from 'symbol-qr-library'
import { ValidationProvider } from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: { FormWrapper, FormRow, ErrorTooltip, ValidationProvider },
})
export default class QRCodePasswordTs extends Vue {
  @Prop({ default: null })
  public qrcodeJson: string

  @Prop({ default: '' })
  public header: string

  @Prop({ default: false })
  public showDownload: string

  public qrCode: QRCode

  public askForPassword: boolean = false

  public formItems = {
    password: '',
  }

  public $refs!: {
    provider: InstanceType<typeof ValidationProvider>
  }

  @Watch('qrcodeJson', { immediate: true })
  public proceedIfNoPasswordNeeded() {
    const jsonObject = JSON.parse(this.qrcodeJson)
    if (jsonObject && (jsonObject.type == QRCodeType.ExportAccount || jsonObject.type == QRCodeType.ExportMnemonic)) {
      this.askForPassword = true
    } else {
      // no password needed, continue to generate qrcode
      this.generateQRCode()
    }
  }

  public generateQRCode() {
    try {
      this.qrCode = QRCodeGenerator.fromJSON(this.qrcodeJson, this.formItems.password)
      this.$emit('qrCodeGenerated', this.qrCode)
      this.askForPassword = false
    } catch (error) {
      this.showError(error)
    }
  }

  private showError(error: string) {
    this.$refs.provider.applyResult({
      errors: [error],
      failedRules: {},
    })
  }
}
