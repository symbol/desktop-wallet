import { Component, Vue, Prop } from 'vue-property-decorator';
//@ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
//@ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';

//@ts-ignore
import { mapGetters } from 'vuex';
import { RentalFees } from 'symbol-sdk';
export type RentalFeesType = 'mosaic' | 'root-namespace' | 'child-namespace';
@Component({
    components: {
        MosaicAmountDisplay,
        FormRow,
    },
    computed: mapGetters({
        rentalEstimation: 'network/rentalFeeEstimation',
    }),
})
export class RentalFeeTs extends Vue {
    @Prop({ required: true }) rentalType: RentalFeesType;
    @Prop() duration: number;
    private rentalEstimation: RentalFees;
    /**
     * @description: return effectiveFee according to prop 'rentalType'
     */
    public async created() {
        await this.$store.dispatch('network/REST_NETWORK_RENTAL_FEES');
    }
    get rentalFeeAmount(): number {
        let feeAmountRaw: number = 0;
        switch (this.rentalType) {
            case 'mosaic':
                feeAmountRaw = this.rentalEstimation.effectiveMosaicRentalFee.compact();
                break;
            case 'root-namespace':
                feeAmountRaw = this.rentalEstimation.effectiveRootNamespaceRentalFeePerBlock.compact() * this.duration;
                break;
            case 'child-namespace':
                feeAmountRaw = this.rentalEstimation.effectiveChildNamespaceRentalFee.compact();
                break;
        }

        return feeAmountRaw;
    }
}
