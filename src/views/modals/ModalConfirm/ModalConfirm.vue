<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" class="modal-confirm" :transfer="false" :footer-hide="true">
            <div class="container">
                <div class="header bottom-space">
                    <div class="title">
                        {{ $t(title) }}
                    </div>
                    <div v-if="danger || warning" class="">
                        <img :src="officialIcons.warning" class="warning-icon" />
                    </div>
                </div>
                <div class="bottom-space body-text">{{ $t(message) }}</div>
                <div v-if="showCheckbox" class="checkbox-container bottom-space">
                    <Checkbox id="Confirmed" :value="isCheckboxChecked" @input="onCheckboxCheck">
                        <span class="checkbox-label">
                            {{ $t(checkboxLabel) }}
                        </span>
                    </Checkbox>
                </div>
            </div>
            <div class="footer">
                <button class="ivu-btn secondary-outline-button button-style button" @click="cancel">
                    {{ $t('cancel') }}
                </button>
                <button
                    class="ivu-btn centered-button button-style button"
                    :class="{ 'danger-button': danger, 'inverted-button': !danger }"
                    :disabled="!isOkClickable"
                    @click="confirm"
                >
                    {{ $t('confirm') }}
                </button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import ModalConfirmTs from './ModalConfirmTs';

export default class ModalConfirm extends ModalConfirmTs {}
</script>

<style lang="less" scoped>
@import './ModalConfirm.less';
</style>
