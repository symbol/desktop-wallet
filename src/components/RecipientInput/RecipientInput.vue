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
                    <input
                        v-model="rawValue"
                        v-focus
                        class="input-size input-style"
                        :placeholder="$t('placeholder_address_or_alias')"
                        type="text"
                        :disabled="disabled"
                    />
                </ErrorTooltip>
                <div v-if="!disabled && addressBook && addressBook.getAllContacts().length > 0" style="text-align: right; margin-top: 5px;">
                    <ContactSelector @change="onSelectContact" />
                </div>
            </ValidationProvider>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { RecipientInputTs } from './RecipientInputTs';
export default class RecipientInput extends RecipientInputTs {}
</script>
