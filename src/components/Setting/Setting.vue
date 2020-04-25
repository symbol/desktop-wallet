<template>
  <div class="setting-container">
    <Icon type="ios-settings" @click="toggleSetting" />
    <ModalSetting :visible="isShowModal" @close="onClose" />
  </div>
</template>
<script lang="ts">
import { SettingTs } from './SettingTs'
export default class Setting extends SettingTs { }
</script>
<style lang="less" scoped>
  @import './Setting.less';
</style>
