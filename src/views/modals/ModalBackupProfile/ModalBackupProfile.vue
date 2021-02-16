<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" :title="$t('modal_title_backup_profile')" :transfer="false">
            <div class="form-unlock">
                <FormProfileUnlock v-if="!accountUnlocked" @success="onAccountUnlocked" @error="onError" />
            </div>
            <div v-if="accountUnlocked" class="body">
                <div class="explain">
                    <span class="subtitle">{{ $t('backup_profile_explanation_title') }}</span>
                    <p v-html="$t('backup_profile_explanation_desc')"></p>
                </div>
            </div>
            <div slot="footer" class="modal-footer">
                <Button
                    v-if="accountUnlocked"
                    class="button-style solid-button fat-button inverted-button download-button"
                    :loading="downloadInProgress"
                    @click="onDownload"
                >
                    <Icon :type="'md-download'" size="17" /> {{ $t('button_download') }}
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalBackupProfileTs } from './ModalBackupProfileTs';

export default class ModalBackupProfile extends ModalBackupProfileTs {}
</script>

<style lang="less" scoped>
@import './ModalBackupProfile.less';
</style>
