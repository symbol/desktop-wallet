<template>
    <div class="update-metadata-modal-conatiner">
        <div class="modal-title">{{ $t(modalTitle) }}</div>
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form autocomplete="off" onsubmit="event.preventDefault()" class="form-line-container mt-3">
                    <FormRow>
                        <template v-slot:label> {{ $t('form_label_by_account') }}: </template>
                        <template v-slot:inputs>
                            <div class="select-container">
                                <SignerSelector
                                    v-model="formItems.signerAddress"
                                    :signers="signers"
                                    :no-label="true"
                                    @input="onChangeSigner"
                                />
                            </div>
                        </template>
                    </FormRow>
                    <FormRow>
                        <template v-slot:label> {{ $t('form_label_target_account') }}: </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="targetAccount"
                                mode="lazy"
                                :name="$t('target_account_invalid_name')"
                                :rules="`required|${validationRules.addressOrPublicKey}`"
                                tag="div"
                                class="row-metadata-input input-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <input
                                        v-model="formItems.targetAccount"
                                        class="input-size input-style"
                                        :placeholder="$t('form_label_target_account_hint')"
                                        type="text"
                                    />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>
                    <FormRow v-if="type === MetadataType.Mosaic">
                        <template v-slot:label> {{ $t(targetLabel) }}: </template>
                        <template v-slot:inputs>
                            <MosaicSelector v-model="formItems.targetId" :mosaic-hex-ids="ownedTargetHexIds" default-mosaic="firstInList" />
                        </template>
                    </FormRow>
                    <div v-if="type === MetadataType.Namespace">
                        <NamespaceSelector
                            v-model="formItems.targetId"
                            :namespaces="ownedTargetHexIds"
                            :disable-linked="false"
                            label="targetLabel"
                        />
                    </div>
                    <FormRow>
                        <template v-slot:label> {{ $t('form_label_value') }}: </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="value"
                                mode="lazy"
                                :name="$t('form_label_value')"
                                :rules="'required'"
                                tag="div"
                                class="row-metadata-input value-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <textarea
                                        v-model="formItems.metadataValue"
                                        class="metadata-value-input"
                                        :placeholder="$t('form_label_value_hint')"
                                    />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>
                    <MaxFeeAndSubmit
                        v-model="formItems.maxFee"
                        :disable-submit="!hasFormAnyChanges"
                        @button-clicked="handleSubmit(onSubmit)"
                    />
                </form>
            </ValidationObserver>
        </FormWrapper>
        <ModalTransactionConfirmation
            v-if="hasConfirmationModal"
            :command="command"
            :visible="hasConfirmationModal"
            @success="onConfirmationSuccess"
            @error="onConfirmationError"
            @close="onConfirmationCancel"
        />
    </div>
</template>

<script lang="ts">
import { FormMetadataCreationTs } from './FormMetadataCreationTs';
export default class FormMetadataCreation extends FormMetadataCreationTs {}
</script>

<style lang="less" scoped>
@import './FormMetadataCreation.less';
</style>
