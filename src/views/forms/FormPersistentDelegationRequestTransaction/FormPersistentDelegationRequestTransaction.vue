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
                    <div class="linked-keys-info">
                        <span>
                            {{ $t('linked_keys_info') }}
                        </span>
                    </div>
                    <FormRow class="form-warning-row">
                        <template v-slot:inputs>
                            <div v-if="harvestingStatus !== 'INACTIVE' && !swapDisabled" type="warning" class="warning-node-swap">
                                <Icon type="ios-warning-outline" />
                                {{ $t('harvesting_warning_node_swap') }}
                            </div>
                        </template>
                    </FormRow>
                    <div class="key-item">
                        <FormRow v-if="currentSignerAccountInfo.supplementalPublicKeys.node">
                            <template v-slot:label> {{ $t('linked_node_public_key') }}: </template>

                            <template v-slot:inputs>
                                <AccountPublicKeyDisplay :public-key="currentSignerAccountInfo.supplementalPublicKeys.node.publicKey" />
                            </template>
                        </FormRow>
                    </div>
                    <div class="key-item">
                        <FormRow v-if="currentSignerAccountInfo.supplementalPublicKeys.linked">
                            <template v-slot:label> {{ $t('linked_public_key') }}: </template>
                            <template v-slot:inputs>
                                <AccountPublicKeyDisplay :public-key="currentSignerAccountInfo.supplementalPublicKeys.linked.publicKey" />
                            </template>
                        </FormRow>
                    </div>
                    <div class="key-item">
                        <FormRow v-if="currentSignerHarvestingModel.encRemotePrivateKey">
                            <template v-slot:label> {{ $t('linked_remote_private_key') }}: </template>
                            <template v-slot:inputs>
                                <div class="detail-row">
                                    <div class="detail-row">
                                        <ProtectedPrivateKeyDisplay :enc-private-key="currentSignerHarvestingModel.encRemotePrivateKey" />
                                    </div>
                                </div>
                            </template>
                        </FormRow>
                    </div>
                    <div class="key-item">
                        <FormRow v-if="currentSignerAccountInfo.supplementalPublicKeys.vrf">
                            <template v-slot:label> {{ $t('linked_vrf_public_key') }}: </template>
                            <template v-slot:inputs>
                                <AccountPublicKeyDisplay :public-key="currentSignerAccountInfo.supplementalPublicKeys.vrf.publicKey" />
                            </template>
                        </FormRow>
                    </div>
                    <div v-if="currentSignerHarvestingModel.encVrfPrivateKey" class="key-item">
                        <FormRow>
                            <template v-slot:label> {{ $t('linked_vrf_private_key') }}: </template>
                            <template v-slot:inputs>
                                <div class="detail-row">
                                    <div class="detail-row">
                                        <ProtectedPrivateKeyDisplay :enc-private-key="currentSignerHarvestingModel.encVrfPrivateKey" />
                                    </div>
                                </div>
                            </template>
                        </FormRow>
                    </div>

                    <FormRow class-name="buttons-row button-margin">
                        <template v-slot:inputs>
                            <div class="harvesting-buttons-container">
                                <button
                                    v-if="harvestingStatus === 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button inverted-button"
                                    @click="handleSubmit(onStart())"
                                >
                                    {{ $t('link_keys') }}
                                </button>
                                <button
                                    v-if="!isPersistentDelReqSent && harvestingStatus !== 'INACTIVE'"
                                    class="centered-button button-style submit-button inverted-button"
                                    :disabled="activating"
                                    @click="handleSubmit(activateAccount())"
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

        <ModalFormProfileUnlock
            v-if="hasAccountUnlockModal"
            :visible="hasAccountUnlockModal"
            :on-success="onAccountUnlocked"
            :message="$t('activate_delegated_harvesting_message')"
            @close="hasAccountUnlockModal = false"
        />
        <ModalTransactionConfirmation
            v-if="hasConfirmationModal"
            :command="this"
            :visible="hasConfirmationModal"
            @success="onConfirmationSuccess"
            @error="onConfirmationError"
            @close="onConfirmationCancel"
            @unlocked="decryptKeys"
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
