<template>
    <div class="import-profile-wrapper radius">
        <div class="explanation-box">
            <div class="text-wrapper">
                <div v-if="getCurrentStep() === 0">
                    <div class="right-hints-section">
                        <p class="text1">
                            {{ $t('profile_import') }}
                        </p>
                        <p class="text">
                            {{ $t('import_private_key_profile_description_tip1') }}
                        </p>
                        <p class="text">
                            {{ $t('import_private_key_profile_description_tip2') }}
                        </p>
                        <p class="text_red">
                            {{ $t('profile_description_tips3') }}
                        </p>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 1">
                    <div class="right-hints-section">
                        <p class="text1">
                            {{ $t('profile_import') }}
                        </p>
                        <p class="text">
                            {{ $t('input_mnemonic_tips') }}
                        </p>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 2" class="selected-accounts-container">
                    <div class="right-hints-section">
                        <p class="text1">
                            {{ $t('profile_import') }}
                        </p>
                        <div class="accounts-container">
                            <div class="accounts-container-title">
                                {{ $t('select_accounts') }}
                            </div>
                            <div v-if="selectedAccounts.length" class="address-list-container radius scroll">
                                <div class="address-list">
                                    <div class="table-title">
                                        <span class="address-id">{{ $t('id') }}</span>
                                        <span class="address-value">{{ $t('address') }}</span>
                                        <span class="address-balance overflow_ellipsis">{{ $t('balance') }}</span>
                                        <span class="remove-icon" />
                                    </div>
                                    <div class="radius">
                                        <div
                                            v-for="index in selectedAccounts"
                                            :key="index"
                                            class="table-item pointer"
                                            @click="onRemoveAddress(index)"
                                        >
                                            <span class="address-id"> {{ index + 1 }} </span>
                                            <span class="address-value">{{ formatters.miniAddress(addressesList[index]) }}</span>
                                            <span
                                                v-if="addressMosaicMap[addressesList[index].plain()]"
                                                class="address-balance overflow_ellipsis"
                                            >
                                                <MosaicAmountDisplay :absolute-amount="addressMosaicMap[addressesList[index].plain()]" />
                                            </span>
                                            <span v-else class="address-balance overflow_ellipsis">
                                                N/A
                                            </span>
                                            <span class="remove-icon"><img src="@/views/resources/img/Invisible@2x.png" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="getCurrentStep() === 3">
                    <img src="@/views/resources/img/icons/Incoming.svg" style="width: 30%;" />
                    <p class="text">
                        {{ $t('creation_successful') }}
                    </p>
                </div>
            </div>
        </div>
        <div class="form-box">
            <div class="steps">
                <div class="step-group">
                    <div v-for="(text, index) in StepBarTitleList" :key="index" :class="['single-step', getStepClassName(index)]">
                        <div class="check-container">
                            <img src="@/views/resources/img/icons/check-mark.png" alt="checked icon" />
                        </div>
                        <p>{{ $t(text) }}</p>
                    </div>
                </div>
            </div>
            <div class="form">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ImportProfileTs from './ImportProfileTs';
export default class ImportProfile extends ImportProfileTs {}
</script>
<style lang="less" scoped>
@import './ImportProfile.less';
</style>
