<template>
  <div class="import-profile-wrapper radius">
    <div class="inner-container">
      <div v-if="isLedger">
        <p class="create-profile-box">
          {{ $t('profile_import') }}
        </p>
      </div>
      <div v-if="!isLedger">
        <p class="create-profile-box">
          {{ $t('ledger_profile_import') }}
        </p>
      </div>
      <div class="step-bar-container">
        <img :src="$route.meta.icon" />
        <div class="step-text-container">
          <span v-for="(text, index) in titleList" :key="index" :class="getStepClassName(index)">{{ $t(text) }}</span>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import ImportProfileTs from './ImportProfileTs'
export default class ImportProfile extends ImportProfileTs {}
</script>
<style lang="less" scoped>
@import './ImportProfile.less';
</style>
