<template>
    <div class="FormTransferTransaction">
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <!-- Transaction signer selector -->
                    <SignerSelector v-if="!hideSigner" v-model="formItems.signerAddress" :signers="signers" @input="onChangeSigner" />

                    <RestrictionDirectionInput />

                    <RestrictionTypeInput />

                    <!-- Transfer recipient input field -->
                    <RecipientInput v-model="formItems.recipientRaw" style="margin-bottom: 0.5rem;" @input="onChangeRecipient" />

                    <!-- Transaction fee selector and submit button -->
                    <MaxFeeAndSubmit
                        v-model="formItems.maxFee"
                        :calculated-recommended-fee="calculatedRecommendedFee"
                        :calculated-highest-fee="calculatedHighestFee"
                        @button-clicked="handleSubmit(onSubmit)"
                        @input="onChangeMaxFee"
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

            <ModalFormProfileUnlock
                v-if="hasAccountUnlockModal"
                :visible="hasAccountUnlockModal"
                :on-success="onAccountUnlocked"
                @close="closeAccountUnlockModal"
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
