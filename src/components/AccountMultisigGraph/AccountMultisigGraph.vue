<template>
    <div class="account-detail-row-3cols" style="margin-top: 0.2rem;">
        <span class="label"> {{ $t('multisig_account_graph') }}:</span>
        <div class="value">
            <button type="button" class="show-button" @click="showGraphModal">
                {{ $t('show_button') }}
            </button>
            <div class="account-detail-row-3cols">
                <Modal v-model="isGraphModalShown" :title="$t('multisig_account_graph')" :footer-hide="true">
                    <VueTree
                        ref="VueTree"
                        class="multisig-tree"
                        link-style="straight"
                        :dataset="dataset"
                        :config="graphConfig"
                        :collapse-enabled="false"
                    >
                        <template v-slot:node="{ node }">
                            <div
                                class="multisig-tree-node"
                                :class="{
                                    'multisig-tree-node--selected': node.selected,
                                    'multisig-tree-node--ms': node.multisig,
                                }"
                            >
                                <div class="multisig-tree-node-name">
                                    {{ node.name }}
                                </div>
                                <div v-if="node.multisig" class="multisig-tree-node-ms-container">
                                    <div>{{ node.multisig.minApproval }}</div>
                                    <div>{{ node.multisig.minRemoval }}</div>
                                </div>
                            </div>
                        </template>
                    </VueTree>
                </Modal>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { AccountMultisigGraphTs } from './AccountMultisigGraphTs';

export default class AccountLinks extends AccountMultisigGraphTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';
.ivu-tree {
    /deep/.ivu-tree-arrow,
    /deep/.ivu-tree-title {
        font-family: @symbolFont;
        font-size: @normalFont;
        color: @purpleDark;
        white-space: pre-line;
    }
}

.show-button {
    border: none !important;
    font-weight: bold;
    cursor: pointer;
    background-color: transparent;
    color: @purpleLightest;
}

.multisig-tree {
    min-height: 50vh;
    border: 1px solid gray;
}

.multisig-tree-node {
    max-width: 3rem;
    padding: 0.1rem;
    font-family: @symbolFont;
    font-size: @normalFont;
    line-height: 125%;
    color: @purpleDark;
    white-space: pre-line;
    border-radius: @borderRadius;
    border: 0.01rem solid @accentBlue;
    background-image: linear-gradient(90deg, @whiteDark, @whiteLight);
    user-select: none;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.multisig-tree-node--selected {
    color: @white;
    border-color: @whiteLight;
    background-image: linear-gradient(90deg, @purpleLight, @accentBlue);
}

.multisig-tree-node--ms {
    border-color: @accentPink;
}

.multisig-tree-node-name {
    font-family: @symbolFontBold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
