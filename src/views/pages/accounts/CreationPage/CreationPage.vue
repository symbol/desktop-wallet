<template>
  <div class="create-page-wrapper">
    <div class="step-box-container">
      <StepBar :current-step="parseInt($route.meta.extension, 10)" />
    </div>
    <div class="page-detail-container">
      <div v-if="$route.meta.title && $route.meta.title.length !== 0" class="page-content-title">
        {{ $t($route.meta.title) }}
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import CreationPageTs from './CreationPageTs'
import './CreationPage.less'
export default class CreationPage extends CreationPageTs {}
</script>

