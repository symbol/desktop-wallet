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
                            <span class="warning">
                                <div
                                    :class="
                                        transactionAccepted
                                            ? ['box-position-size', 'box-section-accepted']
                                            : ['box-position-size', 'box-section']
                                    "
                                >
                                    <img
                                        :class="!transactionAccepted ? ['img-position', 'img-pad'] : 'img-position'"
                                        :src="require('@/views/resources/img/icons/Signature.svg')"
                                        alt
                                    />
                                    <span v-if="!transactionAccepted && !transactionRejected" class="txt-position">{{
                                        $t('transaction_needs_cosignature')
                                    }}</span>

                                    <div v-if="transactionAccepted" class="warning-txt-position">
                                        <span class="txt-position">
                                            {{ $t('transaction_cosignature_warning_unknown_cosigner') }}
                                        </span>
                                        <br />
                                        <span class="txt-position">
                                            {{ $t('transaction_cosignature_warning_dont_sign') }}
                                        </span>
                                    </div>
                                    <div v-if="transactionAccepted">
                                        <Checkbox v-if="transactionAccepted" v-model="wantToProceed" class="warning-txt-checkbox">
                                            <span class="warning-txt">{{ $t('transaction_cosignature_warning_proceed') }}</span>
                                        </Checkbox>
                                    </div>
                                    <span v-if="transactionRejected" class="txt-position">{{ $t('blacklist_address_text') }}</span>
                                    <br />
                                    <input
                                        v-if="transactionRejected"
                                        v-model="contactName"
                                        v-focus
                                        class="input-size input-style contact-input"
                                        :placeholder="$t('form_label_new_contact_name')"
                                        type="text"
                                    />
                                    <br />
                                    <Button
                                        v-if="transactionRejected"
                                        class="button-style inverted-button right-side-button action-button-style rejected-button"
                                        html-type="submit"
                                        @click="blackListContact"
                                    >
                                        {{ $t('tab_contact_black_list') }}
                                    </Button>
                                    <div v-if="!transactionAccepted && !transactionRejected" class="position-button">
                                        <Button
                                            class="button-style inverted-button right-side-button action-button-style"
                                            html-type="submit"
                                            @click="
                                                transactionAccepted = false;
                                                transactionRejected = true;
                                            "
                                        >
                                            {{ $t('label_reject') }}
                                        </Button>
                                        <Button
                                            class="button-style inverted-button right-side-button action-button-style"
                                            html-type="submit"
                                            @click="
                                                transactionAccepted = true;
                                                transactionRejected = false;
                                            "
                                        >
                                            {{ $t('label_accept') }}
                                        </Button>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onSigner" @error="onError" />
                        <FormProfileUnlock
                            v-else-if="transactionAccepted || hideCosignerWarning"
                            :disabled="!hideCosignerWarning && !wantToProceed"
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
