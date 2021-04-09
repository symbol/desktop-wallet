<template>
    <FormRow>
        <template v-slot:label> {{ $t('fee') }}: </template>
        <template v-slot:inputs>
            <div :class="{ 'row-75-25': !hideSubmit }">
                <MaxFeeSelector
                    v-model="maxFee"
                    :calculated-recommended-fee="calculatedRecommendedFee"
                    :show-low-fee-warning="showWarnings && anyWarnings && isFeeLowerThanRecommendedFee"
                    :slow-fee="slowFee"
                    :average-fee="averageFee"
                    :slowest-fee="slowestFee"
                    :fast-fee="fastFee"
                />
                <div v-if="!hideSubmit" class="ml-2">
                    <button
                        type="submit"
                        :class="'centered-button button-style submit-button ' + submitButtonClasses"
                        :disabled="disableSubmit"
                        @click="$emit('button-clicked')"
                    >
                        {{ $t(submitButtonText) }}
                    </button>
                </div>
            </div>
        </template>
    </FormRow>
</template>

<script lang="ts">
// extenal dependencies
import { Component, Vue, Prop } from 'vue-property-decorator';
// child components
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
import FormRow from '@/components/FormRow/FormRow.vue';
import { TransactionFees } from 'symbol-sdk';
import { mapGetters } from 'vuex';
@Component({
    components: { MaxFeeSelector, FormRow },
    computed: {
        ...mapGetters({
            transactionFees: 'network/transactionFees',
        }),
    },
})
export default class MaxFeeAndSubmit extends Vue {
    /**
     * Max fee value, bound to parent v-model
     * @type {number}
     */
    @Prop({ default: 0, required: true }) value: number;
    /**
     * Whether form submit button is hidden
     * @type {boolean}
     */
    @Prop({ default: false }) hideSubmit: boolean;
    /**
     * Whether form submit button is disabled
     * @type {boolean}
     */
    @Prop({ default: false }) disableSubmit: boolean;
    /**
     * Dynamically calculated recommended fee
     */
    @Prop({ default: 0 }) calculatedRecommendedFee: number;
    /**
     * Whether warnings are visible
     */
    @Prop({ default: true }) showWarnings: boolean;
    /**
     * Submit button text
     */
    @Prop({ default: 'send' }) submitButtonText: string;
    /**
     * Submit button classes
     */
    @Prop({ default: 'inverted-button' }) submitButtonClasses: string;
    @Prop({
        default: 0,
    })
    size: number;
    private transactionFees: TransactionFees;
    /**
     * Get max fee value from the value prop
     * @readonly
     * @protected
     * @type {number}
     */
    protected get maxFee(): number {
        return this.value;
    }
    /**
     * Emit chosen max fee value to the parent component
     * @protected
     */
    protected set maxFee(chosenMaxFee) {
        this.$emit('input', chosenMaxFee);
    }
    /**
     * Whether there are any warnings
     */
    protected get anyWarnings(): boolean {
        return this.isFeeLowerThanRecommendedFee;
    }
    /**
     * Whether selected fee is lower than recommended fee
     */
    protected get isFeeLowerThanRecommendedFee() {
        if (this.calculatedRecommendedFee > 0 && this.maxFee !== 10 && this.maxFee !== 20) {
            return this.maxFee < this.calculatedRecommendedFee;
        }
        return false;
    }
    get averageFee() {
        return (this.transactionFees.minFeeMultiplier + this.transactionFees.averageFeeMultiplier * 0.65) * this.size;
    }
    get slowFee() {
        return (this.transactionFees.minFeeMultiplier + this.transactionFees.averageFeeMultiplier * 0.35) * this.size;
    }
    get slowestFee() {
        return this.transactionFees.minFeeMultiplier * this.size;
    }
    get fastFee() {
        return this.transactionFees.averageFeeMultiplier * this.size;
    }
}
</script>

<style lang="less" scoped>
@import './MaxFeeAndSubmit.less';
</style>
