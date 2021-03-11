<template>
    <div v-if="!disabled" class="round-button" @click="$emit('click')">
        <Icon type="md-add-circle" :size="size" />
        <span v-if="title" class="add-button-title">{{ title }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ButtonAdd extends Vue {
    @Prop({ default: false }) disabled: boolean;
    @Prop({ default: undefined }) title: boolean;
    @Prop({ default: undefined }) size: string;
}
</script>

<style lang="less" scoped>
@import './ButtonAdd.less';
</style>
