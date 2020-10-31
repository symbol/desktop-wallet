<template>
    <div class="main-container">
        <div class="lef-container">
            <div class="left-top-container">
                <div class="title-container">
                    <h1 class="title-style">
                        {{$t('transaction_type_title')}}
                    </h1>
                </div>
                <!--- TODO: ADD onClick Action to all add_button-->
                <div class="transaction-type-container">
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/transactions.svg" alt />
                        </span>
                        <span class="mosaic_name">{{$t('simple_transfer_type')}}</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/mosaic.svg" alt />
                        </span>
                        <span class="mosaic_name">{{$t('mosaic_transfer_type')}}</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/namespace.svg" alt />
                        </span>
                        <span class="mosaic_name">{{$t('namespace_transfer_type')}}</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/multisig.svg" alt />
                        </span>
                        <span class="mosaic_name">{{$t('multisignature_transfer_type')}}</span>
                        <button class="add_button">
                            <img src="@/views/resources/img/icons/add.svg" alt />
                        </button>
                    </div>
                </div>
            </div>
            <div class="left-bottom-container">
                <div class="title-container">
                    <h1 class="title-style">
                        {{$t('my_transaction_title')}}
                    </h1>
                </div>
                <!-- TODO: DYNAMIC TRANSACTION LIST & REMOVE onClick Action to all remove_button -->
                <div class="transaction-list-container">
                    <div class="transfer_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/transactions.svg" alt />
                        </span>
                        <span class="transfer_name">Simple transaction 1</span>
                        <button class="remove_button">
                            <img src="@/views/resources/img/icons/bin.svg" alt />
                        </button>
                    </div>
                    <div class="transfer_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/transactions.svg" alt />
                        </span>
                        <span class="transfer_name">Simple transaction 2</span>
                        <button class="remove_button">
                            <img src="@/views/resources/img/icons/bin.svg" alt />
                        </button>
                    </div>
                </div>
                <div class="bottom-container">
                    <button class="inverted-button padding-1" style="cursor: pointer;">
                        {{ $t('aggregate_send') }}
                    </button>
                </div>
            </div>
        </div>
        <div class="right-container">
        <!-- TODO: TRANSFER FORM GOES HERE Same as Dashboard Transfer
        <AggregateTransaction />-->
            <div class="title-container">
                <h1 class="title-style">
                    <!---->
                    Simple transaction 1
                </h1>
                <div class="transaction-form">
                    <div>
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
