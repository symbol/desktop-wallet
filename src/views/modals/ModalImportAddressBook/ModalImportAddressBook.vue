<template>
    <div>
        <Modal v-model="show" class="modal-importqr-container" :title="$t('import_address_book')" :footer-hide="true">
            <UploadAddressBook @uploadComplete="onUploadComplete" />
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalImportAddressBookTs } from './ModalImportAddressBookTs';

export default class ModalImportAddressBook extends ModalImportAddressBookTs {}
</script>

<style lang="less" scoped>
@import './ModalImportAddressBook.less';
</style>
