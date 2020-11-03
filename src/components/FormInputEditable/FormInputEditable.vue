<template>
    <div class="account-detail-row-3cols">
        <div class="label">{{ label }}:</div>

        <div class="value field-name">
            <span v-if="!editing" class="accountName">{{ value }}</span>
            <input v-if="editing" v-model="newValue" class="edit-input" />
        </div>

        <button v-if="!editing" type="button" class="edit-button" @click.stop="startEditing()">
            <Icon type="md-create" />
        </button>
        <div v-if="editing">
            <button type="button" class="edit-button" @click.stop="finishEdition()">
                <Icon type="md-add-circle" />
            </button>
            <button type="button" class="edit-button" @click.stop="cancelEdition()">
                <Icon type="md-trash" />
            </button>
        </div>
    </div>
</template>

<script>
import { FormInputEditableTs } from './FormInputEditableTs';

export default class FormInputEditable extends FormInputEditableTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.edit-button {
    height: 0.1rem !important;
    width: 0.1rem !important;
    background: transparent;
    border: none;
    color: @blackLight;
    text-align: center;
    cursor: pointer;
    font-size: 1em;
    margin-right: 30px;
}

.value {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.edit-input {
    border: 0;
    padding-left: 8px;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: @grayLightest;
    width: 100%;
}
</style>
