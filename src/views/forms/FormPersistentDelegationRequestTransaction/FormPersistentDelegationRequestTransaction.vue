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

                    <NetworkNodeSelector v-model="formItems.nodeModel" />
                    <FormRow v-if="harvestingStatus !== 'INACTIVE' && !swapDisabled">
                        <template v-slot:inputs>
                            <div type="warning" class="warning-node-swap">
                                <Icon type="ios-warning-outline" />
                                {{ $t('harvesting_warning_node_swap') }}
                            </div>
                        </template>
                    </FormRow>
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
                                    v-if="!isPersistentDelReqSent && harvestingStatus !== 'INACTIVE'"
                                    class="centered-button button-style submit-button inverted-button"
                                    :disabled="activating"
                                    @click="activateHarvesting"
                                >
                                    {{ activating ? $t('activating') : $t('activate') }}
                                </button>
                                <button
                                    v-if="isPersistentDelReqSent && harvestingStatus !== 'INACTIVE'"
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
            :command="this"
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
