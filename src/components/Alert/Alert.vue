<template>
    <transition name="collapse">
        <div v-if="visible" class="root" :class="rootClass">
            <img class="icon" :src="iconSrc" />
            <div class="text">{{ value }}</div>
        </div>
    </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { officialIcons } from '@/views/resources/Images';

type Type = 'sucess' | 'warning' | 'danger';

@Component
export default class Alert extends Vue {
    @Prop({ default: 'warning' }) readonly type: Type;
    @Prop() readonly value: string;
    @Prop({ default: true }) readonly visible: boolean;

    private ImageWarning = officialIcons.warningWhite;
    private ImageInfo = officialIcons.infoWhite;

    get rootClass(): string {
        return 'color-' + this.type;
    }

    get isIconShown(): boolean {
        return this.visible && (this.type === 'warning' || this.type === 'danger' || this.type === 'sucess');
    }

    get iconSrc(): boolean {
        return this.type === 'danger' ? this.ImageWarning : this.ImageInfo;
    }
}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.root {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 0.15rem 0.3rem;
    margin: 0.2rem 0;
    color: @white;
    font-size: @normalFont;
    font-family: @symbolFontSemiBold;
    line-height: @normalFontLineHeight;
    white-space: pre-wrap;
    text-align: justify;
    border-radius: @borderRadius;
    max-height: 5rem;
}

.icon {
    width: 0.3rem;
    flex: auto 0 0;
    margin-right: 0.2rem;
}

.text {
    flex: auto 1 1;
}

.color-success {
    background-color: @accentGreen;
}

.color-warning {
    background-color: @accentOrange;
}

.color-danger {
    background-color: @redDark;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: max-height 0.2s;
}
.collapse-enter,
.collapse-leave-to {
    max-height: 0;
}
</style>
