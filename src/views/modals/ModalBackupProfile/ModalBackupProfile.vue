<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" :title="$t('modal_title_backup_profile')" :transfer="false">
            <div class="form-unlock">
                <FormProfileUnlock v-if="!accountUnlocked" @success="onAccountUnlocked" @error="onError" />
            </div>
            <div v-if="accountUnlocked" class="body">
                <div class="explain">
                    <span class="subtitle">{{ $t('backup_profile_explanation_title') }}</span>
                    <p>{{ $t('backup_profile_explanation_desc') }}</p>
                </div>

                <button class="button-style solid-button fat-button" :loading="downloadInProgress" @click="onDownload">
                    <span> <Icon :type="'md-download'" size="12" /> {{ $t('button_download') }}</span>
                </button>
                <br />
                <p class="temp_notif">
                    <span v-if="downloadInProgress">{{ $t('progress') }}</span>
                </p>
            </div>

            <div slot="footer" class="modal-footer"></div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalBackupProfileTs } from './ModalBackupProfileTs';

export default class ModalBackupProfile extends ModalBackupProfileTs {}
</script>

<style lang="less" scoped>
@import './ModalBackupProfile.less';

.temp_notif {
    margin-top: 0.5em;
    color: @primary;
}
</style>
