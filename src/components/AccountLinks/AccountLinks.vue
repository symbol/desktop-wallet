<template>
    <div>
        <slot name="trigger">
            <img class="navbar-icon" :src="icon" />
            <a class="trigger-accountlink pointer" :href="link" target="_blank">
                {{ title }}
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
