<template>
    <div :class="['symbol-tab-container', direction === 'horizontal' ? 'horizontal' : 'vertical']">
        <span
            v-for="(item, index) in items"
            :key="index"
            :class="['nav-item', index === currentItemIndex ? 'active-item' : 'inactive-item']"
            @click="$emit('selected', index)"
        >
            {{ $t(translationPrefix + item.toLowerCase()) }}
        </span>
    </div>
</template>
<script lang="ts">
import { NavigationLinksTs } from './NavigationLinksTs';
export default class NavigationLinks extends NavigationLinksTs {}
</script>

<style lang="less" scoped>
@import './NavigationLinks.less';
</style>
