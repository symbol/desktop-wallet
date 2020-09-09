import { Vue, Component, Prop } from 'vue-property-decorator'
import { QRCode } from 'symbol-qr-library'

// @ts-ignore
import QRCodeDisplay from '@/components/QRCode/QRCodeDisplay/QRCodeDisplay.vue'
// @ts-ignore
import ContactQRAction from '@/components/QRCode/QRCodeActions/ContactQRAction/ContactQRAction.vue'
// @ts-ignore
import MnemonicQRAction from '@/components/QRCode/QRCodeActions/MnemonicQRAction/MnemonicQRAction.vue'
// @ts-ignore
import TransactionQRAction from '@/components/QRCode/QRCodeActions/TransactionQRAction/TransactionQRAction.vue'

@Component({
  components: { QRCodeDisplay, ContactQRAction, MnemonicQRAction, TransactionQRAction },
})
export default class QRCodeActionsTs extends Vue {
  @Prop({ default: null }) readonly qrCode: QRCode

  @Prop({ default: true }) readonly showPreview: boolean

  @Prop({ default: null }) readonly onSuccess: () => void
}
