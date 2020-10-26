<template>
    <div class="left-navigator">
        <div class="logo-container">
            <img class="logo-img" src="@/views/resources/symbol_logo.png" />
        </div>
        <div class="navigator-items-container">
            <div
                v-for="(route, index) in $router.getRoutes()"
                :key="index"
                :class="[
                    'navigator-item-container',
                    $route.matched.map(({ path }) => path).includes(route.path) ? 'active' : '',
                    !currentProfile ? 'un_click' : '',
                ]"
                @click="onPageNavigate(route)"
            >
                <div class="navigator-icon-container">
                    <img :src="route.meta.icon" class="navigator-icon" />
                </div>
                <div class="navigator-text-container">
                    <div>{{ $t(route.meta.title) }}</div>
                </div>
            </div>
        </div>
        <div class="network-container">
            <PeerSelector />
        </div>
    </div>
</template>

<script lang="ts">
import { PageNavigatorTs } from './PageNavigatorTs';
import { Component } from 'vue-property-decorator';
import PeerSelector from '@/components/PeerSelector/PeerSelector.vue';
// @ts-ignore
@Component({
    components: { PeerSelector },
})
export default class PageNavigator extends PageNavigatorTs {}
</script>
<style lang="less" scoped>
@import './PageNavigator.less';
</style>
