<template>
  <div>
    <Modal
      v-model="isShowModal"
      class="settings-modal-container"
      :footer-hide="true"
      :title="$t('sidebar_item_settings')"
    >
      <SymbolTabs class="settings-tabs-container">
        <SymbolTabPane v-if="!$route.path.match(/^\/profiles/)" :label="$t('page_title_settings_general')">
          <FormGeneralSettings />
        </SymbolTabPane>
        <SymbolTabPane v-if="!$route.path.match(/^\/profiles/)" :label="$t('page_title_settings_password')">
          <FormProfilePasswordUpdate />
        </SymbolTabPane>
        <SymbolTabPane :label="$t('network_settings')">
          <FormNodeEdit />
        </SymbolTabPane>
        <SymbolTabPane v-if="!$route.path.match(/^\/profiles/)" :label="$t('page_title_settings_about')">
          <AboutPage />
        </SymbolTabPane>
      </SymbolTabs>
    </Modal>
  </div>
</template>
<script lang="ts">
import { ModalSettingsTs } from './ModalSettingsTs'
export default class ModalSettings extends ModalSettingsTs {}
</script>
<style lang="less" scoped>
@import './ModalSettings.less';
</style>
