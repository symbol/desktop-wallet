<template>
    <div class="top_harvesting_info">
        <div class="top_account_info">
            <div class="remote-status">
                <div class="title">
                    <span class="title_txt">Remote status</span>
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div class="status-indicator green"></div>
                        </div>
                        <div class="level-item txt-small">Connected</div>
                    </div>
                </div>
            </div>

            <div class="harvesting-status">
                <div class="title">
                    <span class="title_txt">Harvesting status</span>
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div class="status-indicator green"></div>
                        </div>
                        <div class="level-item txt-small">Connected</div>
                    </div>
                </div>
            </div>

            <div class="made-blocks">
                <div class="title">
                    <span class="title_txt">Blocks made</span>
                </div>
                <span class="txt_info">
                    N/A
                </span>
            </div>

            <div class="collected-fees">
                <div class="title">
                    <span class="title_txt">Fees collected</span>
                </div>
                <span class="txt_info">
                    N/A
                </span>
            </div>
        </div>

        <ModalHarvestingWizard
            v-if="isHarvestingWizardDisplayed"
            :visible="isHarvestingWizardDisplayed"
            @close="isHarvestingWizardDisplayed = false"
        />
    </div>
</template>

<script lang="ts">
import { HarvestStatisticsPanelTs } from './HarvestStatisticsPanelTs';
export default class HarvestStatisticsPanel extends HarvestStatisticsPanelTs {}
</script>
<style lang="less" scoped>
@import './HarvestStatisticsPanel.less';
</style>
