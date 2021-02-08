<template>
    <div class="copy-button-container" :class="{ 'font-size-zero': type !== 'button' }" @click="copyToClipboard">
        <slot v-if="type === 'button'">
            <Button type="text">
                {{ $t('mnemonic_copy') }}
            </Button>
        </slot>
        <Tooltip v-else-if="type === 'icon-black'" :content="$t(tooltipText)" placement="right">
            <img src="@/views/resources/img/account/cloneIcon.svg" class="icon" />
        </Tooltip>
        <Tooltip v-else-if="type === 'icon-white'" :content="$t(tooltipText)" placement="right">
            <img src="@/views/resources/img/account/cloneIcon_white.svg" class="icon" />
        </Tooltip>
        <Tooltip v-else-if="type === 'icon-gray'" :content="$t(tooltipText)" placement="right">
            <img src="@/views/resources/img/account/cloneIcon_gray.svg" class="icon" />
        </Tooltip>
    </div>
</template>
<script lang="ts">
import { ButtonCopyToClipboardTs } from './ButtonCopyToClipboardTs';
export default class ButtonCopyToClipboard extends ButtonCopyToClipboardTs {}
</script>
<style lang="less" scoped>
@import './ButtonCopyToClipboard.less';
</style>
