<template>
    <div class="main-container">
            <div class="lef-container">
                <div class="left-top-container">
                    <span class="title-container">
                        left-top
                    </span>     
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>
                        <span class="mosaic_name">Simple transfer</span>
                        <span class="add_button">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>
                    </div>
                     <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>
                        <span class="mosaic_name">Mosaic transaction</span>
                        <span class="add_button">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>                    </div>
                     <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>
                        <span class="mosaic_name">Namespace transaction</span>
                        <span class="add_button">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>                    </div>
                     <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>
                        <span class="mosaic_name">Multisignature transaction</span>
                        <span class="add_button">
                            <img src="@/views/resources/img/symbol/XYMCoin.png" alt />
                        </span>                    </div>
                </div>
                <div class="left-bottom-container">
                    <span class="title-container">
                        left-bottom
                    </span>  
                </div>
            </div>
            <div class="right-container">
                <span class="title-container">
                    right
                </span>
            </div>
    </div>
</template>


<!--<template>
    <div class="main-container">
        <div class="inner-container">
            <div class="top-container">
                <span class="page-title">
                    {{ $t('latest_news_articles') }}
                </span>
            </div>
            <div class="bottom-container">
                <AggregateTransaction />
            </div>
        </div>
    </div>
</template>-->

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
