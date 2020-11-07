<template>
    <div :class="['symbol-tab-container', direction === 'horizontal' ? 'horizontal' : 'vertical']">
    	<!--TODO: Put an if-condition to this div: if call from settings then div else nothing-->
    	<div class="header-container">
    		<span class="title-style">{{$t('sidebar_item_settings')}}</span>
    	</div>
        <div v-for="(item, index) in items" :key="index" @click="$emit('selected', index)">
            <div :class="['symbol-tab-nav', index === currentItemIndex ? 'active-item' : 'inactive-item']">	
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
