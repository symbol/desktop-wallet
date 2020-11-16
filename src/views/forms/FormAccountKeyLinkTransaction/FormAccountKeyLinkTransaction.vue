<template>
    <div>
        {{ $t('proxy_settings') }}
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <MaxFeeAndSubmit v-model="formItems.maxFee" @button-clicked="handleSubmit(onSubmit)" />
                </form>
            </ValidationObserver>
        </FormWrapper>
        <ModalTransactionConfirmation
            v-if="hasConfirmationModal"
            :visible="hasConfirmationModal"
            @success="onConfirmationSuccess"
            @error="onConfirmationError"
            @close="onConfirmationCancel"
        />
    </div>
</template>

<script lang="ts">
import { FormAccountKeyLinkTransactionTs } from './FormAccountKeyLinkTransactionTs';
export default class FormAccountKeyLinkTransaction extends FormAccountKeyLinkTransactionTs {}
</script>
