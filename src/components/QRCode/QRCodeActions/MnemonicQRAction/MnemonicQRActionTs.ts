import { Vue, Component, Prop } from 'vue-property-decorator'
import { MnemonicQR } from 'symbol-qr-library'
import { NetworkType } from 'symbol-sdk'
import { QRCodeDetailItem } from '@/components/QRCode/QRCodeActions/TemplateQRAction/TemplateQRActionTs'
// @ts-ignore
import TemplateQRAction from '@/components/QRCode/QRCodeActions/TemplateQRAction/TemplateQRAction.vue'

@Component({
  components: { TemplateQRAction },
})
export default class MnemonicQRActionTs extends Vue {
  @Prop({ default: null }) readonly qrCode!: MnemonicQR

  @Prop({ default: null }) readonly onSuccess: () => void

  /**
   * Get QR Code detail items
   *
   * @returns QRCodeDetailItem[]
   */
  public get detailItems(): QRCodeDetailItem[] {
    const items: QRCodeDetailItem[] = []
    items.push(
      new QRCodeDetailItem(
        this.$t('qrcode_detail_item_type').toString(),
        this.$t('qrcode_detail_item_type_mnemonicqr').toString(),
        true,
      ),
    )
    items.push(
      new QRCodeDetailItem(
        this.$t('qrcode_detail_item_network_type').toString(),
        NetworkType[this.qrCode.networkType],
        true,
      ),
    )
    items.push(
      new QRCodeDetailItem(
        this.$t('qrcode_detail_item_mnemonic_passphrase').toString(),
        this.qrCode.mnemonic.plain.split(' ').splice(3).join(' ') + ' ********', // masked for security purposes
        true,
      ),
    )
    return items
  }

  public async onSubmit() {
    this.$store.dispatch('temporary/SET_MNEMONIC', this.qrCode.mnemonic.plain)
    this.onSuccess()
  }
}
