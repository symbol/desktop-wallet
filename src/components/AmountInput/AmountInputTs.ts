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
import { Component, Vue, Prop } from 'vue-property-decorator';

// internal dependencies
import { createValidationRuleSet } from '@/core/validation/ValidationRuleset';

// child components
import { ValidationProvider } from 'vee-validate';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
import { mapGetters } from 'vuex';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { networkConfig } from '@/config';
import { NetworkType } from 'symbol-sdk';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { MaxAmountValidator } from '@/core/validation/validators';

@Component({
    components: {
        ValidationProvider,
        ErrorTooltip,
    },
    computed: {
        ...mapGetters({
            mosaics: 'mosaic/mosaics',
            networkType: 'network/networkType',
            balanceMosaics: 'mosaic/balanceMosaics',
            networkConfiguration: 'network/networkConfiguration',
            isCosignatoryMode: 'account/isCosignatoryMode',
        }),
    },
})
export class AmountInputTs extends Vue {
    @Prop({ default: '' }) value: string;
    @Prop({ default: '' }) mosaicHex: string;
    @Prop({ default: false }) isOffline: boolean;
    @Prop({ default: 0 }) selectedFeeValue: number;
    @Prop({ default: false }) isAggregate: boolean;
    /**
     * Currently active account's balances
     * @var {Mosaic[]}
     */
    public balanceMosaics: MosaicModel[];

    /**
     * Available mosaics models
     */
    public mosaics: MosaicModel[];

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules;

    public networkType: NetworkType;

    private networkConfiguration: NetworkConfigurationModel;
    private validAmount: boolean = true;
    private isCosignatoryMode: boolean;
    private isNumber: boolean = true;

    created() {
        // update validation rule to reflect correct mosaic divisibility
        const chosenMosaic = this.mosaics.find((mosaic) => this.mosaicHex === mosaic.mosaicIdHex);
        const networkConfigurationDefaults = networkConfig[this.networkType || NetworkType.TEST_NET].networkConfigurationDefaults;
        networkConfigurationDefaults.maxMosaicDivisibility = chosenMosaic ? chosenMosaic.divisibility : 6;

        // set validation rules for this field
        this.validationRules = createValidationRuleSet(networkConfigurationDefaults);
    }

    /// region computed properties getter/setter
    public get relativeValue(): string {
        this.isNumber = !isNaN(parseInt(this.value));

        this.validAmount = MaxAmountValidator.validate(this.value, [this.totalAvailableAmount, this.isOffline]);
        return this.value;
    }

    public set relativeValue(amount: string) {
        this.$emit('input', amount);
    }
    /// end-region computed properties getter/setter

    // get the total available amount of the selected mosaic on the account
    public get totalAvailableAmount() {
        const selectedMosaic = this.balanceMosaics.find((m) => m.mosaicIdHex === this.mosaicHex);
        const currentMosaicBalance = selectedMosaic.balance / Math.pow(10, selectedMosaic.divisibility);
        const balance = this.isCosignatoryMode
            ? currentMosaicBalance
            : (selectedMosaic.balance - this.selectedFeeValue) / Math.pow(10, selectedMosaic.divisibility);
        if (currentMosaicBalance == 0 || balance <= 0) {
            return 0;
        }
        if (selectedMosaic.mosaicIdHex === this.networkConfiguration.currencyMosaicId) {
            return balance;
        }
        return currentMosaicBalance;
    }
    // use maximum balance as amount input
    private useMaximumBalance() {
        const roundedValue = this.totalAvailableAmount.toString();
        this.relativeValue = roundedValue;
        this.$emit('input', roundedValue);
    }
}
