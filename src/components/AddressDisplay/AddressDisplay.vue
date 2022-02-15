<template>
    <Poptip v-if="allowExplorerLink" trigger="hover">
        {{ descriptor }}
        <div slot="content">
            <div slot="title" class="address">
                {{ $t('address') }}: <span class="address-value"> {{ rawAddress }} </span>
            </div>
            <a class="link" target="_blank" :href="explorerUrl">{{ $t('accounts_view_explorer_description') }}</a>
        </div>
    </Poptip>
    
    <span v-else>{{ descriptor }}</span>
</template>

<script lang="ts">
import { AddressDisplayTs } from './AddressDisplayTs';
import './AddressDisplay.less';

export default class AddressDisplay extends AddressDisplayTs {}
</script>
