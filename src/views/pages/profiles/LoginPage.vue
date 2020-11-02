<template>
    <div class="login-profile-wrapper">
        <VideoBackground class="video-background-section" :src="require('@/views/resources/videos/symbol_3d_rotate.mp4')">
            <ValidationObserver v-slot="{ handleSubmit }" slim>
                <form onsubmit="event.preventDefault()">
                    <div class="switch-language-container">
                        <LanguageSelector />
                    </div>
                    <div class="welcome-box">
                        <div class="banner-image">
                            <span class="top-welcome-text">{{ $t('welcome_to_symbol') }}</span>
                            <div class="bottom-welcome-text">{{ $t('program_description_line1') }}</div>
                            <div class="bottom-welcome-text">{{ $t('program_description_line2') }}</div>
                            <div class="bottom-welcome-text">{{ $t('program_description_line3') }}</div>
                        </div>
                        <div class="login-card radius">
                            <div class="img-box" />
                            <p class="login-title">
                                {{ $t('login_to_symbol_account') }}
                            </p>
                            <p class="profile-name">
                                {{ $t('profile_name') }}
                            </p>
                            <ValidationProvider v-slot="{ errors }" :name="$t('profile_name')" :rules="`in:${profileNames}`" slim>
                                <ErrorTooltip field-name="profile_name" :errors="errors">
                                    <input v-show="false" v-model="formItems.currentProfileName" />

                                    <AutoComplete
                                        v-model="formItems.currentProfileName"
                                        placeholder=" "
                                        :class="['select-account', !profilesClassifiedByNetworkType ? 'un_click' : 'profile-name-input']"
                                    >
                                        <div class="auto-complete-sub-container scroll">
                                            <div class="tips-in-sub-container">
                                                {{ $t(profilesClassifiedByNetworkType ? 'select_a_profile' : 'no_profiles_in_database') }}
                                            </div>
                                            <div v-if="profilesClassifiedByNetworkType">
                                                <div v-for="pair in profilesClassifiedByNetworkType" :key="pair.networkType">
                                                    <div v-if="pair.profiles.length">
                                                        <span class="network-type-head-title">{{
                                                            getNetworkTypeLabel(pair.networkType)
                                                        }}</span>
                                                    </div>
                                                    <Option
                                                        v-for="(profile, index) in pair.profiles"
                                                        :key="`${profile.profileName}${index}`"
                                                        :value="profile.profileName"
                                                        :label="profile.profileName"
                                                    >
                                                        <span>{{ profile.profileName }}</span>
                                                    </Option>
                                                </div>
                                            </div>
                                        </div>
                                    </AutoComplete>
                                </ErrorTooltip>
                            </ValidationProvider>
                            <p class="input-password">
                                {{ $t('password') }}
                            </p>
                            <ValidationProvider
                                v-slot="{ errors }"
                                mode="lazy"
                                vid="password"
                                :name="$t('password')"
                                rules="required|min:8"
                            >
                                <ErrorTooltip field-name="password" :errors="errors">
                                    <input
                                        v-model="formItems.password"
                                        v-focus
                                        :class="[!profilesClassifiedByNetworkType ? 'un_click' : '']"
                                        :placeholder="$t('please_enter_your_account_password')"
                                        type="password"
                                        :disabled="!profilesClassifiedByNetworkType"
                                    />
                                </ErrorTooltip>
                            </ValidationProvider>

                            <div class="password-tip">
                                <span class="prompt pointer" @click="formItems.hasHint = !formItems.hasHint">{{
                                    $t('password_hint')
                                }}</span>
                                <span
                                    class="pointer create-profile"
                                    @click="
                                        $router.push({
                                            name: 'profiles.importProfile.importStrategy',
                                        })
                                    "
                                >
                                    {{ $t('create_a_new_account') }}?
                                </span>
                            </div>
                            <div v-if="formItems.hasHint" class="hint">{{ $t('password_hint') }}: {{ getPasswordHint() }}</div>
                            <button
                                v-if="profilesClassifiedByNetworkType"
                                class="pointer button"
                                type="submit"
                                @click.stop="handleSubmit(submit)"
                            >
                                {{ $t('login') }}
                            </button>
                            <div v-else class="pointer button" @click="$router.push({ name: 'profiles.importProfile.importStrategy' })">
                                {{ $t('register') }}
                            </div>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
            <span class="version-panel">{{ $t('version') }}: {{ packageVersion }}</span>
            <span class="powered_by_label">{{ $t('powered_by') }}</span>
        </VideoBackground>
    </div>
</template>

<script lang="ts">
import LoginPageTs from './LoginPageTs';
export default class LoginPage extends LoginPageTs {}
</script>
<style lang="less" scoped>
@import './LoginPage.less';
</style>
