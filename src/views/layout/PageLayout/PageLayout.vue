<template>
  <div class="mac wrap">
    <div v-if="alert.show">
      <Alert class="alert warning-alert" type="error">
        <Icon type="ios-warning-outline" />
        {{ $t(`${alert.message}`) }}
      </Alert>
    </div>
    <div v-else-if="info.show">
      <Alert class="alert success-alert" type="success">
        <Icon type="ios-bulb-outline" />
        {{ $t(`${info.message}`) }}
      </Alert>
    </div>

    <PageNavigator v-if="!$route.matched.map(({ name }) => name).includes('profiles')" />

    <div class="top-window">
      <AppLogo />
      <div class="controller">
        <WindowControls />
        <div class="app-controller">
          <DebugConsole />
          <PeerSelector />
          <LanguageSelector />
          <AccountSelectorField @input="onChangeAccount" />
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="main-outer-container">
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { PageLayoutTs } from './PageLayoutTs'
export default class PageLayout extends PageLayoutTs {}
</script>
<style lang="less" scoped>
@import './PageLayout.common.less';
</style>
