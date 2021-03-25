<template>
    <FormRow class-name="emphasis">
        <template v-slot:label> {{ $t('node_url') }}: </template>
        <template v-slot:inputs>
            <div class="inputs-container">
                <AutoComplete
                    ref="nodeUrlInput"
                    v-model="formNodeUrl"
                    name="endpoint"
                    class="auto-complete-size auto-complete-style"
                    :placeholder="$t('form_label_network_node_url')"
                    placement="bottom"
                    :clearable="true"
                    :filter-method="filterUrls"
                    :disabled="disabled"
                    @on-select="fetchNodePublicKey"
                    @on-clear="onClear"
                >
                    <div class="auto-complete-sub-container scroll">
                        <div class="custom-node-input-container">
                            <input v-model="customNode" class="input-style input-size" type="text" />
                            <button class="select-button" @click="handleSelectCustomNode">
                                {{ $t('select') }}
                            </button>
                        </div>
                        <div v-for="(node, index) in customNodeData" :key="index">
                            <Option :value="node" :label="node">
                                <span>{{ node }}</span>
                            </Option>
                        </div>
                    </div>
                </AutoComplete>
                <Icon v-if="isFetchingNodeInfo" type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            </div>
            <div v-if="showInputPublicKey" class="inputs-container publickey-input-container">
                <input
                    v-model="formNodePublicKey"
                    class="input-size input-style"
                    :placeholder="$t('node_public_key_input')"
                    type="text"
                    @blur="onChangeFormNodePublicKey"
                />
            </div>
        </template>
    </FormRow>
</template>
<script lang="ts">
import { NetworkNodeSelectorTs } from './NetworkNodeSelectorTs';
export default class NetworkNodeSelector extends NetworkNodeSelectorTs {}
</script>
<style lang="less" scoped>
@import './NetworkNodeSelector.less';
</style>
