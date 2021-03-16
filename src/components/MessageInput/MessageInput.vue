<template>
    <FormRow>
        <template v-slot:label> {{ $t('message') }}: </template>
        <template v-slot:inputs class="fixed-height">
            <ValidationProvider
                v-slot="{ errors }"
                vid="message"
                :name="$t('message')"
                :rules="validationRules.message"
                tag="div"
                class="inputs-container fixed-height"
            >
                <ErrorTooltip :errors="errors" class="fixed-height">
                    <textarea
                        v-model="plain"
                        wrap="off"
                        class="textarea-size textarea-style message-box fixed-height"
                        :placeholder="$t('please_enter_notes')"
                    />
                </ErrorTooltip>
            </ValidationProvider>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { MessageInputTs } from './MessageInputTs';
export default class MessageInput extends MessageInputTs {}
</script>

<style lang="less" scoped>
@import './MessageInput.less';
</style>
