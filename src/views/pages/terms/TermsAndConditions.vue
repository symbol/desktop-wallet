<template>
    <div class="container">
        <pdf v-for="i in numPages" :key="i" :src="src" :page="i" class="pdf-page"></pdf>
        <button class="link" @click="backToLogin">{{ $t('back') }}</button>
    </div>
</template>
<script>
import TermsAndConditionsTs from './TermsAndConditionsTs';
export default class TermsAndConditions extends TermsAndConditionsTs {}
</script>

<style lang="less" scoped>
@import './TermsAndConditions.less';
</style>
