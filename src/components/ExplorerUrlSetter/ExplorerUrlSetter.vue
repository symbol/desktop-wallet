<template>
    <FormRow>
        <template v-slot:label> {{ $t('set_explorer_link') }}: </template>
        <template v-slot:inputs>
            <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="explorerUrl"
                :name="$t('explorer_url')"
                :rules="validationRules.url"
                tag="div"
                class="inputs-container select-container"
            >
                <ErrorTooltip :errors="errors">
                    <AutoComplete
                        v-model="chosenExplorerUrl"
                        :placeholder="$t('node')"
                        :data="defaultExplorerLinkList"
                        class="auto-complete-size auto-complete-style"
                        @on-change="$emit('on-change')"
                    />
                </ErrorTooltip>
            </ValidationProvider>
        </template>
    </FormRow>
</template>

<script>
import { ExplorerUrlSetterTs } from './ExplorerUrlSetterTs';
export default class ExplorerUrlSetter extends ExplorerUrlSetterTs {}
</script>
<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

/deep/ .ivu-select-dropdown {
    margin: 0 !important;
    margin-left: -2% !important;
    margin-top: 0.5% !important;
    padding: 0 !important;
    background: @grayLightest;
}

/deep/ .auto-complete-style {
    padding-left: 2.1%;

    .ivu-input {
        background: transparent !important;
        color: @primary;
    }
}

/deep/ .ivu-select-item-focus {
    color: @primary;
}
</style>
