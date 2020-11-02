<template>
    <div class="account-detail-row-3cols">
        <div class="label">{{ $t('account_name') }}:</div>

        <div class="value field-name">
            <span v-if="account" class="accountName">{{ account.name }}</span>
        </div>

        <button type="button" class="edit-button" @click.stop="hasNameFormModal = true">
            <Icon type="md-create" />
        </button>

        <ModalFormAccountNameUpdate v-if="hasNameFormModal" :visible="hasNameFormModal" @close="hasNameFormModal = false" />
    </div>
</template>

<script lang="ts">
import { AccountNameDisplayTs } from './AccountNameDisplayTs';

export default class AccountNameDisplay extends AccountNameDisplayTs {}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.edit-button {
    height: 0.1rem !important;
    width: 0.1rem !important;
    background: transparent;
    border: none;
    color: @blackLight;
    text-align: center;
    cursor: pointer;
    font-size: 1em;
    margin-right: 30px;
}

.value {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
