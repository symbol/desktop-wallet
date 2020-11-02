<template>
    <div class="switch_language">
        <!--<img class="language_icon" :src="require('@/views/resources/img/login/language.svg')" alt="" />-->
        <i-select v-model="language" :class="{ 'select-size select-style': defaultFormStyle }">
            <i-option v-for="({ label, value }, index) in languageList" :key="index" :value="value">
                {{ label }}
            </i-option>
        </i-select>
    </div>
</template>

<script lang="ts">
import { LanguageSelectorTs } from './LanguageSelectorTs';

export default class LanguageSelector extends LanguageSelectorTs {}
</script>
<style lang="less" scoped>
@import './LanguageSelector.less';
</style>
