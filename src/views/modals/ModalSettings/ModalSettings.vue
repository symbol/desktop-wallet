<template>
    <div>
        <Modal v-model="show" class="settings-modal-container" :footer-hide="true">
            <div class="nav-links-wrapper">
                <div class="header-container">
                    <span class="title-style">{{ $t('sidebar_item_settings') }}</span>
                </div>
                <div class="nav-wrapper">
                    <NavigationLinks
                        class="settings-tabs-container"
                        :items="availableTabs"
                        :current-item-index="currentTabIndex"
                        @selected="onTabChange"
                    />
                </div>
            </div>

            <div v-if="knownTabs[currentTabIndex] === 'GENERAL' && !!currentAccount">
                <FormGeneralSettings @logout="logout" @close="close" />
            </div>

            <div v-if="knownTabs[currentTabIndex] === 'PASSWORD' && !!currentAccount">
                <FormProfilePasswordUpdate />
            </div>

            <div v-if="knownTabs[currentTabIndex] === 'NETWORK' || !currentAccount">
                <FormNodeEdit />
            </div>

            <div v-if="knownTabs[currentTabIndex] === 'ABOUT' && !!currentAccount">
                <AboutPage />
            </div>
        </Modal>
    </div>
</template>
<script lang="ts">
import { ModalSettingsTs } from './ModalSettingsTs';
export default class ModalSettings extends ModalSettingsTs {}
</script>
<style lang="less" scoped>
@import './ModalSettings.less';
</style>
