<template>
  <div class="finish-sec scroll" @keyup.enter="submit">
    <img src="@/views/resources/img/success.png" alt />
    <span class="set-title"> {{ $t('import_private_key_account_successfully') }}</span>
    <p class="set-title-tips">
      {{ $t('import_private_key_account_successfully_title_tips') }}
    </p>
    <div class="finish-col">
      <div class="finish-left">
        <p class="text1">{{ $t('tips') }}:</p>
        <p class="text">
          {{ $t('import_private_key_finalize_tip_text1') }}
        </p>
        <div class="jump-btn">
          <button class="button-style validation-button" @click="$router.push({ name: 'dashboard' })">
            {{ $t('next') }}
          </button>
        </div>
      </div>
      <div class="finish-right">
        <img src="@/views/resources/img/finish.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import FinalizeTs from './FinalizeTs'
import './Finalize.less'

export default class Finalize extends FinalizeTs {}
</script>
