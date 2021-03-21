<template>
    <FormRow class-name="emphasis" style="margin-bottom: 0.3rem;">
        <template v-slot:label> {{ $t('transfer_target') }}: </template>
        <template v-slot:inputs>
            <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="recipient"
                :name="$t('recipient')"
                :rules="`${validationRules.addressOrAlias}|addressOrAliasNetworkType:${networkType}`"
                tag="div"
                class="inputs-container"
            >
                <ErrorTooltip :errors="errors">
                    <AccountAutoCompleteInput
                        v-model="rawValue"
                        placeholder="placeholder_address_or_alias"
                        :disabled="disabled"
                        :autocomplete-popup-max-width-in-rem="autocompletePopupMaxWidthInRem"
                    />
                </ErrorTooltip>
            </ValidationProvider>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { RecipientInputTs } from './RecipientInputTs';
export default class RecipientInput extends RecipientInputTs {}
</script>
