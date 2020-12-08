<template>
    <FormRow>
        <template v-slot:label> {{ $t('direction') }}: </template>
        <template v-slot:inputs>
            <div class="inputs-container select-container">
                <Select
                    :value="value"
                    :disabled="disabled"
                    :placeholder="$t('direction')"
                    class="select-size select-style"
                    @on-change="onDirectionChange"
                >
                    <Option key="incoming" value="incoming">
                        {{ $t('incoming') }}
                    </Option>
                    <Option key="outgoing" value="outgoing">
                        {{ $t('outgoing') }}
                    </Option>
                </Select>
            </div>
        </template>
    </FormRow>
</template>

<script lang="ts">
// extenal dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';

// child components
import FormRow from '@/components/FormRow/FormRow.vue';

export enum RestrictionDirection {
    INCOMING = 'incoming',
    OUTGOING = 'outgoing',
}

@Component({ components: { FormRow } })
export default class RestrictionDirectionInput extends Vue {
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: RestrictionDirection.OUTGOING }) readonly value!: RestrictionDirection;

    onDirectionChange(newValue) {
        this.$emit('input', newValue);
    }
}
</script>

<style lang="less" scoped>
@import './RestrictionDirectionInput.less';
</style>
