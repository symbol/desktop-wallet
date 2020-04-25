<template>
  <div class="profile-info-container">
    <Poptip placement="bottom-end" offset="10" :capture="true">
      <Icon type="ios-contact-outline" />
      <div slot="content" class="profile-info-content">
        <div>
          <Row>
            <i-col span="12" class="row-label">
              {{ $t('profile_name') }}&nbsp;:
            </i-col>
            <i-col span="12" class="row-value">
              {{ currentAccount.accountName }}
            </i-col>
          </Row>
          <Row>
            <i-col span="12" class="row-label">
              {{ $t('current_network') }}&nbsp;:
            </i-col>
            <i-col span="12" class="row-value">
              {{ currentAccount.networkType }}
            </i-col>
          </Row>
          <Row>
            <i-col span="12" class="row-label">
              {{ $t('current_account') }}&nbsp;:
            </i-col>
            <i-col span="12" class="row-value">
              {{ currentWallet.name }}
            </i-col>
          </Row>
        </div>
        <Divider />
        <div class="profile-info-controls">
          <div class="profile-manage">
            <Row>
              <i-col>
                <div @click="isShowingAccountCreationModal = true">
                  {{ $t('add_an_account') }}
                </div>
              </i-col>
            </Row>
            <Row>
              <i-col>
                <div @click="isShowingChangePasswordModal = true">
                  {{ $t('change_password') }}
                </div>
              </i-col>
            </Row>
          </div>
          <div class="profile-safety">
            <Row>
              <i-col>
                <span @click="isShowingExportMnemonicModal = true">{{ $t('backup_current_mnemonic') }}</span>
              </i-col>
            </Row>
            <Row>
              <i-col>{{ $t('delete_current_account') }}</i-col>
            </Row>
            <Row>
              <i-col>{{ $t('delete_current_profile') }}</i-col>
            </Row>
          </div>
          <Divider />
          <div class="profile-logout">
            <Row>
              <i-col><span @click="logout">{{ $t("logout") }}</span></i-col>
            </Row>
          </div>
        </div>
      </div>
    </Poptip>
    <ModalFormSubWalletCreation
      :visible="isShowingAccountCreationModal"
      @close="isShowingAccountCreationModal = false"
    />
    <ModalMnemonicExport :visible="isShowingExportMnemonicModal" @close="isShowingExportMnemonicModal = false" />
    <ModalChangePassword :visible="isShowingChangePasswordModal" @close="isShowingChangePasswordModal = false" />
  </div>
</template>
<script lang="ts">
import { ProfileInfoTs } from './ProfileInfoTs'
export default class ProfileInfo extends ProfileInfoTs { }
</script>
<style lang="less" scoped>
  @import "./ProfileInfo.less";
</style>
