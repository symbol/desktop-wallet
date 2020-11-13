<template>
    <FormWrapper :whitelisted="true">
        <div>
            <span>{{ messageDisplay }}</span>
            <span v-if="isEncrypted && !unannounced">
                <button class="button-style inverted-button float-right pl-2 pr-2" @click="hasAccountUnlockModal = true" style="padding-top: 0.03rem;">
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
