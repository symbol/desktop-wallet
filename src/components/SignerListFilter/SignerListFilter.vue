<template>
    <SignerBaseFilter :root-signer="rootSigner" @signer-change="onListSignerChange" />
</template>
<script lang="ts">
import { SignerListFilterTs } from './SignerListFilterTs';
export default class SignerListFilter extends SignerListFilterTs {}
</script>
<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

/deep/ .ivu-select-arrow {
    font-size: 0.16rem !important;
}

/deep/ .ivu-select-item {
    max-width: 6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/deep/ .ivu-select-selected-value {
    font-size: @smallFont !important;
    height: 0.35rem !important;
    max-width: 1.75rem !important;
}

/deep/ .ivu-select-selection {
    height: 0.35rem !important;
    border-radius: 0.034rem;
}

/deep/ .ivu-select-dropdown {
    width: auto !important;
    left: unset !important;
    right: 0.4rem !important;
    min-width: 2.6rem !important;
}
</style>
