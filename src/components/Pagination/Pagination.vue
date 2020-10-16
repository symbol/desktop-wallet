<template>
    <ul :class="simpleWrapClasses">
        <li :class="prevCls" @click="prev">
            <a><i class="ivu-icon ivu-icon-ios-arrow-back"></i></a>
        </li>
        <div :class="simplePagerClasses" :title="currentPage">
            <input type="text" :value="currentPage" autocomplete="off" spellcheck="false" @keyup="keyUp" @keydown="keyDown" />
        </div>
        <li :class="nextCls" @click="next">
            <a><i class="ivu-icon ivu-icon-ios-arrow-forward"></i></a>
        </li>
    </ul>
</template>

<script lang="ts">
import PaginationTs from './PaginationTs';

export default class Pagination extends PaginationTs {}
</script>

<style lang="less" scoped>
@import './Pagination.less';
</style>
