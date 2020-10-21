<template>
    <div class="settings-container">
        <Icon type="ios-settings" class="pointer" @click="toggleSettings" />
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
