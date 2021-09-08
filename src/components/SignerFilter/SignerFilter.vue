<template>
    <div class="transaction-filter">
        <Select v-model="selectedSigner" size="large" prefix="ios-home" @input="onSignerChange">
            <Icon slot="prefix" type="ios-people" size="0" />
            <Option :key="rootSigner.address.plain()" :value="rootSigner.address.plain()">
                {{ rootSigner.label }}
            </Option>
            <OptionGroup v-if="multisigSigners.length" label="Multisig accounts">
                <Option v-for="item in multisigSigners" :key="item.signer.address.plain()" :value="item.signer.address.plain()">
                    <span :style="`display: inline-block; width: 0.1rem; margin-left: ${item.level * 0.1}rem;`">
                        <em v-if="item.parent" class="ivu-icon ivu-icon-ios-arrow-down"></em>
                    </span>
                    {{ $t('label_postfix_multisig') + item.signer.label }}
                </Option>
            </OptionGroup>
        </Select>
    </div>
</template>
<script lang="ts">
// @ts-ignore
import { SignerFilterTs } from './SignerFilterTs';
export default class SignerFilter extends SignerFilterTs {}
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
