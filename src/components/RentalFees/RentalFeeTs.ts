import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
//@ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
//@ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

export type RentalFeesType = 'mosaic' | 'root-namespace' | 'child-namespace'
@Component({
  components: {
    MosaicAmountDisplay,
    FormRow,
  },
})
export class RentalFeeTs extends Vue {
  @Prop({ required: true }) rentalType: RentalFeesType
  @Prop() duration: number
  @Prop({ required: true }) rentalFee: number

  /**
   * @description: return effectiveFee according to prop 'rentalType'
   */
  get rentalFeeAmount(): number {
    let feeAmountRaw: number = this.rentalFee
    return this.rentalType == 'root-namespace' ? (feeAmountRaw *= this.duration) : feeAmountRaw
  }

  @Watch('rentalFeeAmount')
  onRentalFeeAmountChange() {
    this.$store.commit('network/currentRentalFee', this.rentalFeeAmount)
  }

  destroyed() {
    this.$store.commit('network/currentRentalFee', 0)
  }
}
