<template>
    <div class="upload-qrcode-container">
        <div class="upload-qrcode-left-pane">
            <Upload :multiple="false" action="no action" type="drag" :before-upload="onBeforeUpload">
                <div>
                    <div v-if="fileName" class="upload-qrcode-preview">
                        <div>
                            <span>{{ fileName }}</span>
                        </div>
                    </div>

                    <Icon v-if="!fileName" type="ios-cloud-upload"></Icon>
                    <p>{{ $t(uploadFileMessage) }}</p>
                </div>
            </Upload>
        </div>
        <div v-if="showExplanation" class="upload-qrcode-right-pane">
            <div class="upload-qrcode-explanation">
                <span>{{ $t('upload_address_book_explanation') }}</span>
            </div>
            <div v-if="showError" class="upload-error">
                <span>{{ $t('invalid_address_book') }}</span>
            </div>
            <div class="upload-qrcode-button">
                <button
                    type="button"
                    class="fat-button centered-button button-style inverted-button"
                    :disabled="showError || !fileName"
                    @click="importAddressBook()"
                >
                    {{ $t('import_address_book') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import UploadAddressBookTs from './UploadAddressBookTs';

export default class UploadAddressBook extends UploadAddressBookTs {}
</script>

<style lang="less" scoped>
@import './UploadAddressBook.less';
</style>
