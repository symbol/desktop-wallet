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
import { SignerBaseFilterTs } from './SignerBaseFilterTs';
export default class SignerBaseFilter extends SignerBaseFilterTs {}
</script>
