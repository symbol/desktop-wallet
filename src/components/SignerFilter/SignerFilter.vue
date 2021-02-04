<template>
    <div class="transaction-filter">
        <Select v-model="selectedSigner" size="large" prefix="ios-home" @input="onSignerChange">
            <Icon slot="prefix" type="ios-people" size="0" />
            <OptionGroup label="Multisig accounts">
                <Option v-for="item in signers" :key="item.address.plain()" :value="item.address.plain()">
                    {{ item.multisig ? $t('label_postfix_multisig') : '' }}
                    {{ item.label }}
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
}
</style>
