import { Vue, Component, Prop } from 'vue-property-decorator'
import { ContactQR } from 'symbol-qr-library'
import { NetworkType } from 'symbol-sdk'
import { QRCodeDetailItem } from '@/components/QRCode/QRCodeActions/TemplateQRAction/TemplateQRActionTs'
// @ts-ignore
import TemplateQRAction from '@/components/QRCode/QRCodeActions/TemplateQRAction/TemplateQRAction.vue'

@Component({
  components: { TemplateQRAction },
})
export default class ContactQRActionTs extends Vue {
  @Prop({ default: null }) readonly qrCode!: ContactQR

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
        this.$t('qrcode_detail_item_type_contactqr').toString(),
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

    items.push(new QRCodeDetailItem(this.$t('qrcode_detail_item_contact_name').toString(), this.qrCode.name, true))
    items.push(
      new QRCodeDetailItem(this.$t('qrcode_detail_item_address').toString(), this.qrCode.account.address.plain(), true),
    )

    return items
  }

  public onSubmit() {
    this.onSuccess()
    this.$router.push({
      name: 'dashboard.transfer',
      query: { recipientAddress: this.qrCode.account.address.plain() },
    })
  }
}
