<template>
    <FormRow>
        <template v-slot:inputs>
            <ValidationObserver v-slot="{ handleSubmit }" slim>
                <ValidationProvider
                    v-slot="{ errors }"
                    vid="cosignatory"
                    :name="$t('cosignatory')"
                    :rules="`${validationRules.addressOrPublicKey}`"
                    tag="div"
                    class="row-cosignatory-action inputs-container"
                >
                    <div class="input-container">
                        <ErrorTooltip :errors="errors">
                            <AccountAutoCompleteInput
                                v-model="cosignatory"
                                placeholder="placeholder_address_or_public_key"
                                :autocomplete-popup-max-width-in-rem="7.2"
                                @input="stripTagsCosignatory"
                            />
                        </ErrorTooltip>
                    </div>
                    <ButtonAdd class="button-add align-right" @click="handleSubmit(onAddCosignatory())" />
                </ValidationProvider>
            </ValidationObserver>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { AddCosignatoryInputTs } from './AddCosignatoryInputTs';

export default class AddCosignatoryInput extends AddCosignatoryInputTs {}
</script>
