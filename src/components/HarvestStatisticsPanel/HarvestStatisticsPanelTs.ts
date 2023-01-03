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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { AccountInfo } from 'symbol-sdk';
import {
    HarvestedBlockStats,
    HarvestingStatus,
    HARVESTING_BLOCKS_POLLING_INTERVAL_SECS,
    HARVESTING_STATUS_POLLING_INTERVAL_SECS,
    HARVESTING_STATUS_POLLING_TRIAL_LIMIT,
} from '@/store/Harvesting';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
import { HarvestingService } from '@/services/HarvestingService';
import { HarvestingModel } from '@/core/database/entities/HarvestingModel';
import ButtonRefresh from '@/components/ButtonRefresh/ButtonRefresh.vue';

@Component({
    components: { ButtonRefresh },
    computed: {
        ...mapGetters({
            currentSignerAccountInfo: 'account/currentSignerAccountInfo',
            harvestingStatus: 'harvesting/status',
            harvestedBlockStats: 'harvesting/harvestedBlockStats',
            isFetchingHarvestedBlockStats: 'harvesting/isFetchingHarvestedBlockStats',
            pollingTrials: 'harvesting/pollingTrials',
            networkCurrency: 'mosaic/networkCurrency',
            currentSignerHarvestingModel: 'harvesting/currentSignerHarvestingModel',
        }),
    },
})
export class HarvestStatisticsPanelTs extends Vue {
    public currentSignerAccountInfo: AccountInfo;
    public harvestingStatus: HarvestingStatus;
    public harvestedBlockStats: HarvestedBlockStats;
    public isFetchingHarvestedBlockStats: boolean;
    public networkCurrency: NetworkCurrencyModel;

    private pollingTrials: number;
    private statusPollingInterval: any;
    private statsPollingInterval: any;
    private currentSignerHarvestingModel: HarvestingModel;
    created() {
        this.refresh();
        this.refreshHarvestingStatusOnInterval();
        this.refreshHarvestingBlocksOnInterval();
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
            case HarvestingStatus.FAILED:
                return { cls: 'status-indicator red', text: this.$t('harvesting_status_failed') };
        }
    }

    private refreshHarvestingStatusOnInterval(pollingIntervalMs = HARVESTING_STATUS_POLLING_INTERVAL_SECS * 1000): void {
        Vue.nextTick(() => {
            const harvestingService = new HarvestingService();
            if (this.harvestingStatus !== HarvestingStatus.FAILED) {
                this.statusPollingInterval = setInterval(() => {
                    if (this.harvestingStatus === HarvestingStatus.INPROGRESS_ACTIVATION) {
                        if (
                            this.pollingTrials < HARVESTING_STATUS_POLLING_TRIAL_LIMIT &&
                            !this.currentSignerHarvestingModel.delegatedHarvestingRequestFailed
                        ) {
                            this.refreshHarvestingStatus();
                            this.$store.dispatch('harvesting/SET_POLLING_TRIALS', this.pollingTrials + 1);
                        } else {
                            const harvestingModel = harvestingService.getHarvestingModel(this.currentSignerHarvestingModel.accountAddress);
                            harvestingService.updateDelegatedHarvestingRequestFailed(harvestingModel, true);
                            return;
                        }
                    }
                }, pollingIntervalMs);
            } else {
                const harvestingModel = harvestingService.getHarvestingModel(this.currentSignerHarvestingModel.accountAddress);
                harvestingService.updateDelegatedHarvestingRequestFailed(harvestingModel, true);
                return;
            }
        });
    }

    private refreshHarvestingBlocksOnInterval(pollingIntervalMs = HARVESTING_BLOCKS_POLLING_INTERVAL_SECS * 1000): void {
        Vue.nextTick(() => {
            this.statsPollingInterval = setInterval(() => {
                if (this.harvestingStatus == HarvestingStatus.ACTIVE) {
                    this.refreshHarvestingStats();
                }
            }, pollingIntervalMs);
        });
    }

    destroyed() {
        clearInterval(this.statusPollingInterval);
        clearInterval(this.statsPollingInterval);
    }

    public get totalFeesEarned(): string {
        const relativeAmount = this.harvestedBlockStats.totalFeesEarned.compact() / Math.pow(10, this.networkCurrency.divisibility);
        if (relativeAmount === 0) {
            return '0';
        }
        return relativeAmount.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: this.networkCurrency.divisibility,
        });
    }

    @Watch('currentSignerAccountInfo')
    public refreshWatcher() {
        this.refresh();
    }
}
