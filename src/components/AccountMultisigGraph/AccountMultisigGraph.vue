<template>
    <div class="account-detail-row-3cols">
        <span class="label"> {{ $t('multisig_account_graph') }}</span>
        <div class="value">
            <tree :data="multisigGraphTree"></tree>
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
        font-size: 0.2rem;
        color: black;
    }
}
</style>
