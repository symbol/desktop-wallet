<template>
    <div class="update-metadata-modal-conatiner">
        <div class="modal-title">{{ title }}</div>
        <form action="processSubmit" onsubmit="event.preventDefault()" class="form-line-container mt-3">
            <FormRow>
                <template v-slot:label> {{ $t('form_label_by_account') }}: </template>
                <template v-slot:inputs>
                    
                </template>
            </FormRow>
            <button
                class="button-style fat-button inverted-button left-side-button"
                type="submit"
                @click="$emit('on-create')"
            >
                {{ $t('confirm') }}
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { FormMetadataCreationTs } from './FormMetadataCreationTs'
export default class FormMetadataCreation extends FormMetadataCreationTs {}
</script>

<style lang="less" scoped>
@import './FormMetadataCreation.less';
</style>