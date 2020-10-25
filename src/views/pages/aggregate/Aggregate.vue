<template>
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
