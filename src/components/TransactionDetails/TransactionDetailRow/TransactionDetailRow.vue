<template>
    <div class="transaction-row-inner-container">
        <div class="transaction-details-row-label-container">
            <span> {{ $t(label) }}: </span>
        </div>
        <div class="transaction-details-row-value-container value-with-copy">
            <div class="value-content">
                <span v-if="label === 'hash' || label === 'inner_transaction_hash'">
                    <a class="url_text" target="_blank" :href="explorerUrl">{{ item.value }}</a>
                </span>
                <span v-else-if="item.isMosaic">
                    <MosaicAmountDisplay
                        :id="item.value.id"
                        :color="item.value.color"
                        :absolute-amount="item.value.amount"
                        :show-ticker="true"
                    />
                </span>
                <span v-else-if="item.isPaidFee">
                    <PaidFeeDisplay :transaction="item.value" />
                </span>
                <span v-else-if="item.isAddress">
                    <AddressDisplay :address="item.value" :show-address="false" :allow-explorer-link="true" />
                </span>
                <span v-else-if="item.isMessage">
                    <MessageDisplay
                        :message="item.value.message"
                        :incoming="item.value.incoming"
                        :recipient="item.value.recipient"
                        :unannounced="item.value.unannounced"
                        :signer="item.value.signer"
                    />
                </span>
                <span v-else>{{ item.value }}</span>
            </div>
            <span v-if="shouldShowCopyButton" class="copy-button-right">
                <Tooltip :content="$t(copyTooltipText)" placement="right" transfer>
                    <img
                        src="@/views/resources/img/account/cloneIcon.svg"
                        class="copy-icon"
                        @click="handleCopy"
                    />
                </Tooltip>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
// @ts-ignore
import AddressDisplay from '@/components/AddressDisplay/AddressDisplay.vue';
// @ts-ignore
import PaidFeeDisplay from '@/components/PaidFeeDisplay/PaidFeeDisplay.vue';
// @ts-ignore
import MessageDisplay from '@/components/MessageDisplay/MessageDisplay.vue';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';
import { NetworkType } from 'symbol-sdk';
import { networkConfig } from '@/config';
import { NotificationType } from '@/core/utils/NotificationType';
// @ts-ignore
import { Tooltip } from 'view-design';

@Component({
    components: { MosaicAmountDisplay, AddressDisplay, PaidFeeDisplay, MessageDisplay, Tooltip },
    computed: mapGetters({ networkType: 'network/networkType' }),
})
export default class TransactionDetailRow extends Vue {
    @Prop({ required: true }) item: TransactionDetailItem;
    private networkType: NetworkType;
    private get label(): string {
        return (this.item && this.item.key) || '';
    }
    /**
     * Returns the explorer url
     */
    public get explorerUrl() {
        return networkConfig[this.networkType].explorerUrl.replace(/\/+$/, '') + '/transactions/' + this.item.value;
    }
    /**
     * Returns whether the copy button should be shown
     */
    private get shouldShowCopyButton(): boolean {
        const copyableLabels = ['hash', 'sender', 'inner_transaction_hash'];
        return copyableLabels.includes(this.label) && this.item.value != null && this.item.value !== '';
    }
    /**
     * Returns the value to copy to clipboard
     */
    private get copyValue(): string {
        return String(this.item.value);
    }
    /**
     * Returns the tooltip translation key for the copy button
     */
    private get copyTooltipText(): string {
        const tooltipMap: { [key: string]: string } = {
            'hash': 'copy',
            'sender': 'copy',
            'inner_transaction_hash': 'copy'
        };
        return tooltipMap[this.label] || 'copy';
    }
    /**
     * Handles copy to clipboard
     */
    private async handleCopy(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.copyValue);
            this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.COPY_SUCCESS);
        } catch (error) {
            this.$store.dispatch('notification/ADD_ERROR', NotificationType.COPY_FAILED);
        }
    }
}
</script>

<style lang="less" scoped>
/* @TODO TransactionDetails.less shouldn't be here */
@import '../TransactionDetails.less';

.value-with-copy {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.value-content {
    flex: 1;
    overflow: hidden;
    word-break: break-word;
}

.copy-button-right {
    flex-shrink: 0;
    margin-left: 8px;
    cursor: pointer;
}

.copy-icon {
    height: 0.16rem;
    width: 0.16rem;
    display: inline-block;
    vertical-align: middle;
}
</style>
