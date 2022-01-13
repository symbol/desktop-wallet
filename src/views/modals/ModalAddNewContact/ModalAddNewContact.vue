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
                <img :src="require('@/views/resources/img/icons/Stamp.svg')" class="img-positioning" alt />
            </div>

            <div class="modal-body">
                <span class="title"> {{ $t('add_contact_popup_text1') }}</span>
                <br />
                <span class="under-title-txt"> {{ $t('add_contact_popup_text2') }}</span>
            </div>

            <a class="link-text" target="_blank" :href="explorerUrl">
                <img :src="require('@/views/resources/img/navbar/explorer.svg')" class="explorer-img" alt />
                {{ $t('add_contact_popup_text3') }}
            </a>

            <br />

            <hr class="horizontal-line" />

            <img :src="require('@/views/resources/img/icons/address_book.svg')" alt class="img-positioning" />

            <br />

            <span class="title address-detected"> {{ $t('add_contact_popup_text4') }}</span>
            <br />
            <input
                v-model="contactName"
                v-focus
                class="input-size input-style inputs-style"
                placeholder="Alias (e.g. Jane Doe)"
                type="text"
            />

            <input
                v-model="contactNote"
                v-focus
                class="input-size input-style inputs-style"
                :placeholder="$t('contact_notes')"
                type="text"
            />

            <button
                type="submit"
                class="centered-button button-style submit-button inverted-button button-style"
                :disabled="contactName === ''"
                @click="onClickSave"
            >
                {{ $t('save') }}
            </button>
            <span class="bottom-text">
                {{ $t('add_contact_popup_text5') }}
            </span>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalAddNewContactTs } from './ModalAddNewContactTs';
export default class ModalAddNewContact extends ModalAddNewContactTs {}
</script>
<style lang="less" scoped>
@import './ModalAddNewContact.less';
</style>
