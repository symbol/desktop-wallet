<template>
    <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form class="account-detail-row-3cols" onsubmit="event.preventDefault()">
            <div class="label">{{ label }}:</div>

            <div class="value field-name">
                <span v-if="!editing" class="accountName">{{ value }}</span>
                <ValidationProvider
                    v-if="editing"
                    v-slot="{ errors }"
                    mode="lazy"
                    vid="name"
                    :name="label"
                    :rules="rules"
                    tag="div"
                    class="inputs-container items-container"
                >
                    <ErrorTooltip :errors="errors">
                        <input
                            v-model="newValue"
                            type="text"
                            name="name"
                            class="input-size input-style"
                            style="width: 100%;"
                            autocomplete="new-password"
                        />
                    </ErrorTooltip>
                </ValidationProvider>
            </div>

            <button v-if="!editing" type="button" class="edit-button" @click.stop="startEditing()">
                <Icon type="md-create" />
            </button>
            <div v-if="editing">
                <button type="submit" class="edit-button" @click="handleSubmit(finishEdition)">
                    <Icon type="md-checkmark" />
                </button>
                <button type="button" class="edit-button" @click.stop="cancelEdition()">
                    <Icon type="md-close" />
                </button>
            </div>
        </form>
    </ValidationObserver>
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
