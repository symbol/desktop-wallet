<template>
    <div>
        <button class="button-style button danger-button" @click="showConfirmationModal = true">
            {{ $t('delete_profile') }}
        </button>
        <ModalConfirm
            v-model="showConfirmationModal"
            :title="$t('delete_profile_confirmation_title')"
            :message="$t('delete_profile_confirmation_message', { profileName: currentProfile.profileName })"
            :danger="true"
            :show-checkbox="true"
            :checkbox-label="$t('delete_profile_confirmation_checkbox')"
            @confirmed="deleteProfile"
        />
    </div>
</template>
<script lang="ts">
import { DeleteProfileButtonTs } from './DeleteProfileButtonTs';
export default class DeleteProfileButton extends DeleteProfileButtonTs {}
</script>
<style lang="less" scoped>
@import './DeleteProfileButton.less';
</style>
