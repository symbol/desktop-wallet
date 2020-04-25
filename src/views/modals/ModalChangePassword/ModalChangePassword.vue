<template>
  <div>
    <Modal
      v-model="isShowModal" class="change-password-modal-container modal-container" 
      :title="$t('change_password')"
      :footer-hide="true" 
      :transfer="false"
    >
      <FormAccountPasswordUpdate />
    </Modal>
  </div>
</template>
<script lang="ts">
import { ModalChangePasswordTs } from './ModalChangePasswordTs'
export default class ModalChangePassword extends ModalChangePasswordTs { }
</script>
<style lang="less" scoped>
  @import "./ModalChangePassword.less";
</style>
