<template>
    <div class="main-container">
        <div class="lef-container">
            <div class="left-top-container">
                <div class="title-container">
                    <span class="title-style">
                        left-top
                    </span>
                </div>
                <!--- TODO: ADD onClick Action to all add_button-->
                <div class="transaction-type-container">
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/transactions.svg" alt />
                        </span>
                        <span class="mosaic_name">Simple transfer</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/mosaic.svg" alt />
                        </span>
                        <span class="mosaic_name">Mosaic transaction</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/namespace.svg" alt />
                        </span>
                        <span class="mosaic_name">Namespace transaction</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/multisig.svg" alt />
                        </span>
                        <span class="mosaic_name">Multisignature transaction</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                </div>
            </div>
            <div class="left-bottom-container">
                <div class="title-container">
                    <span class="title-style">
                        left-bottom
                    </span>
                </div>
                <!-- TODO: DYNAMIC TRANSACTION LIST & REMOVE onClick Action to all remove_button -->
                <div class="transaction-list-container">
                    <div class="transfer_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/transactions.svg" alt />
                        </span>
                        <span class="transfer_name">asdfdsagfdga</span>
                        <button class="remove_button">
                            <img src="@/views/resources/img/icons/bin.svg" alt />
                        </button>
                    </div>
                </div>
                <div class="bottom-container">
                    <button class="inverted-button pl-2 pr-2" style="cursor: pointer;">
                        {{ $t('aggregate_send') }}
                    </button>
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="title-container">
                <span class="title-style">
                    right
                </span>
                <div class="transaction-form">
                    <div>
                        <!-- TODO: TRANSFER FORM GOES HERE Same as Dashboard Transfer-->
                        <AggregateTransaction />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
// child components
import AggregateTransaction from './aggregateTransaction/AggregateTransaction.vue';
@Component({ components: { AggregateTransaction } })
export default class Community extends Vue {}
</script>

<style lang="less" scoped>
@import './Aggregate.less';
</style>
