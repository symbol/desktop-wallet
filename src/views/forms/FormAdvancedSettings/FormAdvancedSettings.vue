<template>
    <div class="h-100">
        <FormWrapper class="advanced-settings-container" :whitelisted="true">
            <span class="advanced-settings-content">
                <form class="form-container" onsubmit="event.preventDefault()" autocomplete="off">
                    <FormRow>
                        <template v-slot:label>
                            {{ $t('form_label_allow_unknown_multisig_tx') }}:
                            <div>
                                <a class="link" target="_blank" :href="symbolDocsScamAlertUrl">{{ $t('link_docs_scam') }}</a>
                            </div>
                        </template>
                        <template v-slot:inputs>
                            <div class="inputs-container select-container">
                                <div class="form-switch">
                                    <i-select
                                        v-model="allowUnknownMultisigTransactions"
                                        class="select-size select-style"
                                        @change="onChange"
                                    >
                                        <i-option
                                            v-for="({ label, value }, index) in allowUnknownMultisigTransactionsOptions"
                                            :key="index + label"
                                            :value="value"
                                        >
                                            {{ label }}
                                        </i-option>
                                    </i-select>
                                </div>
                            </div>
                            <div class="inputs-container alert-container">
                                <Alert
                                    type="warning"
                                    :visible="!!allowUnknownMultisigTransactions"
                                    :value="$t('allow_unknown_multisig_transactions_alert')"
                                />
                            </div>
                        </template>
                    </FormRow>
                </form>
                <div class="form-row form-row-submit">
                    <div>
                        <button class="button-style button danger-button pl-2 pr-2 confirm-reset" type="reset" @click.prevent="refresh">
                            {{ $t('cancel') }}
                        </button>
                        <button
                            class="button-style inverted-button pl-2 pr-2 confirm-reset"
                            type="submit"
                            :disabled="isSubmitDisabled"
                            @click="submit"
                        >
                            {{ $t('confirm') }}
                        </button>
                    </div>
                </div>
            </span>
        </FormWrapper>
        <ModalFormProfileUnlock
            v-if="showProfileUnlockModal"
            :visible="showProfileUnlockModal"
            :on-success="onAccountUnlocked"
            @close="showProfileUnlockModal = false"
        />
    </div>
</template>

<script lang="ts">
import { FormAdvancedSettingsTs } from './FormAdvancedSettingsTs';
export default class FormAdvancedSettings extends FormAdvancedSettingsTs {}
</script>

<style lang="less" scoped>
a {
    color: #f0f;
    font-size: 0.15rem;
    text-decoration: underline;

    &:hover {
        color: #f0f5;
    }
}

.advanced-settings-container {
    display: block;
    width: 100%;
    height: 100%;
    clear: both;
    min-height: 1rem;
    padding-top: 0.8rem;
    padding-bottom: 0.4rem;
}

.advanced-settings-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.form-row-submit {
    display: flex;
    padding-top: 5%;
    padding-left: 0.7rem;
    padding-right: 1.7rem;
    flex-flow: row;
    justify-content: flex-end;

    button[type='reset'] {
        margin-right: 0.35rem;
    }

    button {
        width: max-content;
        padding: 0 0.35rem;
    }
}

.confirm-reset {
    width: 20%;
}

.form-switch {
    -webkit-app-region: no-drag;
    position: relative;
}

.alert-container {
    height: auto;
}

/deep/ .form-row {
    .form-row-inner-container {
        grid-template-columns: none !important;
    }
    .inputs-container {
        margin-top: 0.05rem;
        padding-left: 0.35rem;
        margin-bottom: 0.1rem;
        padding-right: 0.85rem;
    }
}
</style>
