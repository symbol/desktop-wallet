<template>
    <div class="transaction_modal">
        <Modal
            v-model="show"
            class-name="modal-transaction-cosignature"
            :title="$t('modal_title_transaction_details')"
            :transfer="false"
            :footer-hide="true"
            @close="show = false"
        >
            <div v-if="isOptinTransaction && isOptinTransactionContainsPayout" class="transaction-details-content">
                <TransactionOptinPayoutDetails :transaction="transaction" :current-account="currentAccount" />
            </div>
            <div v-else class="transaction-details-content">
                <TransactionDetails :transaction="transaction" />

                <div v-if="cosignatures && cosignatures.length">
                    <div class="explain">
                        <span class="subtitle">{{ $t('transaction_has_cosignature') }}</span>
                        <div
                            v-for="(cosignature, index) in cosignatures"
                            :key="index"
                            class="row-cosignatory-modification-display-cosignature accent-pink-background inputs-container mx-1"
                        >
                            <div>
                                <Icon :type="'md-checkbox-outline'" size="20" />
                                <span>{{ $t('label_signed_by') }}</span>
                                <span>
                                    <b>
                                        {{ cosignature.signer.publicKey }}
                                    </b>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="hasMissSignatures">
                    <div v-if="!needsCosignature">
                        <div v-if="!isOptinTransaction" class="explain">
                            <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
                            <div class="explain-qr">
                                <p>{{ $t('transaction_needs_cosignature_explain_signed') }}</p>
                                <QRCodeDisplay
                                    :qr-code="cosignatureQrCode"
                                    show-download="true"
                                    :download-name="'cosginatureqr_' + transaction.signer.address.plain()"
                                    header="Cosignature QR Code"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="!hideCosignerWarning" class="explain">
                            <span v-if="showWarningForm" class="warning">
                                <div
                                    class="address-book-panel"
                                    :class="{ 'bg-warning': showFormUnkownAddressAccepted, 'bg-danger': showFormBlacklistedAddress }"
                                >
                                    <div v-if="showFormUnkownAddressOptions">
                                        <img class="icon" src="@/views/resources/img/icons/Signature.svg" alt />
                                        <div class="title-text">{{ $t('transaction_needs_cosignature') }}</div>
                                        <div class="inline">
                                            <div class="unknown-address">
                                                <img class="icon" src="@/views/resources/img/icons/whitelisted_contact_d.svg" alt />
                                            </div>
                                            <a class="unknown-address" target="_blank" :href="signerExplorerUrl">
                                                {{ signerAddress }}
                                            </a>
                                        </div>
                                        <div class="inline">
                                            <Button
                                                class="button-style inverted-button right-side-button button"
                                                html-type="submit"
                                                @click="reject"
                                            >
                                                {{ $t('label_reject') }}
                                            </Button>
                                            <Button
                                                class="button-style inverted-button right-side-button button"
                                                html-type="submit"
                                                @click="accept"
                                            >
                                                {{ $t('label_accept') }}
                                            </Button>
                                        </div>
                                    </div>
                                    <div v-else-if="showFormUnkownAddressRejected">
                                        <img class="icon" src="@/views/resources/img/icons/malicious_actor_1_d.svg" alt />
                                        <div class="title-text">{{ $t('blacklist_address_text') }}</div>
                                        <input
                                            v-model="contactName"
                                            v-focus
                                            class="input-style input"
                                            :placeholder="$t('form_label_new_contact_name')"
                                            type="text"
                                        />
                                        <Button
                                            class="button-style inverted-button right-side-button button"
                                            :disabled="!contactName"
                                            html-type="submit"
                                            @click="blackListContact"
                                        >
                                            {{ $t('button_block_contact') }}
                                        </Button>
                                        <div class="button-plain" @click="backToOptions">
                                            {{ $t('back') }}
                                        </div>
                                    </div>
                                    <div v-else-if="showFormUnkownAddressAccepted">
                                        <div class="caution-text">
                                            Caution!
                                        </div>
                                        <img class="icon" src="@/views/resources/img/icons/Signature.svg" alt />
                                        <div class="title-text">{{ $t('transaction_cosignature_warning_unknown_cosigner') }}</div>
                                        <Checkbox v-model="wantToProceed" class="checkbox">
                                            <span class="warning-txt">{{ $t('transaction_cosignature_warning_proceed') }}</span>
                                        </Checkbox>
                                        <Button
                                            class="button-style inverted-button right-side-button button"
                                            :disabled="!wantToProceed"
                                            html-type="submit"
                                            @click="proceedToSign"
                                        >
                                            {{ $t('sign') }}
                                        </Button>
                                        <div class="button-plain" @click="backToOptions">
                                            {{ $t('back') }}
                                        </div>
                                    </div>
                                    <div v-else-if="showFormBlacklistedAddress">
                                        <div class="inline">
                                            <div class="blocked-address">
                                                <img class="icon" src="@/views/resources/img/icons/malicious_actor_1.svg" alt />
                                            </div>
                                            <div class="blocked-address">{{ signerContactName }} ({{ signerAddress }})</div>
                                        </div>
                                        <div class="title-text">{{ $t('transaction_cosignature_warning_blocked_cosigner') }}</div>
                                        <Checkbox v-model="wantToUnblock" class="checkbox">
                                            <span class="warning-txt">{{ $t('transaction_cosignature_checkbox_unblock') }}</span>
                                        </Checkbox>
                                        <Button
                                            class="button-style inverted-button right-side-button button"
                                            :disabled="!wantToUnblock"
                                            html-type="submit"
                                            @click="unblockContact"
                                        >
                                            {{ $t('button_unblock_contact') }}
                                        </Button>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onSigner" @error="onError" />
                        <FormProfileUnlock
                            v-else-if="showFormSign || hideCosignerWarning"
                            :is-signature-modal-opened="true"
                            @success="onAccountUnlocked"
                            @error="onError"
                        />
                    </div>
                </div>
                <div v-else-if="expired">
                    <div class="explain">
                        <span class="subtitle">{{ $t('transaction_expired') }}</span>
                    </div>
                </div>
                <div v-else-if="!isLoading">
                    <div class="explain">
                        <span class="subtitle">{{ $t('transaction_received_cosignature_explain') }}</span>
                    </div>
                </div>
                <Spin v-if="isLoading" size="large" fix class="absolute" />
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalTransactionCosignatureTs } from './ModalTransactionCosignatureTs';
export default class ModalTransactionCosignature extends ModalTransactionCosignatureTs {}
</script>
<style lang="less" scoped>
@import './ModalTransactionCosignature.less';
</style>
