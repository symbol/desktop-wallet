<template>
    <div class="form-persistent-delegation-request">
        <NavigationLinks
            :direction="'horizontal'"
            :items="['delegated_harvesting', 'key_links']"
            :current-item-index="activePanel"
            translation-prefix="tab_harvesting_"
            @selected="(i) => (activePanel = i)"
        />
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <div v-if="activePanel === 0">
                        <div class="info-text">
                            <p v-if="harvestingStatus === 'INACTIVE'">
                                {{ $t('harvesting_delegated_description') }}
                            </p>
                            <p v-if="harvestingStatus === 'INACTIVE' && !isActivatedFromAnotherDevice">
                                {{ $t('harvesting_node_selection') }}
                                <a :href="allNodeListUrl" target="_blank"> {{ $t('open_explorer_node_list') }} </a>
                            </p>
                            <Alert
                                :visible="isActivatedFromAnotherDevice"
                                type="danger"
                                :value="$t('harvesting_activated_from_another_device')"
                            />
                            <Alert
                                :visible="harvestingStatus === 'KEYS_LINKED' && isPublicAndPrivateKeysLinked"
                                type="warning"
                                :value="$t('harvesting_keys_linked_next_step_guide')"
                            />
                            <Alert
                                :visible="harvestingStatus === 'KEYS_LINKED' && !isPublicAndPrivateKeysLinked"
                                type="warning"
                                :value="$t('harvesting_keys_linked_missing')"
                            />
                        </div>

                        <!-- Transaction signer selector -->
                        <SignerSelector v-model="formItems.signerAddress" :root-signer="currentAccountSigner" @input="onChangeSigner" />

                        <NetworkNodeSelector
                            v-model="formItems.nodeModel"
                            :disabled="harvestingStatus !== 'INACTIVE' && isPublicAndPrivateKeysLinked"
                            :is-account-key-linked="isAccountKeyLinked"
                            :is-vrf-key-linked="isVrfKeyLinked"
                            :missing-keys="harvestingStatus === 'KEYS_LINKED' && !isPublicAndPrivateKeysLinked"
                        />

                        <FormRow class="fee-selector">
                            <template v-slot:label> {{ $t('fee') }}: </template>
                            <template v-slot:inputs>
                                <MaxFeeSelector v-model="formItems.maxFee" :show-fee-label="false" />
                                <span v-if="LowFeeValue" class="fee-warning">
                                    <Icon type="ios-warning-outline" />
                                    {{ $t('low_fee_warning_message') }}
                                </span>
                            </template>
                        </FormRow>

                        <FormRow class-name="buttons-row button-margin">
                            <template v-slot:inputs>
                                <div class="harvesting-buttons-container">
                                    <button
                                        v-if="harvestingStatus === 'INACTIVE'"
                                        type="submit"
                                        class="centered-button button-style submit-button inverted-button"
                                        :disabled="linking"
                                        @click="handleSubmit(onStartClick())"
                                    >
                                        {{ linking ? $t('linking') : $t('link_keys') }}
                                    </button>
                                    <button
                                        v-if="!isPersistentDelReqSent && harvestingStatus !== 'INACTIVE' && harvestingStatus !== 'ACTIVE'"
                                        class="centered-button button-style submit-button inverted-button"
                                        :disabled="activating || linking || !isPublicAndPrivateKeysLinked"
                                        @click="handleSubmit(onActivate())"
                                    >
                                        {{ activating ? $t('requesting') : $t('request_harvesting') }}
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
                                        v-if="harvestingStatus !== 'INACTIVE' && harvestingStatus !== 'KEYS_LINKED'"
                                        type="submit"
                                        class="centered-button button-style submit-button danger-button"
                                        :disabled="linking || activating"
                                        @click="handleSubmit(onStop())"
                                    >
                                        {{ linking ? $t('stoping') : $t('stop_harvesting') }}
                                    </button>
                                    <button
                                        v-if="harvestingStatus === 'KEYS_LINKED'"
                                        type="submit"
                                        class="centered-button secondary-outline-button button-style submit-button button"
                                        :disabled="linking || activating"
                                        @click="handleSubmit(onStop())"
                                    >
                                        {{ linking ? $t('unlinking') : $t('unlink_keys') }}
                                    </button>
                                </div>
                            </template>
                        </FormRow>
                    </div>
                    <div v-if="activePanel === 1">
                        <div class="info-text">
                            <span>
                                {{ $t('delegated_harvesting_keys_info') }}
                            </span>
                            <Alert
                                :visible="isVrfKeyLinked && isAccountKeyLinked && !isNodeKeyLinked"
                                type="warning"
                                :value="$t('remote_keys_linked')"
                            />
                            <Alert :visible="isActivatedFromAnotherDevice" type="warning" :value="$t('harvesting_status_not_detected')" />
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
                                <Icon
                                    type="md-trash"
                                    class="button-icon"
                                    size="20"
                                    @click="handleSubmit(onSingleKeyOperation('account'))"
                                />
                            </Tooltip>
                        </div>
                        <!-- link/unlink button for remote account public key -->

                        <div class="key-item separtate-spacing">
                            <FormRow>
                                <template v-slot:label> {{ $t('linked_remote_private_key') }}: </template>
                                <template v-slot:inputs>
                                    <div class="detail-row">
                                        <div class="detail-row">
                                            <ProtectedPrivateKeyDisplay
                                                :enc-private-key="currentSignerHarvestingModel.encRemotePrivateKey"
                                            />
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

                        <div class="key-item">
                            <FormRow class="fee-selector">
                                <template v-slot:label> {{ $t('fee') }}: </template>
                                <template v-slot:inputs>
                                    <MaxFeeSelector v-model="formItems.maxFee" :show-fee-label="false" />
                                    <span v-if="LowFeeValue" class="fee-warning">
                                        <Icon type="ios-warning-outline" />
                                        {{ $t('low_fee_warning_message') }}
                                    </span>
                                </template>
                            </FormRow>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </FormWrapper>
        <ModalImportPrivateKey
            :visible="showModalImportKey"
            :title="modalImportKeyTitle"
            @close="showModalImportKey = false"
            @submit="onSubmitPrivateKey"
            @confirmed="showModalImportKey = false"
        />
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
        <ModalConfirm
            v-model="isDelegatedHarvestingWarningModalShown"
            :warning="true"
            :title="$t('harvesting_delegated_request_warning_title')"
            :message="$t('harvesting_delegated_request_warning')"
            @confirmed="onConfirmStart"
        />
        <ModalConfirm
            v-model="showConfirmModal"
            :warning="true"
            :title="$t('open_harvesting_keys_warning_title')"
            :message="$t('open_harvesting_keys_warning_text')"
            @confirmed="activePanel = -1"
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
