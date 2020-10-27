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

                <Button class="button-style validation-button download-button" :loading="downloadInProgress" @click="onDownload">
                    <span v-if="!downloadInProgress"> <Icon :type="'md-download'" size="20" /> {{ $t('button_download') }}</span>
                </Button>
            </div>

            <div slot="footer" class="modal-footer">
                <button type="submit" class="centered-button button-style back-button float-right" @click="show = false">
                    {{ $t('close') }}
                </button>
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
