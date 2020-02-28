<template>
  <div class="form-account-setting-wrapper">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @keyup.enter="handleSubmit(submit)">
        <div class="form-row-item">
          <div class="form-label">
            {{ $t('Set_seed_hash') }}:
          </div>
          <div class="form-value">
            <p class="input-size form-value">
              C6DAFB1CDDF22089C76E7130DB7B2919B9AD3AEF1CEEE44C2ABCF1252B4458D6
            </p>
          </div>
        </div>
        <div class="form-row-item">
          <div class="form-label">
            {{ $t('Set_account_name') }}:
          </div>
          <div class="form-value">
            <ValidationProvider
              v-slot="{ errors }"
              vid="newAccountName"
              :name="$t('newAccountName')"
              :rules="validationRules.newAccountName"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <input
                  v-model="formItems.accountName"
                  v-focus
                  class="input-size input-style"
                  :placeholder="$t('account_name')"
                >
              </ErrorTooltip>
            </ValidationProvider>
          </div>
        </div>
        <div class="form-row-item">
          <div class="form-label">
            {{ $t('Set_password') }}:
          </div>
          <div class="form-value">
            <ValidationProvider
              v-slot="{ errors }"
              vid="newPassword"
              mode="lazy"
              :name="$t('password')"
              :rules="validationRules.password"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <input
                  ref="passwordInput"
                  v-model="formItems.password"
                  class="input-size input-style"
                  :placeholder="$t('please_enter_your_wallet_password')"
                  type="password"
                >
              </ErrorTooltip>
            </ValidationProvider>
          </div>
        </div>
        <div class="form-row-item">
          <div class="form-label">
            {{ $t('Set_repeat_password') }}:
          </div>
          <div class="form-value">
            <ValidationProvider
              v-slot="{ errors }"
              vid="confirmPassword"
              :name="$t('confirmPassword')"
              :rules="validationRules.confirmPassword"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <input
                  v-model="formItems.passwordAgain"
                  class="input-size input-style"
                  data-vv-name="confirmPassword"
                  :placeholder="$t('please_enter_your_new_password_again')"
                  type="password"
                >
              </ErrorTooltip>
            </ValidationProvider>
          </div>
        </div>
        <div class="form-row-item">
          <div class="form-label">
            {{ $t('Set_password_hint') }}:
          </div>
          <div class="form-value">
            <ValidationProvider
              v-slot="{ errors }"
              vid="hint"
              :name="$t('hint')"
              :rules="validationRules.message"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <input v-model="formItems.hint" class="input-size input-style">
              </ErrorTooltip>
            </ValidationProvider>
          </div>
        </div>
        <div class="form-button-row">
          <div class="form-button-container input-size">
            <ButtonStep @click="$router.back()">
              {{ $t('Previous_step') }}
            </ButtonStep>
            <ButtonStep :primary="true" @click="handleSubmit(submit)">
              {{ $t('Next_step') }}
            </ButtonStep>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { FormAccountSettingTs } from './FormAccountSettingTs'
import './FormAccountSetting.less'
export default class FormAccountSetting extends FormAccountSettingTs {}
</script>

