<template>
    <a v-if="allowExplorerLink" target="_blank" :href="explorerUrl">{{ descriptor }}</a>
    <span v-else>{{ descriptor }}</span>
</template>

<script lang="ts">
import { AddressDisplayTs } from './AddressDisplayTs';

export default class AddressDisplay extends AddressDisplayTs {}
</script>
