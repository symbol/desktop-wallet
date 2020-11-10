<template>
    <div class="form-persistent-delegation-request">
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <div class="info-text">
                        <span>
                            {{ $t('delegated_harvesting_info') }}
                        </span>
                    </div>

                    <!-- Transaction signer selector -->
                    <SignerSelector v-model="formItems.signerAddress" :signers="signers" @input="onChangeSigner" />

                    <!-- for now, use input component instead - Node URL Selector 
                    <NetworkNodeSelector v-model="formItems.nodePublicKey" />
                    -->
                    <FormRow>
                        <template v-slot:label> {{ $t('node_url') }}: </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                mode="lazy"
                                vid="nodePublicKey"
                                :name="$t('node_publicKey')"
                                rules="required"
                                tag="div"
                                class="inputs-container"
                                ><ErrorTooltip :errors="errors">
                                    <!-- <input
                                        v-model="formItems.nodePublicKey"
                                        class="input-size input-style"
                                        :placeholder="$t('node_publicKey')"
                                        type="text"
                                    /> -->
                                    <Select v-model="nodePublicKey" class="select-size select-style" :transfer="true">
                                        <Option v-for="node in nodeList" :key="node.publicKey" :value="node.publicKey">
                                            {{ node.url }}
                                        </Option>
                                    </Select>

                                    <div v-if="!swapDisabled" type="warning" class="warning-node-swap">
                                        <Icon type="ios-warning-outline" />
                                        {{ $t('harvesting_warning_node_swap') }}
                                    </div>
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <!-- Transaction fee selector and submit button -->

                    <FormRow class-name="buttons-row">
                        <template v-slot:inputs>
                            <div class="harvesting-buttons-container">
                                <button
                                    v-if="harvestingStatus === 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button inverted-button"
                                    @click="handleSubmit(onStart())"
                                >
                                    {{ $t('start') }}
                                </button>
                                <button
                                    v-if="harvestingStatus !== 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button inverted-button"
                                    :disabled="swapDisabled"
                                    @click="handleSubmit(onSwap())"
                                >
                                    {{ $t('swap') }}
                                </button>
                                <button
                                    v-if="harvestingStatus !== 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button danger-button"
                                    @click="handleSubmit(onStop())"
                                >
                                    {{ $t('stop_harvesting') }}
                                </button>
                            </div>
                        </template>
                    </FormRow>
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
import { FormPersistentDelegationRequestTransactionTs } from './FormPersistentDelegationRequestTransactionTs';
export default class FormPersistentDelegationRequestTransaction extends FormPersistentDelegationRequestTransactionTs {}
</script>

<style lang="less" scoped>
@import './FormPersistentDelegationRequestTransaction.less';
</style>
