<template>
    <div class="container">
        <Modal v-model="show" :title="$t(title)" :transfer="false" class-name="modal-container" :footer-hide="true">
            <FormWrapper class="key-input-container" :whitelisted="true">
                <ValidationObserver v-slot="{ handleSubmit }" ref="observer" class="key-input-container" slim>
                    <form class="form-line-container mt-3" onsubmit="event.preventDefault()">
                        <FormRow>
                            <template v-slot:label> {{ $t('key_type') }}: </template>
                            <template v-slot:inputs>
                                <div class="inputs-container">
                                    <div class="select-container">
                                        <Select v-model="type" class="select-size select-style">
                                            <Option value="random_key">
                                                {{ $t('generate_random_public_key') }}
                                            </Option>
                                            <Option value="own_key">
                                                {{ $t('import_key_manually') }}
                                            </Option>
                                        </Select>
                                    </div>
                                </div>
                            </template>
                        </FormRow>
                        <FormRow v-if="showPrivateKeyInput">
                            <template v-slot:label> {{ $t('private_key') }}: </template>
                            <template v-slot:inputs>
                                <div class="inputs-container">
                                    <ValidationProvider v-slot="{ errors }" mode="lazy" vid="privateKey" :name="$t('private_key')" slim>
                                        <ErrorTooltip :errors="errors">
                                            <input
                                                v-model="privateKey"
                                                v-focus
                                                type="text"
                                                name="privateKey"
                                                class="input-size input-style"
                                            />
                                        </ErrorTooltip>
                                    </ValidationProvider>
                                </div>
                            </template>
                        </FormRow>
                        <div class="edit-button">
                            <button
                                class="button-style inverted-button pl-2 pr-2 submit-key"
                                type="submit"
                                :disabled="!isValidPrivateKey"
                                @click="handleSubmit(onSubmit())"
                            >
                                {{ $t('confirm') }}
                            </button>
                        </div>
                    </form>
                </ValidationObserver>
            </FormWrapper>
        </Modal>
    </div>
</template>

<script lang="ts">
import ModalImportPrivateKeyTs from './ModalImportPrivateKeyTs';
export default class ModalImportPrivateKey extends ModalImportPrivateKeyTs {}
</script>

<style lang="less" scoped>
.key-input-container {
    display: block;
    width: 100%;
    clear: both;
    min-height: 1rem;
}
.submit-key {
    float: right;
}
</style>
