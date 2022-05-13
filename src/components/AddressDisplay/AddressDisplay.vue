<template>
    <a v-if="allowExplorerLink && descriptor === rawAddress" class="address-display link" target="_blank" :href="explorerUrl">
        <span v-if="isAddressBlocked" class="blocked-tag">{{ $t('blocked_address_label') }}</span>
        <span>{{ descriptor }}</span>
    </a>
    <Tooltip v-else-if="allowExplorerLink" :content="rawAddress" placement="right">
        <a class="address-display link" target="_blank" :href="explorerUrl">
            <span v-if="isAddressBlocked" class="blocked-tag">{{ $t('blocked_address_label') }}</span>
            <span>{{ descriptor }}</span>
        </a>
    </Tooltip>
    <span v-else class="address-display">
        <span v-if="isAddressBlocked" class="blocked-tag">{{ $t('blocked_address_label') }}</span>
        <span>{{ descriptor }}</span>
    </span>
</template>

<script lang="ts">
import { AddressDisplayTs } from './AddressDisplayTs';
import './AddressDisplay.less';

export default class AddressDisplay extends AddressDisplayTs {}
</script>
