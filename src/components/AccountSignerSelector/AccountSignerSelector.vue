<template>
    <FormRow class-name="emphasis" :no-label="noLabel">
        <template v-slot:label>
            <div v-if="!noLabel">{{ $t(label) }}:</div>
        </template>
        <template v-slot:inputs>
            <div class="inputs-container select-container">
                <Select v-model="chosenAccount" :placeholder="$t('address')" class="select-size select-style" :disabled="disabled">
                    <Option v-for="item in accountModels" :key="item.id + item.name" :value="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </div>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { AccountSignerSelectorTs } from './AccountSignerSelector';
export default class AccountSignerSelector extends AccountSignerSelectorTs {}
</script>
