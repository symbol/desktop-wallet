<template>
    <div>
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <!-- Transaction signer selector -->
                    <SignerSelector v-model="formItems.signerAddress" :signers="signers" :disabled="isDeleteMode" @input="onChangeSigner" />

                    <RestrictionDirectionInput v-model="formItems.direction" :disabled="isDeleteMode || directionDisabled" />

                    <RestrictionTypeInput v-model="formItems.blockType" :disabled="isDeleteMode || transactionTypeDisabled" />

                    <!-- Transfer recipient input field -->
                    <RecipientInput v-if="restrictionTxType === 'ADDRESS'" v-model="formItems.recipientRaw" :disabled="isDeleteMode" />

                    <FormRow v-if="restrictionTxType === 'MOSAIC'" class-name="emphasis">
                        <template v-slot:label> {{ $t('mosaic_id') }}: </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="mosaicId"
                                mode="lazy"
                                :name="$t('mosaic_id')"
                                :rules="`required`"
                                tag="div"
                                class="row-metadata-input inputs-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <input v-model="formItems.mosaicIdRaw" :disabled="isDeleteMode" class="input-size input-style" />
                                    <!-- <MosaicSelector v-model="formItems.mosaicIdRaw" default-mosaic="firstInList" /> -->
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <FormRow v-if="restrictionTxType === 'TRANSACTION_TYPE'" class-name="emphasis">
                        <template v-slot:label> {{ $t('operation_type') }}: </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="transactionType"
                                mode="lazy"
                                :name="$t('operation_type')"
                                :rules="`required`"
                                tag="div"
                                class="row-metadata-input inputs-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <transaction-type-selector v-model="formItems.transactionType" :disabled="isDeleteMode" />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <!-- Transaction fee selector and submit button -->
                    <MaxFeeAndSubmit
                        v-model="formItems.maxFee"
                        :submit-button-text="submitButtonText"
                        :submit-button-classes="submitButtonClasses"
                        @button-clicked="handleSubmit(onSubmit)"
                    />
                </form>
            </ValidationObserver>

            <ModalTransactionConfirmation
                v-if="hasConfirmationModal"
                :command="command"
                :visible="hasConfirmationModal"
                @success="onConfirmationSuccess"
                @error="onConfirmationError"
                @close="onConfirmationCancel"
            />
        </FormWrapper>
    </div>
</template>

<script lang="ts">
import { FormAccountRestrictionTransactionTs } from './FormAccountRestrictionTransactionTs';
export default class FormAccountRestrictionTransaction extends FormAccountRestrictionTransactionTs {}
</script>

<style lang="less" scoped>
.save-button {
    text-align: center;
    width: 120px;
}
</style>
