<template>
  <div>
    <FormRow>
      <template v-slot:label> {{ $t('current_rental_fee') }}: </template>
      <template v-slot:inputs>
        <div class="inputs-container display-grid">
          <div class="display-value">
            <MosaicAmountDisplay :absolute-amount="rentalFeeAmount" :color="'red'" :show-ticker="true" />
          </div>
        </div>
      </template>
    </FormRow>
  </div>
</template>
<script lang="ts">
import { RentalFeeTs } from './RentalFeeTs'
export default class RentalFee extends RentalFeeTs {}
</script>
