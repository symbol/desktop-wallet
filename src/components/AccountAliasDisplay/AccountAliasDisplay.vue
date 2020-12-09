<template>
    <div class="account-detail-row-3cols">
        <span class="label">{{ $t('aliases') }}:</span>
        <div class="value account-aliases">
            <span v-for="(alias, index) in accountAliasNames" :key="index">
                {{ index === accountAliasNames.length - 1 ? `${alias}` : `${alias},` }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { AccountAliasDisplayTs } from './AccountAliasDisplayTs';
export default class AccountAliasDisplay extends AccountAliasDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.18rem;
    cursor: pointer;
}

.account-aliases {
    margin-bottom: 0.3rem;
    span {
        margin-right: 0.08rem;
    }
}
</style>
