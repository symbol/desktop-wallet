<template>
    <div class="top_harvesting_info">
        <div class="top_account_info">
            <div class="harvesting-status">
                <div class="title">
                    <span class="title_txt">{{ $t('harvesting_status') }}</span>
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div :class="harvestingStatusIndicator.cls"></div>
                        </div>
                        <div class="level-item txt-small">{{ harvestingStatusIndicator.text }}</div>
                    </div>
                </div>
            </div>

            <div class="made-blocks">
                <div class="title">
                    <span class="title_txt">{{ $t('blocks_made') }}</span>
                </div>
                <div class="txt_info">
                    <Spin
                        v-if="isFetchingHarvestedBlockStats"
                        v-show="isFetchingHarvestedBlockStats"
                        class="inline-spin"
                        size="small"
                    ></Spin>

                    <span v-if="!isFetchingHarvestedBlockStats">
                        {{ harvestedBlockStats.totalBlockCount }}
                    </span>
                </div>
            </div>

            <div class="collected-fees">
                <div class="title">
                    <span class="title_txt">{{ $t('fees_collected') }}</span>
                </div>
                <span class="txt_info">
                    <Spin
                        v-if="isFetchingHarvestedBlockStats"
                        v-show="isFetchingHarvestedBlockStats"
                        class="inline-spin"
                        size="small"
                    ></Spin>

                    <span v-if="!isFetchingHarvestedBlockStats">
                        {{ totalFeesEarned }}
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { HarvestStatisticsPanelTs } from './HarvestStatisticsPanelTs';
export default class HarvestStatisticsPanel extends HarvestStatisticsPanelTs {}
</script>
<style lang="less" scoped>
@import './HarvestStatisticsPanel.less';
</style>
