<template>
    <div class="create-profile-wrapper radius">
        <div class="explanation-box">
            <div class="text-wrapper">
                <div v-if="getCurrentStep() === 0">
                    <div class="right-hints-section">
                        <p class="text1">
                            {{ $t('profile_description') }}
                        </p>
                        <p class="text">
                            {{ $t('profile_description_tips1') }}
                        </p>
                        <p class="text">
                            {{ $t('profile_description_tips2') }}
                        </p>
                        <p class="text red">
                            {{ $t('profile_description_tips3') }}
                        </p>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 1">
                    <div class="right-hints-section">
                        <p class="title">
                            MNEMONIC
                        </p>
                        <p class="text">
                            {{ $t('move_your_mouse') }}
                        </p>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 2">
                    <div class="create-mnemonic-right">
                        <Alert type="warning" show-icon>
                            {{ $t('do_not_disclose_title') }}
                            <template slot="desc">
                                {{ $t('do_not_disclose') }}
                            </template>
                        </Alert>
                        <Alert type="success" show-icon>
                            {{ $t('please_backup_mnemonic_passphrase_title') }}
                            <template slot="desc">
                                {{ $t('please_backup_mnemonic_passphrase') }}

                                <div class="mnemonic-backup-options-desc">
                                    <span>
                                        <p>
                                            <Icon type="md-download" />
                                            {{ $t('mnemonic_backup_options_download_desc') }}
                                        </p>
                                    </span>
                                    <span>
                                        <p>
                                            <Icon type="md-copy" />
                                            {{ $t('mnemonic_backup_options_copy_desc') }}
                                        </p>
                                    </span>
                                </div>
                            </template>
                        </Alert>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 3">
                    <p class="text1">
                        {{ $t('tips') }}
                    </p>
                    <p class="text">
                        {{ $t('the_backup_is_wrong') }}
                    </p>
                </div>
                <div v-if="getCurrentStep() === 4">
                    <span class="set-title"> {{ $t('creation_successful') }}</span>
                </div>
            </div>
        </div>
        <div class="form-box">
            <div class="steps">
                <div v-for="(text, index) in StepBarTitleList" :key="index" :class="['single-step', getStepClassName(index)]">
                    {{ $t(text) }}
                </div>
            </div>
            <div class="form">
                <router-view />
            </div>
        </div>

        <div class="inner-container" style="display: none;">
            <p class="create-profile-box">
                {{ $t('generate_a_new_profile') }}
            </p>
            <div class="step-bar-container">
                <img :src="$route.meta.icon" />
                <div class="step-text-container">
                    <span v-for="(text, index) in StepBarTitleList" :key="index" :class="getStepClassName(index)">{{ $t(text) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import CreateProfileTs from './CreateProfileTs';
export default class CreateProfile extends CreateProfileTs {}
</script>
<style lang="less" scoped>
@import './CreateProfile.less';
</style>
