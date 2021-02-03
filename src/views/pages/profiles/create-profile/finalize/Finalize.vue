<template>
    <div class="finish-sec scroll" @keyup.enter="submit">
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
                        <a class="link" href="#/terms">
                            {{ $t('terms_and_conditions') }}
                        </a>
                        &
                        <a class="link" href="#/privacy">
                            {{ $t('privacy_policy') }}
                        </a>
                        <span>.</span>
                    </Checkbox>
                </div>
                <div class="buttons clear">
                    <div class="float-right">
                        <button type="button" class="solid-button button-style fat-button create-account-style" @click="$router.back()">
                            {{ $t('back') }}
                        </button>
                        <button
                            type="submit"
                            class="inverted-button button-style fat-button create-account-style"
                            :disabled="isLoading || !marked"
                            @click="submit"
                        >
                            {{ $t('finish') }}
                        </button>
                    </div>
                </div>
                <Spin v-if="isLoading" size="large" fix class="absolute" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import FinalizeTs from './FinalizeTs';
export default class Finalize extends FinalizeTs {}
</script>
<style lang="less" scoped>
@import './Finalize.less';
</style>
