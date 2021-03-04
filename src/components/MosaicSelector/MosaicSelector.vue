<template>
    <ValidationProvider v-slot="{ errors }" vid="selectedMosaic" :name="$t(label)" :rules="'required'" tag="div" class="select-container">
        <ErrorTooltip :errors="errors">
            <Select v-model="selectedMosaic" v-focus :disabled="disabled" class="select-size select-style">
                <Option v-for="m in displayedMosaics" :key="m.mosaicIdHex" :value="m.mosaicIdHex">
                    {{ m.name || m.mosaicIdHex }}
                </Option>
            </Select>
        </ErrorTooltip>
    </ValidationProvider>
</template>

<script lang="ts">
import { MosaicSelectorTs } from './MosaicSelectorTs';

export default class MosaicSelector extends MosaicSelectorTs {}
</script>
