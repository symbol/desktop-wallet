<template>
    <FormRow class-name="emphasis">
        <template v-slot:label> {{ $t('node_url') }}: </template>
        <template v-slot:inputs>
            <div class="row-75-25 inputs-container">
                <AutoComplete
                    v-model="formNodeUrl"
                    name="endpoint"
                    :data="customNodeData"
                    class="auto-complete-size auto-complete-style"
                    :placeholder="$t('form_label_network_node_url')"
                    placement="bottom"
                    @on-select="fetchNodePublicKey"
                    @on-change="handleInput"
                ></AutoComplete>

                <Icon v-if="isFetchingNodeInfo" type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            </div>
        </template>
    </FormRow>
</template>
<script lang="ts">
import { NetworkNodeSelectorTs } from './NetworkNodeSelectorTs';
export default class NetworkNodeSelector extends NetworkNodeSelectorTs {}
</script>
