<template>
    <div :class="['symbol-tab-container', direction === 'horizontal' ? 'horizontal' : 'vertical']">
        <div v-for="(item, index) in items" :key="index" @click="$emit('selected', index)">
            <div class="symbol-tab-nav">
                <span :class="['nav-item', index === currentItemIndex ? 'active-item' : 'inactive-item']">{{
                    $t('settings_tab_' + item.toLowerCase())
                }}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { NavigationLinksTs } from './NavigationLinksTs';
export default class NavigationLinks extends NavigationLinksTs {}
</script>

<style lang="less" scoped>
@import './NavigationLinks.less';
</style>
