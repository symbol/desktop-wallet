<template>
    <div id="main-container">
        <div class="title-container">
            <span :class="['single-step', getStepClassName(0)]">
                {{ $t('offline_transactions_prepare_transaction') }}
            </span>
            <span :class="['single-step', getStepClassName(1)]">
                {{ $t('offline_transactions_download') }}
            </span>
        </div>
        <div class="transaction-form-container">
            <FormOfflineTransferTransaction
                v-if="step === 0"
                :show-transaction-actions="false"
                @transactionSigned="onSignedOfflineTransaction"
            />
            <div v-if="step === 1" class="account-detail-outer-container">
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
                    <button type="button" class="centered-button button-style button danger-button buttonD" @click="step = 0">
                        {{ $t('back') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import OfflineTransferTransactionTs from './OfflineTransferTransactionTs';
export default class OfflineTransferTransaction extends OfflineTransferTransactionTs {}
</script>
<style lang="less" scoped>
@import './OfflineTransferTransaction.less';
</style>
