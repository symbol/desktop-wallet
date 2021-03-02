<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" class="modal-confirm" :title="$t(title)" :transfer="false" :footer-hide="true">
            <div class="container">
                <div v-if="danger" class="centered-content bottom-space">
                    <Icon type="ios-alert-outline" size="50" />
                </div>
                <h5 class="centered-content bottom-space">
                    {{ $t(message) }}
                </h5>
                <div v-if="showCheckbox" class="checkbox-container bottom-space">
                    <Checkbox id="Confirmed" :value="isCheckboxChecked" @input="onCheckboxCheck">
                        {{ $t(checkboxLabel) }}
                    </Checkbox>
                </div>
            </div>
            <div class="footer bottom-space">
                <button class="secondary-outline-button" @click="cancel">
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
