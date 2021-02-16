<template>
    <div class="wrap">
        <div style="display: flex; width: 100%; height: 100%;">
            <div class="general_view" style="width: 100%;">
                <div class="top_window level">
                    <div class="level-left"></div>
                    <div class="level-right"></div>
                </div>
                <transition name="fade" mode="out-in">
                    <div class="main-outer-container">
                        <div class="page-wrapper">
                            <router-view />
                        </div>
                    </div>
                </transition>
                <div class="footer">
                    <span class="footer-phrase">{{ $t('copyright') }}</span>
                </div>
            </div>
        </div>
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
