<template>
    <div class="table-container">
        <Table
            :loading="isFetchingHarvestedBlocks"
            height="900"
            :columns="columns"
            :data="blockList"
            :no-data-text="$t('no_harvested_blocks_yet')"
        />

        <div class="table-footer-container">
            <Pagination page-size="pageSize" :current="pageInfo.pageNumber" :last-page="pageInfo.isLastPage" @targetPage="onPageChange" />
        </div>
    </div>
</template>

<script lang="ts">
import HarvestedBlocksListTs from './HarvestedBlocksListTs';
export default class HarvestedBlocksList extends HarvestedBlocksListTs {}
</script>

<style lang="less" scoped>
@import './HarvestedBlocksList.less';
</style>
