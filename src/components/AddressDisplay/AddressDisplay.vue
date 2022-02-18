<template>
    <a v-if="allowExplorerLink && descriptor === rawAddress" class="link" target="_blank" :href="explorerUrl">
        {{ descriptor }}
    </a>
    <Tooltip v-else-if="allowExplorerLink" :content="rawAddress" placement="right">
        <a class="link" target="_blank" :href="explorerUrl">
            {{ descriptor }}
        </a>
    </Tooltip>
    <span v-else>{{ descriptor }}</span>
</template>

<script lang="ts">
import { AddressDisplayTs } from './AddressDisplayTs';
import './AddressDisplay.less';

export default class AddressDisplay extends AddressDisplayTs {}
</script>
