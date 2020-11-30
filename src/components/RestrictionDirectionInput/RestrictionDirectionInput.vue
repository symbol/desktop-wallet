<template>
    <FormRow>
        <template v-slot:label> {{ $t('direction') }}: </template>
        <template v-slot:inputs>
            <Select :placeholder="$t('direction')" class="select-size select-style">
                <Option key="incoming" value="incoming">
                    {{ $t('incoming') }}
                </Option>
                <Option key="outgoing" value="outgoing">
                    {{ $t('outgoing') }}
                </Option>
            </Select>
        </template>
    </FormRow>
</template>

<script lang="ts">
// extenal dependencies
import { Component, Vue } from 'vue-property-decorator';

// child components
import FormRow from '@/components/FormRow/FormRow.vue';

@Component({ components: { FormRow } })
export default class RestrictionDirectionInput extends Vue {}
</script>

<style lang="less" scoped>
@import './RestrictionDirectionInput.less';
</style>
