<template>
    <div class="container">
        <Modal
            v-model="show"
            :title="$t('modal_title_enter_account_name')"
            :transfer="false"
            class-name="modal-container"
            :footer-hide="true"
        >
            <div slot="header">
                <span class="title">{{ $t('added_to_blacklist') }}</span>
            </div>
            <div class="modal-body">
                {{ $t('blacklist_popup_description') }}
            </div>
            <div class="link-blacklist">
                <img :src="require('@/views/resources/img/icons/malicious_actor_1.svg')" alt />
                <a @click="onClickSeeBlackList()">
                    {{ $t('see_blacklist_label') }}
                </a>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalAddedToBlacklistPopupTs } from './ModalAddedToBlacklistPopupTs';
export default class ModalAddedToBlacklistPopup extends ModalAddedToBlacklistPopupTs {}
</script>
<style lang="less" scoped>
@import './ModalAddedToBlacklistPopup.less';
</style>
