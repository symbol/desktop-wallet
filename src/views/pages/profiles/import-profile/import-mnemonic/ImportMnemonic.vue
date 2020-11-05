<template>
    <div class="create-mnemonic-sec" @keyup.enter="submit">
        <p class="set-title">
            {{ $t('input_mnemonic') }}
        </p>
        <div class="input-mnemonic">
            <MnemonicInput :seed="importedMnemonic" @handle-words="setSeed" />
            <div class="form-line-container form-row">
                <div class="flex-container mt-3 buttons-container">
                    <button type="button" class="button-style back-create-button" @click="deleteProfileAndBack">
                        {{ $t('back') }}
                    </button>
                    <ImportQRButton valid-qr-types="[5]">
                        <template v-slot:trigger="importQRButton">
                            <button type="button" class="button-style back-create-button import-qr-button" @click="importQRButton.trigger">
                                {{ $t('from_qr_code') }}
                            </button>
                        </template>
                    </ImportQRButton>
                    <button
                        type="submit"
                        class="button-style validation-create-button"
                        :disabled="!(wordsArray.length === 12 || wordsArray.length === 24)"
                        @click="processVerification"
                    >
                        {{ $t('next') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ImportMnemonicTs from './ImportMnemonicTs';

export default class ImportMnemonic extends ImportMnemonicTs {}
</script>
<style lang="less" scoped>
@import './ImportMnemonic.less';
</style>
