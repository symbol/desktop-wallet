<template>
    <div class="FormTransferTransaction">
        <button @click="onProfileNameChange2">Check</button>
        <FormRow>
            <template v-slot:label>
                <span>{{ $t('profile_name') }}:</span>
            </template>
            <template v-slot:inputs>
                <ValidationProvider v-slot="{ errors }" :name="$t('profile_name')" :rules="`in:${profileNames}`" slim>
                    <ErrorTooltip field-name="profile_name" :errors="errors">
                        <input v-show="false" v-model="formItems.currentProfileName" />

                        <AutoComplete
                                v-model="formItems.currentProfileName"
                                placeholder=" "
                                :class="['select-account', !profilesClassifiedByNetworkType ? 'un_click' : 'profile-name-input']"
                                :disabled="performingLogin"
                                @on-select="onProfileNameChange2"
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
            </template>
        </FormRow>
        <FormTransferTransaction v-if="loaded" @txSigned="onSignedOfflineTransaction" />

        <!-- force mosaic list reactivity -->
    </div>
</template>

<script lang="ts">
import { FormOfflineTransferTransactionTs } from './FormOfflineTransferTransactionTs';
export default class FormOfflineTransferTransaction extends FormOfflineTransferTransactionTs {}
</script>

<style lang="less" scoped>
.save-button {
    text-align: center;
    width: 120px;
}

/deep/.multisig_ban_container {
    padding-left: 0.7rem;
}
</style>
