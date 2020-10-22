<template>
    <div class="account-detail-row">
        <div class="label">
            {{ $t('account_name') }}
        </div>
        <div class="value field-name">
            <span v-if="account" class="accountName">{{ account.name }}</span>
            <button
                type="button"
                class="edit-button"
                @click.stop="hasNameFormModal = true"
            >
                <Icon type="md-create" />
            </button>
        </div>

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
    background: @grayLightest;
    border:none;
    color: @blackLight;
    float:right;
    margin-right:2%;
    text-align: center;
    cursor: pointer;
}

.field-name {
    background: @grayLightest;
    padding-left: 6px;
    border-radius:3px;
    width:65%;
}
</style>
