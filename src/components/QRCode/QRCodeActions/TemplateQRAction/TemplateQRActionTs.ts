import { Vue, Component, Prop } from 'vue-property-decorator'
import { QRCode } from 'symbol-qr-library'
// @ts-ignore
import QRCodeDisplay from '@/components/QRCode/QRCodeDisplay/QRCodeDisplay.vue'

@Component({
  components: { QRCodeDisplay },
})
export default class TemplateQRActionTs extends Vue {
  @Prop({ default: null }) readonly qrCode!: QRCode

  @Prop({ default: '' }) readonly actionDesc!: string

  @Prop({ default: true }) readonly showActionButton!: boolean

  @Prop({ default: 'continue' }) readonly actionButtonText!: string

  @Prop({ default: [] }) readonly detailItems!: QRCodeDetailItem[]

  @Prop({ default: null }) readonly onSubmit!: () => void
}

export class QRCodeDetailItem {
  constructor(public label: string, public value: string, public header: boolean = false) {}
}
