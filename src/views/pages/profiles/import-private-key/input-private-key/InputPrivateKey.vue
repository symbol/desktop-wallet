<template>
  <div class="input-private-key-container">
    <div class="left-container">
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form onsubmit="event.preventDefault()">
          <div class="input-private-key-form">
            <div class="row">
              <div class="title">
                <h1>{{ $t('enter_your_private_key') }}</h1>
              </div>
            </div>
            <div class="row">
              <FormRow :no-label="true">
                <template v-slot:inputs>
                  <ValidationProvider
                    v-slot="{ errors }"
                    vid="privateKey"
                    :name="$t('private_key')"
                    :rules="validationRules.privateKey"
                    tag="div"
                    class="inputs-container items-container"
                  >
                    <ErrorTooltip :errors="errors">
                      <input v-model="privateKey" class="input-size input-style" type="password" />
                    </ErrorTooltip>
                  </ValidationProvider>
                </template>
              </FormRow>
            </div>
            <div class="related-info">
              <div class="row">
                <span class="related-info-label">{{ $t('address') }}:</span>
                <span class="related-info-value">{{ address }}</span>
              </div>
              <div class="row">
                <span class="related-info-label">{{ $t('public_key') }}:</span>
                <span class="related-info-value">{{ publicKey }}</span>
              </div>
              <div class="row">
                <span class="related-info-label">{{ $t('network') }}:</span>
                <span class="related-info-value">{{ network }}</span>
              </div>
            </div>
          </div>
          <div class="buttons-container">
            <div class="flex-container mt-3">
              <button type="button" class="button-style back-button" @click="$router.back(-1)">
                {{ $t('back') }}
              </button>
              <button type="submit" class="button-style validation-button" @click="handleSubmit(createWalletByPrivate)">
                {{ $t('import_private_key') }}
              </button>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <div class="right-container">
      <div class="title">
        <h1>{{ $t('tips') }}</h1>
      </div>
      <div class="content">
        <p>{{ $t('import_private_key_input_tip1') }}{{ $t('import_private_key_input_tip2') }}</p>
        <p>{{ $t('import_private_key_input_tip3') }}</p>
        <p>{{ $t('import_private_key_input_tip4') }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import InputPrivateKeyTs from './InputPrivateKeyTs'
export default class InputPrivateKey extends InputPrivateKeyTs {}
</script>
<style lang="less" scoped>
@import './InputPrivateKey.less';
</style>
