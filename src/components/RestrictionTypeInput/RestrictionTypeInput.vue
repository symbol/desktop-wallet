<template>
    <FormRow>
        <template v-slot:label
            ><Tooltip word-wrap placement="top-start" :content="$t('form_label_restriction_type_tooltip')">
                <Icon type="ios-information-circle-outline" />
            </Tooltip>
            {{ $t('type') }}:
        </template>
        <template v-slot:inputs>
            <div class="inputs-container select-container">
                <Select
                    :value="value"
                    :disabled="disabled"
                    :placeholder="$t('type')"
                    class="select-size select-style"
                    @on-change="onBlockTypeChange"
                >
                    <Option key="Block" value="block">
                        {{ $t('block') }}
                    </Option>
                    <Option key="Allow" value="allow">
                        {{ $t('allow') }}
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

export enum RestrictionBlockType {
    BLOCK = 'block',
    ALLOW = 'allow',
}

@Component({ components: { FormRow } })
export default class RestrictionTypeInput extends Vue {
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: RestrictionBlockType.BLOCK }) readonly value!: RestrictionBlockType;

    onBlockTypeChange(newValue) {
        this.$emit('input', newValue);
    }
}
</script>

<style lang="less" scoped>
@import './RestrictionTypeInput.less';
</style>
