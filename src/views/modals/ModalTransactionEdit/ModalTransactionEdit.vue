<template>
    <div class="container">
        <Modal
            v-model="show"
            class-name="modal-transaction-confirmation"
            :title="$t('edit_object', { objectName: transaction.title })"
            :transfer="false"
        >
            <div class="body">
                <component
                    :is="transaction.component"
                    ref="transactionForm"
                    v-model="transaction.formItems"
                    :is-aggregate="true"
                    :hide-save="true"
                    :value.sync="transaction.formItems"
                    :title.sync="transaction.title"
                    :edit-mode="true"
                    class="transaction-form-component"
                    @txInput="onTransactionFormSave"
                ></component>
            </div>
            <div slot="footer" class="footer">
                <button class="cancel-button centered-button button-style inverted-button" @click="cancel()">
                    {{ $t('cancel') }}
                </button>
                <button type="submit" class="save-button centered-button button-style inverted-button" @click="save()">
                    {{ $t('save') }}
                </button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalTransactionEditTs } from './ModalTransactionEditTs';
export default class ModalTransactionEdit extends ModalTransactionEditTs {}
</script>

<style lang="less" scoped>
@import '../../resources/css/variables.less';
@import './ModalTransactionEdit.less';
</style>
