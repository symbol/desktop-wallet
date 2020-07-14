import { Component, Vue, Prop } from 'vue-property-decorator'
//@ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
//@ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
import { mapGetters } from 'vuex'
import { RentalFees } from 'symbol-sdk'
export type RentalFeesType = 'mosaic' | 'root-namespace' | 'child-namespace'
@Component({
  components: {
    MosaicAmountDisplay,
    FormRow,
  },
  computed: {
    ...mapGetters({
      rentalFees: 'network/rentalFees',
    }),
  },
})
export class RentalFeeTs extends Vue {
  @Prop({ required: true }) rentalType: RentalFeesType
  @Prop() duration: number

  /**
   * @description: map the store 'network/rentalFees'
   */

  public rentalFees: RentalFees

  /**
   * @description: return effectiveFee according to prop 'rentalType'
   */
  get rentalFeeAmount(): number {
    let feeAmountRaw: number = 0
    switch (this.rentalType) {
      case 'mosaic':
        feeAmountRaw = this.rentalFees.effectiveMosaicRentalFee.compact()
        break
      case 'root-namespace':
        feeAmountRaw = this.rentalFees.effectiveRootNamespaceRentalFeePerBlock.compact() * this.duration
        break
      case 'child-namespace':
        feeAmountRaw = this.rentalFees.effectiveChildNamespaceRentalFee.compact()
        break
      default:
        feeAmountRaw = 0
    }
    return feeAmountRaw
  }
  mounted() {
    this.$store.commit('network/currentRentalFee', this.rentalFeeAmount)
  }
  destroyed() {
    this.$store.commit('network/currentRentalFee', 0)
  }
}
