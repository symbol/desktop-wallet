/*
 * (C) Symbol Contributors 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';

@Component({
    components: {
        FormLabel,
    },
    computed: {
        ...mapGetters({
            defaultFee: 'app/defaultFee',
            networkMosaicName: 'mosaic/networkMosaicName',
            networkCurrency: 'mosaic/networkCurrency',
            feesConfig: 'network/feesConfig',
        }),
    },
    props: {
        placement: {
            type: String,
            default: 'bottom-start',
        },
    },
})
export class MaxFeeSelectorTs extends Vue {
    @Prop({
        default: 'form-line-container',
    })
    public className: string;

    @Prop({ default: false })
    public displayOnly!: boolean;

    /**
     * Value set by the parent component's v-model
     * @type {number}
     */
    @Prop({
        default: 10,
    })
    value: number;

    public placement: string;

    /**
     * Networks currency mosaic name
     * @var {string}
     */
    private networkMosaicName: string;
    private feesConfig: {
        fast: number;
        median: number;
        slow: number;
        slowest: number;
        free: number;
    };

    /**
     * Known mosaics info
     * @var {MosaicInfo[]}
     */
    private networkCurrency: NetworkCurrencyModel;

    /**
     * Default fee setting
     * @var {number}
     */
    private defaultFee: number;

    /**
     * Dynamically calculated recommended fee
     */
    @Prop({ default: 0 }) calculatedRecommendedFee: number;

    /**
    /**
     * Show low fee warning
     */
    @Prop({ default: false }) showLowFeeWarning: boolean;

    @Prop({ default: false }) showFeeLabel: boolean;
    @Prop({ default: 0 }) slowFee: number;
    @Prop({ default: 0 }) slowestFee: number;
    @Prop({ default: 0 }) fastFee: number;
    @Prop({ default: 0 }) averageFee: number;

    /**
     * The fees to be displayed in the dropw down.
     */
    private fees: { label: string; maxFee: number; calculatedFee: number }[];

    @Prop({
        default: 1,
    })
    multiplier: number;

    public created() {
        this.fees = Object.entries(this.feesConfig).map((entry) => ({
            label: this.getLabel([entry[0], entry[1] as number]),
            maxFee: entry[1] as number,
            calculatedFee: entry[1] as number,
        }));
    }

    /**
     * Returns the label based on the feesConfig property
     * @param {[string, number]} key, value pair
     */
    private getLabel([key, value]: [string, number]) {
        //SPECIAL VALUES!!!
        if (value === this.feesConfig.median) {
            return this.formatLabel('fee_speed_' + key, this.averageFee, this.networkMosaicName, !!this.averageFee);
        } else if (value === this.feesConfig.fast) {
            return this.formatLabel('fee_speed_' + key, this.fastFee, this.networkMosaicName, !!this.fastFee);
        } else if (value === this.feesConfig.slow) {
            return this.formatLabel('fee_speed_' + key, this.slowFee, this.networkMosaicName, !!this.slowFee);
        } else if (value === this.feesConfig.slowest) {
            return this.formatLabel('fee_speed_' + key, this.slowestFee, this.networkMosaicName, !!this.slowestFee);
        } else {
            return this.formatLabel('fee_speed_' + key, value, this.networkMosaicName);
        }
    }

    /**
     * Returns the formatted label
     * @param labelKey
     * @param fee
     * @param mosaic
     * @param showAmount
     */
    private formatLabel(labelKey: string, fee: number, mosaic: string, showAmount: boolean = true): string {
        let label = this.$t(labelKey).toString();
        if (showAmount && this.networkCurrency) {
            label += `: ${this.getFormattedRelative(fee)} ${mosaic}`;
        }
        return label;
    }

    /// region computed properties getter/setter
    /**
     * Value set by the parent component
     * @type {number}
     */
    get chosenMaxFee(): number {
        const chosenFee =
            typeof this.value === 'number' ? this.value : typeof this.value === 'string' ? Number(this.value) : this.defaultFee;
        const selectedValue = this.feesCalculated.find((fee) => fee.maxFee === chosenFee).calculatedFee;
        this.$emit('value', selectedValue);
        return chosenFee;
    }

    /**
     * Emit value change
     */
    set chosenMaxFee(newValue: number) {
        this.$emit('input', newValue);
    }
    /// end-region computed properties getter/setter

    /**
     * Convert a relative amount to absolute using mosaicInfo
     * @param {number} price
     * @return {number}
     */
    public getFormattedRelative(amount: number): string {
        const relativeAmount = amount / Math.pow(10, this.networkCurrency.divisibility);

        return relativeAmount.toLocaleString(undefined, { maximumFractionDigits: this.networkCurrency.divisibility });
    }

    /**
     * Returns the sorted fees (including the calculated fees)
     */
    public get feesCalculated(): { label: string; maxFee: number; calculatedFee: number }[] {
        return this.fees
            .map((i) => {
                if (i.maxFee === this.feesConfig.median) {
                    return {
                        label: this.getLabel(['median', this.feesConfig.median]),
                        maxFee: i.maxFee,
                        calculatedFee: this.averageFee,
                    };
                } else if (i.maxFee === this.feesConfig.fast) {
                    return {
                        label: this.getLabel(['fast', this.feesConfig.fast]),
                        maxFee: i.maxFee,
                        calculatedFee: this.fastFee,
                    };
                } else if (i.maxFee === this.feesConfig.slow) {
                    return {
                        label: this.getLabel(['slow', this.feesConfig.slow]),
                        maxFee: i.maxFee,
                        calculatedFee: this.slowFee,
                    };
                } else if (i.maxFee === this.feesConfig.slowest) {
                    return {
                        label: this.getLabel(['slowest', this.feesConfig.slowest]),
                        maxFee: i.maxFee,
                        calculatedFee: this.slowestFee,
                    };
                } else {
                    return i;
                }
            })
            .slice();
    }
    /**
     * Checks if user is navigated to offline transactions
     */

    get isOfflineTransaction(): boolean {
        if (this.$route.fullPath === '/offlineTransaction/simple') {
            return true;
        }
        return false;
    }
}
