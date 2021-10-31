<template>
    <FormRow class-name="emphasis" :no-label="noLabel">
        <template v-slot:label>
            <div v-if="!noLabel">{{ $t(label) }}:</div>
        </template>
        <template v-slot:inputs>
            <div v-if="rootSigner.parentSigners" class="select-container">
                <SignerBaseFilter
                    :root-signer="rootSigner"
                    :is-aggregate="isAggregate"
                    :chosen-signer="chosenSigner"
                    @signer-change="onSignerSelectorChange"
                />
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
