<template>
    <div class="page-wrapper">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class RouterPage extends Vue {}
</script>
<style lang="less" scoped>
@import './RouterPage.less';
</style>
