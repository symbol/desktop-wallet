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
import { AccountInfo } from 'symbol-sdk';
// internal dependencies
import { mapGetters } from 'vuex';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';

@Component({
    computed: {
        ...mapGetters({
            accountsInfo: 'account/accountsInfo',
            networkCurrency: 'mosaic/networkCurrency',
            networkConfiguration: 'network/networkConfiguration',
        }),
    },
})
export class ImportanceScoreDisplayTs extends Vue {
    @Prop({
        default: null,
    })
    address: string;

    private accountsInfo: AccountInfo[];
    private networkCurrency: NetworkCurrencyModel;
    private networkConfiguration: NetworkConfigurationModel;

    /// region computed properties getter/setter
    get score(): string {
        const accountInfo = this.accountsInfo.find((k) => k.address.plain() === this.address);
        if (!accountInfo) {
            return '0 %';
        }

        if (!this.networkCurrency?.divisibility || !this.networkConfiguration?.totalChainImportance) {
            return 'N/A';
        }

        const importance = accountInfo.importance.compact();

        const relativeImportance = importance > 0 ? importance / this.networkConfiguration.totalChainImportance : importance;

        const divisibility = this.networkCurrency.divisibility;
        const formatOptions: Intl.NumberFormatOptions = {
            maximumFractionDigits: divisibility,
            style: 'percent',
        };
        return relativeImportance.toLocaleString(undefined, formatOptions);
    }

    /// end-region computed properties getter/setter
}
