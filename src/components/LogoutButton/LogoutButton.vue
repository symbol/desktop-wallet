<template>
    <div class="logout-container">
        <a class="logout-link" @click="logout">
            <Icon type="md-log-out" />
            <span>{{ $t('logout') }}</span>
        </a>
    </div>
</template>
<script lang="ts">
import { LogoutButtonTs } from './LogoutButtonTs';
export default class LogoutButton extends LogoutButtonTs {}
</script>
<style lang="less" scoped>
@import './LogoutButton.less';
</style>
