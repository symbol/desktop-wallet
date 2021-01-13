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
                    </div>
                </div>
                <div v-if="getCurrentStep() === 1">
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
import AccessLedgerTs from './AccessLedgerTs';
export default class AccessLedger extends AccessLedgerTs {}
</script>
<style lang="less" scoped>
@import './AccessLedger.less';
</style>
