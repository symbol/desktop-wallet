<template>
    <div id="main-container">
        <div class="title-container">
            <span :class="['single-step', getStepClassName(0)]">
                {{ $t('offline_transactions_import_qr') }}
            </span>
            <span :class="['single-step', getStepClassName(1)]">
                {{ $t('offline_transactions_chose_account') }}
            </span>
            <span :class="['single-step', getStepClassName(2)]">
                {{ $t('offline_transactions_download') }}
            </span>
        </div>
        <div class="transaction-form-container">
            <div v-if="step === 0" class="account-detail-outer-container">
                <div class="account-detail-inner-container">
                    <div class="title">
                        {{ $t('offline_transactions_import_qr_title') }}
                    </div>
                    <div class="import-qr-container">
                        <button
                            type="button"
                            class="centered-button button-style submit-button inverted-button fat-button"
                            @click="isImportQRModalOpen = true"
                        >
                            {{ $t('import_qr_code') }}
                        </button>
                    </div>
                    <div class="description-text">
                        {{ $t('import_payload_text') }}
                    </div>
                    <div class="payload-input">
                        <textarea
                            v-model="importedPayload"
                            :placeholder="$t('form_label_import_placeholder')"
                            @input="calculateAggregateTransaction"
                        />
                        <button
                            type="button"
                            class="centered-button button-style submit-button inverted-button fat-button"
                            :disabled="isDisabled"
                            @click="onImportPayloadClick"
                        >
                            {{ $t('import_payload') }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="step === 1" class="account-detail-outer-container">
                <div class="account-detail-inner-container">
                    <FormOfflineCosignTransaction :transaction="aggregateTransaction" @signedCosignature="onSignedOfflineTransaction" />
                </div>
                <div class="action-buttons">
                    <button type="button" class="centered-button button-style button danger-button buttonD" @click="step = 0">
                        {{ $t('back') }}
                    </button>
                </div>
            </div>
            <div v-if="step === 2" class="account-detail-outer-container">
                <div class="account-detail-inner-container">
                    <div class="title">
                        {{ $t('offline_transactions_success') }}
                    </div>
                    <div class="qr-container">
                        <QRCodeDisplay
                            :qr-code="qrCode"
                            header="signed_transaction_qr"
                            alt="singed_transaction_qr_code"
                            show-download="true"
                            :download-name="'signedTransaction'"
                        />
                    </div>
                    <div class="raw-json">
                        {{ qrCodeJson }}
                    </div>
                    <div class="description-text">
                        {{ $t('offline_transactions_success_text') }}
                    </div>
                </div>
                <div class="action-buttons">
                    <button type="button" class="centered-button button-style button danger-button buttonD" @click="step = 1">
                        {{ $t('back') }}
                    </button>
                </div>
            </div>
        </div>
        <ModalImportQR
            v-if="isImportQRModalOpen"
            :visible="isImportQRModalOpen"
            valid-qr-types="[4]"
            :confirm-action="onConfirmImport"
            confirm-text="offline_transaction_confirm_import"
            @close="isImportQRModalOpen = false"
            @jsonImported="onQRCodeGenerated"
        />
    </div>
</template>

<script lang="ts">
import OfflineCosignTransactionTs from './OfflineCosignTransactionTs';
export default class OfflineCosignTransaction extends OfflineCosignTransactionTs {}
</script>
<style lang="less" scoped>
@import './OfflineCosignTransaction.less';
</style>
