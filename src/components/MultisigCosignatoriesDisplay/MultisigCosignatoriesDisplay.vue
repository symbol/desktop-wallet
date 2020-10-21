<template>
    <div>
        <FormRow v-if="!(multisig && multisig.cosignatoryAddresses.length) && !addModifications.length && !removeModifications.length">
            <template v-slot:inputs>
                <div>
                    <div class="row-cosignatory-modification-display inputs-container empty-message mx-1">
                        <span>{{ $t('message_empty_cosignatories') }}</span>
                    </div>
                </div>
            </template>
        </FormRow>

        <div class="rows-scroll-container mt-0">
            <!-- COSIGNATORIES -->
            <FormRow v-if="cosignatories && cosignatories.length">
                <template v-slot:inputs>
                    <div
                        v-for="({ address }, index) in cosignatories"
                        :key="index"
                        :class="[
                            'row-cosignatory-modification-display',
                            'inputs-container',
                            'accent-pink-background',
                            'pl-2',
                            'pr-2',
                            'mx-1',
                        ]"
                    >
                        <div class="cosignatory-address-container">
                            <span>{{ address.pretty() }}</span>
                        </div>
                        <Icon
                            v-if="modifiable && removeModifications && removeModifications.length === 0"
                            type="md-trash"
                            size="21"
                            class="icon-button"
                            @click="onRemoveCosignatory(address)"
                        />
                        <span v-else>&nbsp;</span>
                    </div>
                </template>
            </FormRow>

            <!-- REMOVED COSIGNATORIES -->
            <FormRow v-if="modifiable && removeModifications && removeModifications.length">
                <template v-slot:label>
                    <Tooltip word-wrap placement="top-start" :content="$t('form_label_removed_cosignatory_tooltip')">
                        <Icon type="ios-information-circle-outline" />
                    </Tooltip>
                    {{ $t('form_label_removed_cosignatory') }}:
                </template>
                <template v-slot:inputs>
                    <div
                        v-for="({ address }, index) in removeModifications"
                        :key="index"
                        :class="['row-cosignatory-modification-display', 'inputs-container', 'mx-1', 'pl-2', 'pr-2', 'red-background']"
                    >
                        <div class="cosignatory-address-container">
                            <span class="cosignatory-removed">{{ address.pretty() }}</span>
                        </div>
                        <Icon type="ios-undo" size="21" class="icon-button" @click="onUndoModification(address)" />
                    </div>
                </template>
            </FormRow>

            <!-- ADDED COSIGNATORIES -->
            <FormRow v-if="modifiable && addModifications && addModifications.length">
                <template v-slot:label>
                    {{ $t('form_label_new_cosignatories') }}
                </template>
                <template v-slot:inputs>
                    <div
                        v-for="({ address }, index) in addModifications"
                        :key="index"
                        :class="['row-cosignatory-modification-display', 'inputs-container', 'mx-1', 'pl-2', 'pr-2', 'green-background']"
                    >
                        <div class="cosignatory-address-container">
                            <span>{{ address.pretty() }}</span>
                        </div>
                        <Icon type="md-trash" size="21" class="icon-button" @click="onUndoModification(address)" />
                    </div>
                </template>
            </FormRow>

            <AddCosignatoryInput v-if="isAddingCosignatory" @added="onAddCosignatory" />
            <div v-if="!isAddingCosignatory" class="row-cosignatory-modification-display inputs-container link mx-1">
                <a href="#" @click="isAddingCosignatory = true">{{ $t('form_label_add_cosignatory') }}</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { MultisigCosignatoriesDisplayTs } from './MultisigCosignatoriesDisplayTs';

export default class MultisigCosignatoriesDisplay extends MultisigCosignatoriesDisplayTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.icon-button {
    cursor: pointer;
    color: @blackLight;
    justify-self: left;
}

.icon-button:hover {
    color: @red;
}
/deep/.ivu-tooltip {
    text-transform: none;
}
</style>
