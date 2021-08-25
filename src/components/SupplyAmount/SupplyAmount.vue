<template>
    <FormRow>
        <template v-slot:label> {{ $t(label) }}: </template>
        <template v-slot:inputs>
            <div class="display-value">
                {{ relativeValue }}
            </div>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { SupplyAmountTs } from './SupplyAmountTs';
export default class SupplyAmount extends SupplyAmountTs {}
</script>
