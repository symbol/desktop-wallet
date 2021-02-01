<template>
    <div class="finish-sec" @keyup.enter="$router.push({ name: 'dashboard' })">
        <div class="finish-col">
            <div class="finish-left">
                <p class="text1">
                    {{ $t('safe_storage_tips') }}
                </p>

                <ul class="ml-2">
                    <li class="text list-item-with-disc">{{ $t('save_backups') }}</li>
                    <li class="text list-item-with-disc">{{ $t('do_not_share_mnemonics_with_anyone') }}</li>
                    <li class="text list-item-with-disc">{{ $t('phishing_warning') }}</li>
                    <li class="text list-item-with-disc">{{ $t('if_you_need_to_back_up_your_mnemonics_again_you_can') }}</li>
                </ul>
                <div class="flex bottom-space">
                    <Checkbox v-model="marked">
                        <span>{{ $t('please_approve') }}</span>
                        <a class="link" @click="displayModal('termsAndConditions')">
                            {{ $t('terms_and_conditions') }}
                        </a>
                        &
                        <a class="link" @click="displayModal('privacyAndPolicy')">
                            {{ $t('privacy_policy') }}
                        </a>
                        <span>.</span>
                    </Checkbox>
                </div>
                <div class="jump-btn">
                    <button
                        class="solid-button button-style create-account-style"
                        @click="$router.push({ name: 'profiles.importProfile.walletSelection' })"
                    >
                        {{ $t('back') }}
                    </button>
                    <button class="button-style validation-create-button" :disabled="!marked" @click="$router.push({ name: 'dashboard' })">
                        {{ $t('finish') }}
                    </button>
                </div>
            </div>
        </div>
        <ModalTermsAndConditions
            v-if="modalVisibility.termsAndConditions"
            :visible="modalVisibility.termsAndConditions"
            @close="closeModal('termsAndConditions')"
        />
        <ModalPrivacyAndPolicy
            v-if="modalVisibility.privacyAndPolicy"
            :visible="modalVisibility.privacyAndPolicy"
            @close="closeModal('privacyAndPolicy')"
        />
    </div>
</template>

<script>
import FinalizeTs from './FinalizeTs';

export default class Finalize extends FinalizeTs {}
</script>
<style lang="less" scoped>
@import './Finalize.less';
</style>
