<template>
    <div>
        <Modal v-model="show" class="modal-terms-and-conditions" :title="$t('terms_and_conditions')" :footer-hide="true">
            <div class="container">
                <div class="centered-content bottom-space">
                    <Icon type="ios-alert-outline" size="50" />
                </div>
                <div class="centered-content bottom-space">
                    <h2>
                        {{ $t('please_approve_terms_and_conditions') }}
                    </h2>
                </div>
                <div class="centered-content link" @click="$router.push({ name: 'terms' })">
                    <h3>{{ $t('terms_and_conditions') }}</h3>
                </div>
                <div class="centered-content link bottom-space" @click="$router.push({ name: 'privacy' })">
                    <h3>{{ $t('privacy_policy') }}</h3>
                </div>
                <div class="centered-content bottom-space">
                    <Checkbox v-model="marked">
                        {{ $t('Accept') }}
                    </Checkbox>
                </div>
                <div class="centered-content bottom-space">
                    <button
                        class="centered-button button-style inverted-button pl-2 pr-2 right-space"
                        :disabled="!marked"
                        @click="approveTermsAndConditions()"
                    >
                        {{ $t('confirm') }}
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalTermsAndConditionsTs } from './ModalTermsAndConditionsTs';
export default class ModalTermsAndConditions extends ModalTermsAndConditionsTs {}
</script>

<style lang="less" scoped>
@import './ModalTermsAndConditions.less';
</style>
