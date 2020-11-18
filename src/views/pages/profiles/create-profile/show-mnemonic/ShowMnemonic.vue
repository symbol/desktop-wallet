<template>
    <div class="create-mnemonic-sec" @keyup.enter="$router.push({ name: 'profiles.createProfile.verifyMnemonic' })">
        <p class="set-title-create">
            {{ $t('backup_mnemonic_words') }}
            <img src="@/views/resources/img/icons/Incoming.svg" class="clipboard-icon" />
        </p>
        <div class="create-mnemonic-col">
            <div class="create-mnemonic-left">
                <MnemonicDisplay :words="mnemonicWordsList">
                    <div slot class="mnemonic-container">
                        <div v-if="!showMnemonic" class="show-mnemonic">
                            <img src="@/views/resources/img/icons/View.svg" style="margin-top: 10px;" />
                            <button class="inverted-button button-style fat-button create-account-style" @click="showMnemonic = true">
                                {{ $t('display_mnemonic') }}
                            </button>
                        </div>
                        <div v-else>
                            <div class="mnemonic-list">
                                <span v-for="(m, index) in mnemonicWordsList" :key="index">{{ m }}</span>
                            </div>
                            <ButtonCopyToClipboard v-model="waitingCopyString" class="copy-button" />
                        </div>
                    </div>
                </MnemonicDisplay>
                <div class="form-line-container button-container">
                    <div class="float-right mt-3">
                        <button
                            type="button"
                            class="solid-button button-style fat-button create-account-style"
                            @click="$router.push({ name: 'profiles.createProfile.info' })"
                        >
                            {{ $t('back') }}
                        </button>
                        <button
                            type="button"
                            class="solid-button button-style fat-button create-account-style"
                            @click="downloadPaperWallet"
                        >
                            {{ $t('button_download_qr') }}
                        </button>
                        <button
                            type="submit"
                            class="inverted-button button-style fat-button create-account-style"
                            @click="$router.push({ name: 'profiles.createProfile.verifyMnemonic' })"
                        >
                            {{ $t('verify_backup_mnemonics') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ShowMnemonicTs from './ShowMnemonicTs';
export default class ShowMnemonic extends ShowMnemonicTs {}
</script>
<style lang="less" scoped>
@import './ShowMnemonic.less';
</style>
