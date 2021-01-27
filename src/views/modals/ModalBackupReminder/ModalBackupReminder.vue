<template>
    <div>
        <Modal v-model="show" class="modal-backup-reminder" :title="$t('modal_backup_reminder_title')" :footer-hide="true">
            <div class="container">
                <div class="centered-content bottom-space">
                    <Icon type="ios-alert-outline" size="50" />
                </div>
                <div class="centered-content bottom-space">
                    <h2>
                        {{ $t('please_backup_private_key_account') }}
                    </h2>
                </div>
                <div class="centered-content bottom-space">
                    <button
                        class="centered-button button-style inverted-button pl-2 pr-2"
                        @click="show(false)"
                    >
                        {{ $t('understand_button_title') }}
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalBackupReminderTs } from './ModalBackupReminderTs';
export default class ModalBackupReminder extends ModalBackupReminderTs {}
</script>

<style lang="less" scoped>
@import './ModalBackupReminder.less';
</style>
