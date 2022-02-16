<template>
    <Modal
        v-model="show"
        class="modal"
        :transfer="false"
        :footer-hide="true"
    >
        <div class="section-transaction">
            <img 
                :src="require('@/views/resources/img/icons/Stamp.svg')"
                class="title-icon"
                alt 
            />
            <div class="title-text">
                {{ $t('add_contact_popup_text1') }}
            </div>
            <div class="body-text">
                {{ $t('add_contact_popup_text2') }}
            </div>
            <a class="explorer-link" target="_blank" :href="explorerUrl">
                <div class="explorer-icon" />
                {{ $t('add_contact_popup_text3') }}
            </a>
        </div>

        <hr class="separator" />

        <div class="section-address-book">
            <img 
                :src="require('@/views/resources/img/icons/address_book.svg')" 
                alt 
                class="address-book-icon" 
            />
            <div class="address-book-title-text">
                {{ $t('add_contact_popup_text4') }}
            </div>
            <input
                v-focus
                class="control input"
                v-model="signerAddress"
                :disabled="true"
                type="text"
            />
            <input
                v-model="contactName"
                v-focus
                class="control input"
                placeholder="Alias (e.g. Jane Doe)"
                type="text"
            />
            <input
                v-model="contactNote"
                v-focus
                class="control input"
                :placeholder="$t('contact_notes')"
                type="text"
            />
            <button
                type="submit"
                class="control submit-button inverted-button button"
                :disabled="!contactName"
                @click="saveContact"
            >
                {{ $t('save') }}
            </button>
            <div class="address-book-description">
                {{ $t('add_contact_popup_text5') }}
            </div>
        </div> 
    </Modal>
</template>

<script lang="ts">
import { ModalAddNewContactTs } from './ModalAddNewContactTs';
export default class ModalAddNewContact extends ModalAddNewContactTs {}
</script>
<style lang="less" scoped>
@import './ModalAddNewContact.less';
</style>
