<template>
    <div class="top_network_info radius">
        <div class="top_account_info">
            <!-- harvesting is conditional -->
            <div v-if="isHarvestingEnabled" class="xym-outline account-info-tile">
                <div class="title">
                    <span class="title_txt">{{ $t('harvesting') }}</span>
                </div>
                <img :src="officialIcons.harvest" />
                <div class="txt_info">
                    <button
                        class="centered-button button-style validation-button submit-button"
                        @click="isHarvestingWizardDisplayed = !isHarvestingWizardDisplayed"
                    >
                        {{ $t('show_wizard') }}
                    </button>
                </div>
            </div>

            <div v-else class="xym-outline account-info-tile">
                <div class="title">
                    <span class="title_txt">{{ $t('accounts') }}</span>
                </div>
                <img src="@/views/resources/img/monitor/peer_number.png" />
                <span class="txt_info">
                    {{ countAccounts }}
                </span>
            </div>
            <!-- end conditional -->

            <div class="xym-outline account-info-tile">
                <div class="title">
                    <span class="title_txt">{{ $t('chain_height') }}</span>
                </div>
                <img src="@/views/resources/img/monitor/height.png" />
                <span class="txt_info">
                    {{ currentHeight }}
                </span>
            </div>

            <div class="xym-outline account-info-tile">
                <div class="title">
                    <span class="title_txt">{{ $t('transactions') }}</span>
                </div>
                <img src="@/views/resources/img/monitor/speed.png" />
                <span class="txt_info speed"> {{ countTransactions }} </span>
            </div>

            <div class="xym-outline account-info-tile">
                <div class="title">
                    <span class="title_txt">{{ $t('peers_number') }}</span>
                </div>
                <img src="@/views/resources/img/monitor/peer.png" />
                <span class="txt_info">
                    {{ countNodes }}
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
import { NetworkStatisticsPanelTs } from './NetworkStatisticsPanelTs';
export default class NetworkStatisticsPanel extends NetworkStatisticsPanelTs {}
</script>
<style lang="less" scoped>
@import './NetworkStatisticsPanel.less';
</style>
