<template>
    <div>
        <slot name="trigger">
            <a class="trigger-accountlink pointer" :href="link" target="_blank">
                <img class="navbar-icon" :src="icon" />
                <span>{{ title }}</span>
            </a>
        </slot>
    </div>
</template>

<script lang="ts">
import { AccountLinksTs } from './AccountLinksTs';

export default class AccountLinks extends AccountLinksTs {}
</script>

<style lang="less" scoped>
@import './AccountLinks.less';
</style>
