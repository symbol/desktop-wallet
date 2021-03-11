<template>
    <div class="settings-container">
        <a class="settings-link" @click="toggleSettings">
            <img :src="settingsIcon" class="setting-menu-icon" />
            <span>{{ $t('settings') }}</span>
        </a>
        <ModalSettings v-if="isSettingsVisible" :visible="isSettingsVisible" @close="toggleSettings" />
    </div>
</template>
<script lang="ts">
import { SettingsTs } from './SettingsTs';
export default class Settings extends SettingsTs {}
</script>
<style lang="less" scoped>
@import './Settings.less';
</style>
