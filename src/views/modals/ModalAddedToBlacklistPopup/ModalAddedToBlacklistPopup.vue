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
            <span class="modal-body">
                {{ $t('blacklist_popup_description') }}
            </span>
            <br />

            <img :src="require('@/views/resources/img/icons/malicious_actor_1.svg')" class="img-positioning" alt />

            <a class="link-text" @click="onClickSeeBlackList()">
                {{ $t('see_blacklist_label') }}
            </a>
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
