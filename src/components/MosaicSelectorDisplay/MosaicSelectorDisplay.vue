<template>
  <ValidationProvider
    v-slot="{ errors }"
    vid="selectedMosaic"
    :name="$t(label)"
    :rules="'required'"
    tag="div"
    class="mosaic-selector-display-wrapper"
  >
    <ErrorTooltip :errors="errors">
      <Select
        v-model="selectedMosaic"
        v-focus
        class="select-size select-style"
      >
        <Option 
          v-for="m in displayedMosaics"
          :key="m.getIdentifier()"
          :value="m.getIdentifier()"
        >
          {{ m.values.get('name') !== '' ? m.values.get('name') : m.values.get('hexId') }} 
        </Option>
      </Select>
    </ErrorTooltip>
  </ValidationProvider>
</template>

<script lang="ts">
import {MosaicSelectorDisplayTs} from './MosaicSelectorDisplayTs'
import './MosaicSelectorDisplay.less'
export default class MosaicSelectorDisplay extends MosaicSelectorDisplayTs {}
</script>
