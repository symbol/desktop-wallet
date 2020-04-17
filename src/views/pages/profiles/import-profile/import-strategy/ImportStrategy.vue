<template>
  <div class="import-way-wrapper radius">
    <div class="import-way-inner-panel">
      <div class="welcome-head">
        <p class="title">
          {{ $t('access_my_profile') }}
        </p>
        <p class="title-tips">
          {{ $t('existing_profile') }}
          <span class="create-profile" @click="$router.push({ name: 'profiles.login' })">
            {{ $t('go_to_login') }}
          </span>
        </p>
      </div>
      <div class="profile-type">
        <div v-for="(item, index) in importInfoList" :key="index" class="profile-item" @click="redirect(item.route)">
          <div class="img-box radius">
            <img :src="item.image" />
          </div>
          <p class="access-name">
            {{ $t(item.title) }}
          </p>
          <p class="access-info">
            {{ $t(item.description) }}
          </p>
        </div>
      </div>
      <div class="bottom-text">
        <div class="link" @click="$router.push({ name: 'accounts.importPrivateKey.fillInfo' })">
          <span v-html="$t('you_can_Import_private_key_here')" />
        </div>
        <div>{{ $t('More_Access_Tool_is_working') }}...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ImportStrategyTs from './ImportStrategyTs'
import './ImportStrategy.less'

export default class ImportStrategy extends ImportStrategyTs {}
</script>
