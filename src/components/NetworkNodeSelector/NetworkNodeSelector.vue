<template>
    <FormRow class-name="emphasis">
        <template v-slot:label> {{ $t('Node_URL') }}: </template>
        <template v-slot:inputs>
            <div class="row-75-25 inputs-container">
                <AutoComplete
                    v-model="formItems.nodeUrl"
                    name="endpoint"
                    :data="customNodeData"
                    class="auto-complete-size auto-complete-style"
                    :placeholder="$t('form_label_network_node_url')"
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
