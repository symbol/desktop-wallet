<template>
    <div class="node-edit-form">
        <PeerSelector :is-embedded="true"></PeerSelector>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
            <div>
                <FormRow>
                    <template v-slot:label> {{ $t('node_url') }}: </template>
                    <template v-slot:inputs>
                        <ValidationProvider
                            v-slot="{ errors }"
                            vid="nodeUrl"
                            :name="$t('node_url')"
                            :rules="validationRules.url"
                            tag="div"
                            class="inputs-container items-container"
                        >
                            <ErrorTooltip :errors="errors">
                                <AutoComplete
                                    v-model="formItems.nodeUrl"
                                    :data="customNodeData"
                                    class="auto-complete-size auto-complete-style"
                                    :placeholder="$t('input_here')"
                                    @on-select="getInfoFromUrl"
                                    @on-change="handleInput"
                                ></AutoComplete>
                            </ErrorTooltip>
                        </ValidationProvider>
                    </template>
                </FormRow>
                <FormRow>
                    <template v-slot:label> {{ $t('network_type') }}: </template>
                    <template v-slot:inputs>
                        <div class="inputs-container items-container relative">
                            <input
                                v-model="formItems.networkType"
                                class="input-size input-style"
                                :placeholder="$t('automatically_generated_by_node_url')"
                                disabled
                            />
                            <Icon v-if="isGettingNodeInfo" type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
                        </div>
                    </template>
                </FormRow>
                <FormRow>
                    <template v-slot:label> {{ $t('about_generation_hash') }}: </template>
                    <template v-slot:inputs>
                        <div class="inputs-container items-container">
                            <input
                                v-model="formItems.networkHash"
                                class="input-size input-style"
                                :placeholder="$t('automatically_generated_by_node_url')"
                                disabled
                            />
                            <Icon v-if="isGettingNodeInfo" type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
                        </div>
                    </template>
                </FormRow>
            </div>
            <div class="form-row button-container">
                <button
                    class="button-style inverted-button pl-2 pr-2"
                    type="submit"
                    :disabled="!formItems.networkHash"
                    @click="handleSubmit(onSubmit)"
                >
                    {{ $t('add_node') }}
                </button>
            </div>
        </ValidationObserver>
    </div>
</template>
<script lang="ts">
import { FormNodeEditTs } from './FormNodeEditTs';
export default class FormNodeEdit extends FormNodeEditTs {}
</script>
<style lang="less" scoped>
@import './FormNodeEdit.less';
.button-container {
    padding-top: 5%;
    padding-right: 16%;
}

/deep/ .auto-complete-style {
    .ivu-input {
        background: transparent !important;
    }
}

/deep/ .node-list-container {
    width: 84%;
    padding-bottom: 0.1rem;
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
