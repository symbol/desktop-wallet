<template>
    <FormWrapper>
        <div>
            <span>{{ messageDisplay }}</span>
            <span v-if="isEncrypted && !unannounced">
                <button class="centered-button button-style back-button float-right" @click="hasAccountUnlockModal = true">
                    {{ $t('decrypt_message') }}
                </button>
            </span>
        </div>
        <ModalFormProfileUnlock
            v-if="hasAccountUnlockModal"
            :visible="hasAccountUnlockModal"
            :on-success="onAccountUnlocked"
            @close="hasAccountUnlockModal = false"
        />
    </FormWrapper>
</template>

<script lang="ts">
import { MessageDisplayTs } from './MessageDisplayTs';

export default class MessageDisplay extends MessageDisplayTs {}
</script>
