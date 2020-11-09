<template>
    <div class="finish-sec scroll" @keyup.enter="submit">
        <div class="finish-col">
            <div class="finish-left">
                <p class="text1">
                    {{ $t('safe_storage_tips') }}
                </p>
                <p class="text">· {{ $t('save_backups') }}</p>
                <p class="text">· {{ $t('do_not_share_mnemonics_with_anyone') }}</p>
                <p class="text">· {{ $t('phishing_warning') }}</p>
                <p class="text">
                    ·
                    {{ $t('if_you_need_to_back_up_your_mnemonics_again_you_can') }}
                </p>
                <div class="buttons clear">
                    <div class="float-right mt-3">
                        <button type="button" class="solid-button button-style fat-button create-account-style" @click="$router.back()">
                            {{ $t('back') }}
                        </button>
                        <button type="submit" class="inverted-button button-style fat-button create-account-style" @click="submit">
                            {{ $t('next') }}
                        </button>
                    </div>
                </div>
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
