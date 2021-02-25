<template>
    <FormWrapper class="account-unlock-container" :whitelisted="true">
        <form action="processSubmit" onsubmit="event.preventDefault()" class="form-line-container mt-3">
            <FormRow>
                <template v-slot:label> {{ $t('form_label_password') }}: </template>
                <template v-slot:inputs>
                    <div class="row-75-25 inputs-container">
                        <ValidationProvider
                            v-slot="{ errors }"
                            vid="password"
                            :name="$t('password')"
                            :rules="validationRules.profilePassword"
                            slim
                        >
                            <ErrorTooltip :errors="errors">
                                <input
                                    ref="passwordInput"
                                    v-model="formItems.password"
                                    type="password"
                                    class="input-size input-style"
                                    :disabled="isLoading"
                                    :placeholder="$t('please_enter_your_account_password')"
                                />
                            </ErrorTooltip>
                        </ValidationProvider>
                        <Button
                            v-if="!hideSubmit"
                            class="button-style inverted-button right-side-button"
                            html-type="submit"
                            :loading="isLoading"
                            :disabled="disabled"
                            @click="processVerification"
                        >
                            {{ $t(buttonText) }}
                        </Button>
                    </div>
                </template>
            </FormRow>
        </form>
    </FormWrapper>
</template>

<script lang="ts">
import { FormProfileUnlockTs } from './FormProfileUnlockTs';
export default class FormProfileUnlock extends FormProfileUnlockTs {}
</script>

<style lang="less" scoped>
.account-unlock-container {
    display: block;
    width: 100%;
    clear: both;
    min-height: 1rem;
}

/deep/ .form-label {
    padding-left: 0.5rem;
}

/deep/ .form-row-inner-container {
    grid-template-columns: 18% 60% !important;
}

.ivu-btn:hover,
.ivu-btn:active {
    color: white;
    border-color: white;
}

.ivu-btn:focus {
    box-shadow: none;
}
</style>
