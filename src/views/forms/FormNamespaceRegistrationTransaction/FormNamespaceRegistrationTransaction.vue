<template>
    <div>
        <FormWrapper class="namespace-transaction-form-wrapper">
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()" class="form-container mt-3 create-namespace-form">
                    <SignerSelector v-model="formItems.signerAddress" :signers="signers" @input="onChangeSigner" />
                    <FormRow>
                        <template v-slot:label> {{ $t('form_label_registration_type') }}: </template>
                        <template v-slot:inputs>
                            <div class="inputs-container">
                                <div
                                    v-if="$route.path.substring(1) === 'createNamespace' || isAggregate"
                                    :value="typeRootNamespace"
                                    class="display-value"
                                >
                                    {{ $t('option_root_namespace') }}
                                </div>
                                <div
                                    v-if="$route.path.substring(1) === 'createSubNamespace' && ownedNamespaces.length"
                                    :value="typeSubNamespace"
                                    class="display-value"
                                >
                                    {{ $t('option_sub_namespace') }}
                                </div>
                            </div>
                        </template>
                    </FormRow>
                    <NamespaceSelector
                        v-if="formItems.registrationType === typeSubNamespace && ownedNamespaces.length"
                        :value="formItems.parentNamespaceName"
                        label="form_label_parent_namespace"
                        :namespaces="fertileNamespaces"
                        :parent-namespace="true"
                        @input="setParentNamespaceName"
                    />

                    <NamespaceNameInput
                        v-model="formItems.newNamespaceName"
                        :is-need-auto-focus="false"
                        :namespace-registration-type="formItems.registrationType"
                        @input="stripTagsNamespaceName"
                    />
                    <FormRow v-if="formItems.registrationType === typeSubNamespace">
                        <template v-slot:label> {{ $t('current_validity') }}: </template>
                        <template v-slot:inputs>
                            <div class="inputs-container">
                                <div class="display-value">
                                    {{ relativeTimeToParent }}
                                </div>
                            </div>
                        </template>
                    </FormRow>

                    <DurationInput
                        v-if="formItems.registrationType === typeRootNamespace"
                        v-model="formItems.duration"
                        target-asset="namespace"
                        :show-relative-time="true"
                    />
                    <RentalFee
                        :rental-type="formItems.registrationType === typeRootNamespace ? 'root-namespace' : 'child-namespace'"
                        :duration="formItems.duration"
                    />
                    <MaxFeeAndSubmit
                        v-if="!isAggregate"
                        v-model="formItems.maxFee"
                        :disable-submit="currentAccount.isMultisig"
                        @button-clicked="handleSubmit(onSubmit)"
                    />
                    <div v-else-if="!hideSave" class="ml-2" style="text-align: right;">
                        <button
                            type="submit"
                            class="save-button centered-button button-style inverted-button"
                            :disabled="currentAccount.isMultisig"
                            @click="emitToAggregate"
                        >
                            {{ $t('save') }}
                        </button>
                    </div>
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
// @ts-ignore
import { FormNamespaceRegistrationTransactionTs } from './FormNamespaceRegistrationTransactionTs';
export default class FormNamespaceRegistrationTransaction extends FormNamespaceRegistrationTransactionTs {}
</script>
<style lang="less" scoped>
@import './FormNamespaceRegistrationTransaction.less';

/deep/ .form-row {
    .form-row-inner-container {
        grid-template-columns: 3rem calc(100% - 3rem);
    }
}

.save-button {
    text-align: center;
    width: 120px;
}
</style>
