<template>
    <div class="asset-form-main-container">
        <div class="form-section">
            <slot name="form-section" />
        </div>
        <Icon type="ios-help-circle-outline" size="20" @click="hasHelpModal = true" />
        <div class="container">
            <Modal v-model="hasHelpModal" :transfer="false" :title="$t('rules_describe')">
                <div>
                    <slot name="form-description" />
                </div>
                <div slot="footer" class="modal-footer"></div>
            </Modal>
        </div>
    </div>
</template>

<script lang="ts">
import { AssetFormPageWrapTs } from './AssetFormPageWrapTs';
export default class AssetFormPageWrap extends AssetFormPageWrapTs {}
</script>

<style lang="less" scoped>
@import './AssetFormPageWrap.less';
</style>
