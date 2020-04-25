<template>
  <div>
    <Modal
      v-model="isShowModal" class="setting-modal-container" :footer-hide="true"
      :title="$t('setting')"
    >
      <SymbolTabs class="setting-tabs-container">
        <SymbolTabPane label="General">
          <FormGeneralSettings />
        </SymbolTabPane>
        <!-- <SymbolTabPane label="Profile password">
          <FormAccountPasswordUpdate />
        </SymbolTabPane> -->
        <SymbolTabPane label="About">
          <AboutPage />
        </SymbolTabPane>
      </SymbolTabs>
    </Modal>
  </div>
</template>
<script lang="ts">
import { ModalSettingTs } from './ModalSettingTs'
export default class ModalSetting extends ModalSettingTs { }
</script>
<style lang="less" scoped>
  @import "./ModalSetting.less";
</style>
