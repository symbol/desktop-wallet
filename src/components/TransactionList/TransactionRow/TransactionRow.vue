<template>
    <div class="transaction-row-container transaction-row-columns" @click="$emit('click', transaction)">
        <!-- FIRST COLUMN -->
        <div class="icon-cell">
            <img :src="getIcon()" class="icon-cell-image" />
        </div>

        <!-- SECOND COLUMN -->
        <div class="address-cell">
            <ActionDisplay :transaction="transaction" :is-optin-payout-transaction="isOptinPayoutTransaction" />
        </div>

        <!-- THIRD COLUMN -->
        <div class="amount-cell">
            <div v-if="hasNonNativeMosaic() || hasNetworkMosaic()">
                <MosaicAmountDisplay
                    v-if="hasNetworkMosaic()"
                    :id="getAmountMosaicId()"
                    :absolute-amount="getAmount()"
                    :color="getAmountColor()"
                    :show-ticker="isAmountShowTicker()"
                />

                <!-- Mosaic icon for non native mosaics. -->
                <div v-if="hasNonNativeMosaic()" class="extend-icon-holder">
                    <Tooltip placement="right">
                        <img :src="getMosaicsIcon()" />
                        <div slot="content">
                            <!-- allow top 5 mosaics show in the tooltip -->
                            <div v-for="mosaic in nonNativeMosaicList().slice(0, numberOfShowMosicsTooltips)" :key="mosaic.id">
                                {{ mosaic.name }} - {{ mosaic.relativeAmount }}
                            </div>

                            <div v-if="nonNativeMosaicList().length - numberOfShowMosicsTooltips > 0">
                                {{ $t('tooltip_mosaic_view_more', { count: nonNativeMosaicList().length - numberOfShowMosicsTooltips }) }}
                            </div>
                        </div>
                    </Tooltip>
                </div>

                <!-- Message icon on transaction list -->
                <div v-if="hasMessage()" class="extend-icon-holder">
                    <Tooltip placement="right">
                        <img :src="getEnvelopeIcon()" />
                        <div slot="content">
                            {{ messagePayload }}
                        </div>
                    </Tooltip>
                </div>
            </div>

            <span v-else>N/A</span>
        </div>

        <!-- FOURTH COLUMN -->
        <div class="confirmation-cell">
            {{ getHeight() }}
            <Tooltip v-if="hasMissSignatures && !transactionSigningFlag" :content="$t('transaction_signed')" placement="top">
                <Icon type="md-done-all" size="17" class="coloring" />
            </Tooltip>
        </div>

        <!-- FIFTH COLUMN -->
        <div class="hash-cell">
            <!--
            <span class="hash-cell-transaction-hash">
                <a class="url_text" target="_blank" :href="explorerUrl">
                    {{ formatters.miniHash(transaction.transactionInfo.hash) }}
                </a>
            </span>
            -->
            <span class="hash-cell-time">
                <!-- @TODO: Should be transaction time instead of deadline -->
                {{ date }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionRowTs } from './TransactionRowTs';

export default class TransactionRow extends TransactionRowTs {}
</script>
