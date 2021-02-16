/*
 * Copyright 2020 NEM (https://nem.io)
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
// configuration
import { feesConfig } from '@/config';
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
import { TransactionFees } from 'symbol-sdk';

@Component({
    components: {
        FormLabel,
    },
    computed: {
        ...mapGetters({
            defaultFee: 'app/defaultFee',
            networkMosaicName: 'mosaic/networkMosaicName',
            networkCurrency: 'mosaic/networkCurrency',
            transactionFees: 'network/transactionFees',
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

    public placement: string;

    /**
     * Networks currency mosaic name
     * @var {string}
     */
    private networkMosaicName: string;

    /**
     * Known mosaics info
     * @var {MosaicInfo[]}
     */
    private networkCurrency: NetworkCurrencyModel;

    public transactionFees: TransactionFees;
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
     * Dynamically calculated highest fee
     */
    @Prop({ default: 0 }) calculatedHighestFee: number;

    /**
     * Show low fee warning
     */
    @Prop({ default: false }) showLowFeeWarning: boolean;

    @Prop({ default: false }) showFeeLabel: boolean;

    /**
     * The fees to be displayed in the dropw down.
     */
    private fees: { label: string; maxFee: number; calculatedFee: number }[];

    @Prop({
        default: 1,
    })
    multiplier: number;

    public created() {
        this.fees = Object.entries(feesConfig).map((entry) => ({
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
        if (value === feesConfig.median) {
            return this.formatLabel(
                'fee_speed_' + key,
                this.calculatedRecommendedFee,
                this.networkMosaicName,
                this.calculatedRecommendedFee > 0,
            );
        } else if (value === feesConfig.highest) {
            return this.formatLabel('fee_speed_' + key, this.calculatedHighestFee, this.networkMosaicName, this.calculatedHighestFee > 0);
        }
        return this.formatLabel('fee_speed_' + key, value, this.networkMosaicName);
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
        if (showAmount) {
            label += `: ${this.getFormattedRelative(fee)} ${mosaic}`;
        }
        return label;
    }

    /**
     * Value set by the parent component's v-model
     * @type {number}
     */
    @Prop({
        default: feesConfig.median,
    })
    value: number;

    /// region computed properties getter/setter
    /**
     * Value set by the parent component
     * @type {number}
     */
    get chosenMaxFee(): number {
        return typeof this.value === 'number' ? this.value : this.defaultFee;
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
        let relativeAmount: number;
        if (this.networkCurrency === undefined) {
            relativeAmount = amount;
        } else {
            relativeAmount = amount / Math.pow(10, this.networkCurrency.divisibility);
        }
        return relativeAmount.toLocaleString(undefined, { maximumFractionDigits: this.networkCurrency.divisibility });
    }

    /**
     * Returns the sorted fees (including the calculated fees)
     */
    public get feesCalculated(): { label: string; maxFee: number }[] {
        return this.fees
            .map((i) => {
                if (i.maxFee === 1) {
                    return {
                        label: this.getLabel(['median', feesConfig.median]),
                        maxFee: i.maxFee,
                        calculatedFee: this.calculatedRecommendedFee,
                    };
                } else if (i.maxFee === 2) {
                    return {
                        label: this.getLabel(['highest', feesConfig.highest]),
                        maxFee: i.maxFee,
                        calculatedFee: this.calculatedHighestFee,
                    };
                } else {
                    return i;
                }
            })
            .sort((a, b) => a.calculatedFee - b.calculatedFee);
    }
}
