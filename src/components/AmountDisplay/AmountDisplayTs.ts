/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { mapGetters } from 'vuex';

// configuration

@Component({
    computed: {
        ...mapGetters({
            networkConfiguration: 'network/networkConfiguration',
        }),
    },
})
export class AmountDisplayTs extends Vue {
    @Prop({ default: 0 }) value: number;

    @Prop({ default: undefined }) decimals: number | undefined;

    @Prop({ default: false }) showTicker: false;

    @Prop({ default: '' }) ticker: string;

    @Prop({ default: 'normal' }) size: 'normal' | 'smaller' | 'bigger' | 'biggest';

    public networkConfiguration: NetworkConfigurationModel;

    /// region computed properties getter/setter
    get integerPart(): string {
        return this.value >= 0 ? Math.floor(this.value).toLocaleString() : '-' + Math.floor(this.value * -1).toLocaleString();
    }

    get fractionalPart(): string {
        const absoluteValue = Math.abs(this.value);
        const rest = absoluteValue - Math.floor(absoluteValue);
        const decimals = this.decimals === undefined ? this.networkConfiguration.maxMosaicDivisibility || 6 : this.decimals;
        const formatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals,
        };
        // remove leftmost 0 and rightmost 0s
        return rest.toLocaleString(undefined, formatOptions).replace(/^0/, '');
    }

    /**
     * Ticker displayed in the view
     * @readonly
     * @type {string}
     */
    get displayedTicker(): string {
        return (this.showTicker && this.ticker) || '';
    }

    /// end-region computed properties getter/setter
}
