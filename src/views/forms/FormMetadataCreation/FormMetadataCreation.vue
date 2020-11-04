<template>
    <div class="update-metadata-modal-conatiner">
        <div class="modal-title">{{ title }}</div>
        <form action="processSubmit" onsubmit="event.preventDefault()" class="form-line-container mt-3">
            <FormRow>
                <template v-slot:label> {{ $t('form_label_by_account') }}: </template>
                <template v-slot:inputs>
                    <div class="select-container">
                        <Select
                            v-model="formItems.accountAddress"
                            :placeholder="$t('select_accounts')"
                            class="select-size select-style"
                        >
                            <Option v-for="(account, index) in knownAccounts" :key="index" :value="account.address">
                                {{ account.address }}
                            </Option>
                        </Select>
                    </div>
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label> {{ $t('form_label_target_mosaic_id') }}: </template>
                <template v-slot:inputs>
                    <div class="input-container">
                        <input
                            class="input-size input-style"
                            v-model="formItems.targetAccount"
                            :placeholder="$t('form_label_target_account_hint')"
                            type="text"
                        />
                    </div>
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label> {{ $t('form_label_scoped_metadata_key') }}: </template>
                <template v-slot:inputs>
                    <div class="select-container">
                        <Select
                            v-model="formItems.scopedKey"
                            :placeholder="$t('form_label_scoped_metadata_key_hint')"
                            class="select-size select-style"
                        >
                        </Select>
                    </div>
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label> {{ $t('form_label_value') }}: </template>
                <template v-slot:inputs>
                    <div class="value-container">
                        <textarea
                            class="metadata-value-input"
                            :placeholder="$t('form_label_value_hint')"
                            v-model="formItems.value" 
                        />
                    </div>
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label> {{ $t('form_label_max_fee') }}: </template>
                <template v-slot:inputs>
                    <MaxFeeSelector v-model="formItems.maxFee" />
                </template>
            </FormRow>
            <FormRow>
                <template v-slot:label> {{ $t('form_label_password') }}: </template>
                <template v-slot:inputs>
                    <ValidationProvider
                        v-slot="{ errors }"
                        vid="password"
                        mode="lazy"
                        :name="$t('password')"
                        :rules="validationRules.password"
                        tag="div"
                        class="select-container"
                    >
                        <ErrorTooltip :errors="errors">
                            <input
                                ref="passwordInput"
                                v-model="formItems.password"
                                class="input-size input-style"
                                :placeholder="$t('form_label_password_hint')"
                                type="password"
                            />
                        </ErrorTooltip>
                        <button
                            class="button-style fat-button inverted-button right-side-button"
                            type="submit"
                            @click="$emit('on-create')"
                        >
                            {{ $t('confirm') }}
                        </button>
                    </ValidationProvider>
                </template>
            </FormRow>
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