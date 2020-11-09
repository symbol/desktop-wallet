<template>
    <div :class="['symbol-tab-container', direction === 'horizontal' ? 'horizontal' : 'vertical']">
        <div
            v-for="(item, index) in items"
            :key="index"
            :class="
                direction === 'horizontal' ? ['empty'] : ['symbol-tab-nav', index === currentItemIndex ? 'active-item' : 'inactive-item']
            "
        >
            <span
                :class="['nav-item', index === currentItemIndex ? 'active-item' : 'inactive-item', index === 0 ? '' : 'border']"
                @click="$emit('selected', index)"
            >
                {{ $t(translationPrefix + item.toLowerCase()) }}
            </span>
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
