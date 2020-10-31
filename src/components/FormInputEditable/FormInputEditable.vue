<template>
    <div class="account-detail-row">
        <div class="label">{{ label }}:</div>
        <div class="value field-name">
            <span v-if="!editing" class="accountName">{{ value }}</span>
            <input v-if="editing" v-model="newValue" class="accountName" />
            <button v-if="!editing" type="button" class="edit-button" @click="startEditing()">
                <Icon type="md-create" />
            </button>
            <button v-if="editing" type="button" class="edit-button" @click.stop="finishEdition()">
                <Icon type="md-add-circle" />
            </button>
            <button v-if="editing" type="button" class="edit-button" @click.stop="cancelEdition()">
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
    background: @grayLightest;
    border: none;
    color: @blackLight;
    float: right;
    margin-right: 2%;
    text-align: center;
    cursor: pointer;
    font-size: 0.9em;
}

.field-name {
    background: @grayLightest;

    padding-left: 6px;
    border-radius: 3px;
    width: 400px;
}

.account-detail-row-3cols {
    display: grid;
    grid-template-columns: 1.4rem 8.6rem 0.2rem;
}

.account-detail-row {
    display: grid;
    grid-template-columns: 1.4rem 8.6rem;
}

.account-detail-row,
.account-detail-row-3cols {
    .label {
        font-weight: 400;
        margin-right: 10px;
        width: 1.4rem;
    }

    /deep/ .value {
        color: @black;
    }
}
</style>
