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
                        <p class="text_red">
                            {{ $t('profile_description_tips3') }}
                        </p>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 1">
                    <div class="right-hints-section">
                        <p class="text1">
                            {{ $t('generate_mnemonic_title') }}
                        </p>
                        <p class="text">
                            {{ $t('move_your_mouse_tip1') }}
                        </p>
                        <p class="text_red">
                            {{ $t('move_your_mouse') }}
                        </p>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 2">
                    <div class="create-mnemonic-right">
                        <div class="right-hints-section">
                            <p class="text1">
                                {{ $t('do_not_disclose_title_mnemonic') }}
                            </p>
                            <p class="text">
                                <span class="subtitle-info">
                                    <img src="@/views/resources/img/icons/warning.svg" class="warning-icon" />
                                    {{ $t('do_not_disclose_title') }}</span
                                ><br />
                                <span>{{ $t('do_not_disclose') }}</span>
                            </p>
                            <p class="text">
                                <span class="subtitle-info">
                                    <img src="@/views/resources/img/icons/warning.svg" class="warning-icon" />{{
                                        $t('please_backup_mnemonic_passphrase_title')
                                    }}</span
                                ><br />
                                <span>{{ $t('please_backup_mnemonic_passphrase') }}</span>
                            </p>
                        </div>
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
                    <img src="@/views/resources/img/icons/success.png" style="width: 30%;" />
                    <span class="success-title"> {{ $t('creation_successful') }}</span>
                </div>
            </div>
        </div>
        <div class="form-box">
            <div class="steps">
                <div class="step-group">
                    <div v-for="(text, index) in StepBarTitleList" :key="index" :class="['single-step', getStepClassName(index)]">
                        {{ $t(text) }}
                    </div>
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
