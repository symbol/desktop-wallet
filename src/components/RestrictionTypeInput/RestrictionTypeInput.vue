<template>
    <FormRow>
        <template v-slot:label> {{ $t('type') }}: </template>
        <template v-slot:inputs>
            <Select :placeholder="$t('type')" class="select-size select-style">
                <Option key="Block" value="Block">
                    {{ $t('block') }}
                </Option>
                <Option key="Unblock" value="Unblock">
                    {{ $t('unblock') }}
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
export default class RestrictionTypeInput extends Vue {}
</script>

<style lang="less" scoped>
@import './RestrictionTypeInput.less';
</style>
