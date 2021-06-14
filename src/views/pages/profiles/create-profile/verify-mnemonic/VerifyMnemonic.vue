<template>
    <div class="check-mnemonic-sec">
        <p class="set-title-create">
            {{ $t('verify_mnemonics') }}
        </p>
        <div class="check-mnemonic-col">
            <div class="check-mnemonic-left">
                <MnemonicVerification
                    :words="mnemonicWordsList"
                    @success="$router.push({ name: 'profiles.createProfile.finalize' })"
                    @cancelled="$router.back()"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import VerifyMnemonicTs from './VerifyMnemonicTs';
export default class VerifyMnemonic extends VerifyMnemonicTs {}
</script>
<style lang="less" scoped>
@import './VerifyMnemonic.less';
</style>
