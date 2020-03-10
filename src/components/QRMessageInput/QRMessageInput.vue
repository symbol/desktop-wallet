<template>
  <ValidationProvider
    v-slot="{ errors }"
    mode="lazy"
    vid="message"
    :name="$t('message')"
    :rules="validationRules.message"
    tag="div"
    class="inputs-container"
  >
    <ErrorTooltip :errors="errors">
      <textarea
        v-model="plain"
        class="textarea-size textarea-style"
        :placeholder="$t('Please_enter_notes')"
      />
    </ErrorTooltip>
  </ValidationProvider>
</template>

<script lang="ts">
import {QRMessageInputTs} from './QRMessageInputTs'
import './QRMessageInput.less'
export default class QRMessageInput extends QRMessageInputTs {}
</script>
