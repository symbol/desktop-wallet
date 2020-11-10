<template>
    <div class="update-metadata-modal-conatiner">
        <div class="modal-title">{{ $t(modalTitle) }}</div>
        <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
            <form autocomplete="off" onsubmit="event.preventDefault()" class="form-line-container mt-3">
                <FormRow>
                    <template v-slot:label> {{ $t('form_label_by_account') }}: </template>
                    <template v-slot:inputs>
                        <div class="select-container">
                            <SignerSelector v-model="formItems.signerAddress" :signers="signers" :no-label="true" @input="onChangeSigner" />
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
                                    class="input-size input-style"
                                    v-model="formItems.targetAccount"
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
                        <MosaicSelector
                            v-model="formItems.targetId"
                            :mosaic-hex-ids="ownedTargetHexIds"
                            default-mosaic="firstInList"
                        />
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
                    <template v-slot:label> {{ $t('form_label_scoped_metadata_key') }}: </template>
                    <template v-slot:inputs>
                        <ValidationProvider
                            v-slot="{ errors }"
                            vid="scopedKey"
                            mode="lazy"
                            :name="$t('form_label_scoped_metadata_key')"
                            :rules="'required'"
                            tag="div"
                            class="autocomplete-container"
                        >
                            <ErrorTooltip :errors="errors">
                                <AutoComplete
                                    class="auto-complete-size auto-complete-style"
                                    v-model="formItems.scopedKey"
                                    :placeholder="$t('form_label_scoped_metadata_key_hint')"
                                    :data="cashedScopedKeys"
                                />
                            </ErrorTooltip>
                        </ValidationProvider>
                    </template>
                </FormRow>
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
                                    class="metadata-value-input"
                                    :placeholder="$t('form_label_value_hint')"
                                    v-model="formItems.metadataValue" 
                                />
                            </ErrorTooltip>
                        </ValidationProvider>
                    </template>
                </FormRow>
                <MaxFeeAndSubmit
                    v-model="formItems.maxFee"
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
    </div>
</template>

<script lang="ts">
import { FormMetadataCreationTs } from './FormMetadataCreationTs'
export default class FormMetadataCreation extends FormMetadataCreationTs {}
</script>

<style lang="less" scoped>
@import './FormMetadataCreation.less';
</style>