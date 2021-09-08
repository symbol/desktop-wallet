<template>
    <FormRow class-name="emphasis" :no-label="noLabel">
        <template v-slot:label>
            <div v-if="!noLabel">{{ $t(label) }}:</div>
        </template>
        <template v-slot:inputs>
            <div v-if="multisigSigners.length" class="select-container">
                <Select v-model="chosenSigner" :placeholder="$t('address')" class="select-size select-style" :disabled="disabled">
                    <Option :key="rootSigner.address.plain()" :value="rootSigner.address.plain()">
                        {{ rootSigner.label }}
                    </Option>
                    <OptionGroup v-if="multisigSigners" label="Multisig accounts">
                        <Option v-for="item in multisigSigners" :key="item.signer.address.plain()" :value="item.signer.address.plain()">
                            <span :style="`display: inline-block; width: 0.1rem; margin-left: ${item.level * 0.1}rem;`">
                                <em v-if="item.parent" class="ivu-icon ivu-icon-ios-arrow-down"></em>
                            </span>
                            {{ item.signer.label + ' ' + $t('label_postfix_multisig') }}
                        </Option>
                    </OptionGroup>
                </Select>
            </div>
            <div v-else class="signer-selector-single-signer-container">
                <span>
                    {{ rootSigner ? rootSigner.label : '' }}
                    {{ rootSigner && rootSigner.multisig ? $t('label_postfix_multisig') : '' }}
                </span>
            </div>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { SignerSelectorTs } from './SignerSelectorTs';
export default class SignerSelector extends SignerSelectorTs {}
</script>
