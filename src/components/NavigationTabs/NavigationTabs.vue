<template>
    <div :class="[direction === 'horizontal' ? 'tabs' : '', direction]">
        <span
            v-for="(tabEntry, index) in tabEntries"
            :key="index"
            :class="['tab-item', tabEntry.isActive($route) ? 'active' : '']"
            @click="tabEntry.isActive($route) ? '' : $router.push({ name: tabEntry.route }).catch((err) => {})"
        >
            <img v-if="tabEntry.icon" class="tab-icon" :src="tabEntry.icon" />
            <div class="tab-title">
                {{ $t(tabEntry.title) }}
            </div>
        </span>
    </div>
</template>

<script lang="ts">
import { NavigationTabsTs } from './NavigationTabsTs';

export default class NavigationTabs extends NavigationTabsTs {}
</script>

<style lang="less" scoped>
@import './NavigationTabs.less';
</style>
