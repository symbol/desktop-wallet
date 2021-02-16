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

                    <NetworkNodeSelector
                        v-model="formItems.nodeModel"
                        :disabled="harvestingStatus !== 'INACTIVE' && isPublicAndPrivateKeysLinked"
                    />
                    <div class="linked-keys-info">
                        <span>
                            {{ $t('linked_keys_info') }}
                        </span>
                    </div>
                    <div v-if="isVrfKeyLinked && isAccountKeyLinked && !isNodeKeyLinked" class="info-text warning-node-swap">
                        <Icon type="ios-warning-outline" />

                        <span>
                            {{ $t('remote_keys_linked') }}
                        </span>
                    </div>
                    <div v-if="!isPublicAndPrivateKeysLinked" class="info-text keys-warning">
                        <Icon type="ios-warning-outline" />

                        <span>
                            {{ $t('harvesting_status_not_detected') }}
                        </span>
                    </div>
                    <!-- <FormRow class="form-warning-row" v-if="harvestingStatus !== 'INACTIVE'">
                        <template v-slot:inputs>
                            <div  type="warning" class="warning-node-swap">
                                <Icon type="ios-warning-outline" />
                                {{ $t('harvesting_warning_node_swap') }}
                            </div>
                        </template>
                    </FormRow> -->
                    <div class="key-item separtate-spacing">
                        <FormRow>
                            <template v-slot:label> {{ $t('linked_node_public_key') }}: </template>

                            <template v-slot:inputs>
                                <AccountPublicKeyDisplay
                                    v-if="isNodeKeyLinked"
                                    :public-key="currentSignerAccountInfo.supplementalPublicKeys.node.publicKey"
                                />
                                <Tooltip
                                    v-else
                                    class="linked-label"
                                    word-wrap
                                    placement="bottom"
                                    :content="$t('form_label_use_link_node_public_key_icon')"
                                >
                                    <span> {{ $t('not_linked') }}:</span>
                                    <Icon type="ios-information-circle-outline" />
                                </Tooltip>
                            </template>
                        </FormRow>
                        <img
                            v-if="!isNodeKeyLinked"
                            :src="linkIcon"
                            class="button-icon"
                            @click="handleSubmit(onSingleKeyOperation('node'))"
                        />
                        <Tooltip v-else word-wrap placement="bottom" :content="$t('label_unlink_node_account_public_key')">
                            <Icon type="md-trash" class="button-icon" size="20" @click="handleSubmit(onSingleKeyOperation('node'))" />
                        </Tooltip>
                    </div>
                    <!-- link/unlink button for node public key -->

                    <div class="key-item">
                        <FormRow>
                            <template v-slot:label> {{ $t('linked_public_key') }}: </template>
                            <template v-slot:inputs>
                                <AccountPublicKeyDisplay
                                    v-if="isAccountKeyLinked"
                                    :public-key="currentSignerAccountInfo.supplementalPublicKeys.linked.publicKey"
                                />
                                <Tooltip
                                    v-else
                                    word-wrap
                                    placement="bottom"
                                    class="linked-label"
                                    :content="$t('form_label_use_link_remote_public_key_icon')"
                                >
                                    <span> {{ $t('not_linked') }}:</span>
                                    <Icon type="ios-information-circle-outline" />
                                </Tooltip>
                            </template>
                        </FormRow>
                        <img
                            v-if="!isAccountKeyLinked"
                            :src="linkIcon"
                            class="button-icon"
                            @click="handleSubmit(onSingleKeyOperation('account'))"
                        />
                        <Tooltip v-else word-wrap placement="bottom" :content="$t('label_unlink_remote_account_public_key')">
                            <Icon type="md-trash" class="button-icon" size="20" @click="handleSubmit(onSingleKeyOperation('account'))" />
                        </Tooltip>
                    </div>
                    <!-- link/unlink button for remote account public key -->

                    <div class="key-item separtate-spacing">
                        <FormRow>
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
                        <FormRow>
                            <template v-slot:label> {{ $t('linked_vrf_public_key') }}: </template>
                            <template v-slot:inputs>
                                <AccountPublicKeyDisplay
                                    v-if="isVrfKeyLinked"
                                    :public-key="currentSignerAccountInfo.supplementalPublicKeys.vrf.publicKey"
                                />
                                <Tooltip
                                    v-else
                                    class="linked-label"
                                    word-wrap
                                    placement="bottom"
                                    :content="$t('form_label_use_link_vrf_public_key_icon')"
                                >
                                    <span> {{ $t('not_linked') }}:</span>
                                    <Icon type="ios-information-circle-outline" />
                                </Tooltip>
                            </template>
                        </FormRow>
                        <img
                            v-if="!isVrfKeyLinked"
                            :src="linkIcon"
                            class="button-icon"
                            @click="handleSubmit(onSingleKeyOperation('vrf'))"
                        />
                        <Tooltip v-else word-wrap placement="bottom" :content="$t('label_unlink_vrf_account_public_key')">
                            <Icon type="md-trash" class="button-icon" size="20" @click="handleSubmit(onSingleKeyOperation('vrf'))" />
                        </Tooltip>
                    </div>

                    <!-- link/unlink button for vrf public key -->
                    <div class="key-item">
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
                                    :disabled="linking"
                                    @click="handleSubmit(onStart())"
                                >
                                    {{ linking ? $t('linking') : $t('link_keys') }}
                                </button>
                                <button
                                    v-if="!isPersistentDelReqSent && harvestingStatus !== 'INACTIVE'"
                                    class="centered-button button-style submit-button inverted-button"
                                    :disabled="activating || linking || !isPublicAndPrivateKeysLinked"
                                    @click="handleSubmit(onActivate())"
                                >
                                    {{ activating ? $t('activating') : $t('activate') }}
                                </button>
                                <!-- <button
                                    v-if="isPersistentDelReqSent && harvestingStatus !== 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button inverted-button"
                                    :disabled="swapDisabled"
                                    @click="handleSubmit(onSwap())"
                                >
                                    {{ $t('swap') }}
                                </button> -->
                                <button
                                    v-if="harvestingStatus !== 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button danger-button"
                                    :disabled="linking || activating"
                                    @click="handleSubmit(onStop())"
                                >
                                    {{ linking ? $t('stoping') : $t('stop_harvesting') }}
                                </button>
                            </div>
                        </template>
                    </FormRow>
                </form>
            </ValidationObserver>
        </FormWrapper>

        <ModalFormProfileUnlock
            v-if="hasAccountUnlockModal || isLedger"
            :visible="hasAccountUnlockModal"
            :on-success="onAccountUnlocked"
            :message="$t('activate_delegated_harvesting_message')"
            @close="hasAccountUnlockModal = false"
        />
        <ModalFormProfileUnlock
            v-if="hasLedgerAccountUnlockModal"
            :visible="hasLedgerAccountUnlockModal"
            :on-success="onLedgerAccountUnlocked"
            :message="$t('encrypt_ledger_keys_on_sign')"
            @close="hasLedgerAccountUnlockModal = false"
        />
        <ModalTransactionConfirmation
            v-if="hasConfirmationModal"
            :delegated="true"
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
