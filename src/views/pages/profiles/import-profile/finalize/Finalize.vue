<template>
    <div class="finish-sec" @keyup.enter="$router.push({ name: 'dashboard' })">
        <div class="finish-col">
            <div class="finish-left">
                <p class="text1">
                    {{ $t('safe_storage_tips') }}
                </p>
                <p class="text with-disc">
                    {{ $t('save_backups') }}
                </p>
                <p class="text with-disc">
                    {{ $t('do_not_share_mnemonics_with_anyone') }}
                </p>
                <p class="text with-disc">
                    {{ $t('phishing_warning') }}
                </p>
                <p class="text with-disc">
                    {{ $t('if_you_need_to_back_up_your_mnemonics_again_you_can') }}
                </p>
                <div class="jump-btn">
                    <button
                        class="solid-button button-style create-account-style"
                        @click="$router.push({ name: 'profiles.importProfile.walletSelection' })"
                    >
                        {{ $t('back') }}
                    </button>
                    <button class="button-style validation-create-button" @click="$router.push({ name: 'dashboard' })">
                        {{ $t('finish') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FinalizeTs from './FinalizeTs';

export default class Finalize extends FinalizeTs {}
</script>
<style lang="less" scoped>
@import './Finalize.less';
</style>
