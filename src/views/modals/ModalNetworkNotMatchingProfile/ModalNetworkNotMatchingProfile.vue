<template>
    <div>
        <Modal
            v-model="show"
            class="modal-network-not-matching-container"
            :title="$t('profile_not_matching_network_warning_title')"
            :footer-hide="true"
        >
            <div class="container">
                <div class="centered-content bottom-space">
                    <Icon type="ios-warning-outline" size="65" />
                </div>
                <div class="centered-content bottom-space">
                    <h2>
                        {{ $t('profile_not_matching_network_warning_message') }}
                    </h2>
                </div>
                <div class="centered-content bottom-space">
                    <button class="centered-button button-style validation-button right-space" @click="logout()">
                        {{ $t('profile_not_matching_network_option_1') }}
                    </button>
                    <button class="centered-button button-style validation-button right-space" @click="createNewProfile()">
                        {{ $t('profile_not_matching_network_option_2') }}
                    </button>
                    <button class="centered-button button-style validation-button" @click="$emit('close')">
                        {{ $t('profile_not_matching_network_option_3') }}
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalNetworkNotMatchingProfileTs } from './ModalNetworkNotMatchingProfileTs';
export default class ModalNetworkNotMatchingProfile extends ModalNetworkNotMatchingProfileTs {}
</script>

<style lang="less" scoped>
@import './ModalNetworkNotMatchingProfile.less';
</style>
