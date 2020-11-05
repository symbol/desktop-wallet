<template>
    <div class="form-account-creation-container">
        <FormWrapper :whitelisted="true">
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <div class="form-row">
                        <div class="form-create-headline">
                            {{ $t('choose_profile_name_and_password') }}
                        </div>
                    </div>

                    <FormRow vertical="true">
                        <template v-slot:label> {{ $t('set_account_name') }} </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="newAccountName"
                                :name="$t('newProfileName')"
                                :rules="validationRules.newAccountName"
                                tag="div"
                                class="inputs-create-container items-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <input
                                        ref="passwordInput"
                                        v-model="formItems.profileName"
                                        class="input-size input-style"
                                        type="text"
                                        @input="stripTagsProfile"
                                    />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <FormRow vertical="true">
                        <template v-slot:label> {{ $t('set_network_type') }} </template>
                        <template v-slot:inputs>
                            <div class="inputs-create-container select-container">
                                <Select
                                    v-model="formItems.networkType"
                                    :placeholder="$t('choose_network')"
                                    class="select-size select-style"
                                >
                                    <Option v-for="(item, index) in networkTypeList" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </Option>
                                </Select>
                            </div>
                        </template>
                    </FormRow>

                    <!-- @TODO: Place hint(should contain at least 8 characters, 1 letter and 1 number) -->
                    <FormRow vertical="true">
                        <template v-slot:label> {{ $t('new_password_label') }} </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="newPassword"
                                mode="lazy"
                                :name="$t('password')"
                                :rules="validationRules.password"
                                tag="div"
                                class="inputs-create-container select-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <input
                                        ref="passwordInput"
                                        v-model="formItems.password"
                                        class="input-size input-style"
                                        :placeholder="$t('please_enter_your_account_password')"
                                        type="password"
                                    />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <FormRow vertical="true">
                        <template v-slot:label> {{ $t('repeat_password_label') }} </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="confirmPassword"
                                :name="$t('confirmPassword')"
                                :rules="validationRules.confirmPassword"
                                tag="div"
                                class="inputs-create-container items-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <input
                                        v-model="formItems.passwordAgain"
                                        class="input-size input-style"
                                        data-vv-name="confirmPassword"
                                        :placeholder="$t('please_enter_your_new_password_again')"
                                        type="password"
                                    />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <FormRow vertical="true">
                        <template v-slot:label> {{ $t('password_hint') }} </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="hint"
                                :name="$t('hint')"
                                :rules="validationRules.message"
                                tag="div"
                                class="inputs-create-container items-container"
                            >
                                <ErrorTooltip :errors="errors">
                                    <input v-model="formItems.hint" class="input-size input-style" @input="stripTagsProfile" />
                                </ErrorTooltip>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <div class="form-line-container form-row">
                        <div class="float-right mt-3">
                            <button
                                type="button"
                                class="solid-button button-style create-account-stylebutton create-account-style"
                                @click="$router.push({ name: 'profiles.importProfile.importStrategy' })"
                            >
                                {{ $t('back') }}
                            </button>
                            <button type="submit" class="inverted-button button-style create-account-style" @click="handleSubmit(submit)">
                                {{ $t(nextPage === 'profiles.importProfile.importMnemonic' ? 'restore_mnemonic' : 'generating_mnemonic') }}
                            </button>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </FormWrapper>
    </div>
</template>

<script lang="ts">
import { FormProfileCreationTs } from './FormProfileCreationTs';
export default class FormProfileCreation extends FormProfileCreationTs {}
</script>

<style lang="less" scoped>
@import '../../resources/css/variables.less';

.right-hints-section {
    display: block;
    width: 5rem;
    padding: 0.5rem;
}

.form-account-creation-container {
    width: 100%;
    height: 100%;
}

.restore-button {
    border: 2px solid @pink;
    background: transparent;
    color: @pink;
    width: auto;
    padding: 0 0.1rem;
}

/deep/ .form-row {
    .form-row-inner-container {
        grid-template-columns: 3rem auto;
    }
}
</style>
