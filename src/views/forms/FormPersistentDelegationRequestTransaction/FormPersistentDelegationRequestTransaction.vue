<template>
    <div class="form-persistent-delegation-request">
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <h2>{{ $t('harvesting_subtitle_delegation') }}</h2>
                    <p>{{ $t('harvesting_delegation_description_1') }} {{ $t('harvesting_delegation_description_2') }}</p>

                    <!-- Transaction signer selector -->
                    <SignerSelector v-model="formItems.signerAddress" :signers="signers" @input="onChangeSigner" />

                    <!-- Node URL Selector -->
                    <NetworkNodeSelector v-model="formItems.nodePublicKey" @change="(v) => $emit('setNodePublicKey', v)" />

                    <!-- Transaction fee selector and submit button -->
                    <FormRow class-name="emphasis">
                        <template v-slot:label> {{ $t('fee') }}: </template>
                        <template v-slot:inputs>
                            <MaxFeeSelector v-model="formItems.maxFee" @button-clicked="handleSubmit(onSubmit)" />
                        </template>
                    </FormRow>
                </form>
            </ValidationObserver>
        </FormWrapper>
    </div>
</template>

<script lang="ts">
import { FormPersistentDelegationRequestTransactionTs } from './FormPersistentDelegationRequestTransactionTs';
export default class FormPersistentDelegationRequestTransaction extends FormPersistentDelegationRequestTransactionTs {}
</script>
