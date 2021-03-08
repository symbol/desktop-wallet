<template>
    <FormRow class-name="emphasis" :no-label="noLabel">
        <template v-slot:label>
            <div v-if="!noLabel">{{ $t(label) }}:</div>
        </template>
        <template v-slot:inputs>
            <div class="inputs-container select-container">
                <Select
                    v-model="chosenAccount"
                    :placeholder="$t('address')"
                    class="select-size select-style"
                    :disabled="disabled"
                    @change="onChangeCurrentAccount"
                >
                    <Option v-for="item in accountModels" :key="item.id + item.name" :value="item.id">
                        {{ `${item.name} - ${item.address.slice(0, 5)}...${item.address.slice(34)}` }}
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
