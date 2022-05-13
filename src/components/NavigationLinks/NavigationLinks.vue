<template>
    <div
        :class="[
            'symbol-tab-container',
            direction === 'horizontal'
                ? translationPrefix === 'tab_contact_'
                    ? ['horizontal', 'line', 'smaller-tab-offset']
                    : 'horizontal'
                : 'vertical',
        ]"
    >
        <div
            v-for="(item, index) in items"
            :key="index"
            :class="
                direction === 'horizontal' ? ['empty'] : ['symbol-tab-nav', index === currentItemIndex ? 'active-item' : 'inactive-item']
            "
        >
            <span
                :class="[
                    'nav-item',
                    index === currentItemIndex ? activeLinkCssClass : inactiveLinkCssClass,
                    index === 0 ? '' : borderCssClass,
                ]"
                @click="$emit('selected', index)"
            >
                <p :class="index === currentItemIndex ? activeBorder : inActiveBorder">{{ $t(translationPrefix + item.toLowerCase()) }}</p>
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
