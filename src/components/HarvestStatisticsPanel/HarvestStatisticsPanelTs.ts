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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { AccountInfo } from 'symbol-sdk';
import { HarvestedBlockStats, HarvestingStatus } from '@/store/Harvesting';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';

@Component({
    computed: {
        ...mapGetters({
            currentSignerAccountInfo: 'account/currentSignerAccountInfo',
            harvestingStatus: 'harvesting/status',
            harvestedBlockStats: 'harvesting/harvestedBlockStats',
            isFetchingHarvestedBlockStats: 'harvesting/isFetchingHarvestedBlockStats',
            networkCurrency: 'mosaic/networkCurrency',
        }),
    },
})
export class HarvestStatisticsPanelTs extends Vue {
    public currentSignerAccountInfo: AccountInfo;
    public harvestingStatus: HarvestingStatus;
    public harvestedBlockStats: HarvestedBlockStats;
    public isFetchingHarvestedBlockStats: boolean;
    public networkCurrency: NetworkCurrencyModel;

    created() {
        this.refresh();
    }

    public refresh() {
        this.refreshHarvestingStatus();
        this.refreshHarvestingStats();
    }

    public refreshHarvestingStats() {
        this.$store.dispatch('harvesting/LOAD_HARVESTED_BLOCKS_STATS');
    }

    public refreshHarvestingStatus() {
        this.$store.dispatch('harvesting/FETCH_STATUS');
    }

    public get harvestingStatusIndicator() {
        switch (this.harvestingStatus) {
            case HarvestingStatus.ACTIVE:
                return { cls: 'status-indicator green', text: this.$t('harvesting_status_active') };
            case HarvestingStatus.INACTIVE:
                return { cls: 'status-indicator red', text: this.$t('harvesting_status_inactive') };
            case HarvestingStatus.KEYS_LINKED:
                return { cls: 'status-indicator amber', text: this.$t('harvesting_status_keys_linked') };
            case HarvestingStatus.INPROGRESS_ACTIVATION:
                return { cls: 'status-indicator amber', text: this.$t('harvesting_status_inprogress_activation') };
            case HarvestingStatus.INPROGRESS_DEACTIVATION:
                return { cls: 'status-indicator amber', text: this.$t('harvesting_status_inprogress_deactivation') };
        }
    }

    public get totalFeesEarned() {
        return this.harvestedBlockStats.totalFeesEarned.compact() / Math.pow(10, this.networkCurrency.divisibility);
    }

    @Watch('currentSignerAccountInfo')
    public refreshWatcher() {
        this.refresh();
    }
}
