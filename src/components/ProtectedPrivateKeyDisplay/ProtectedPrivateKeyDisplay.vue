<template>
    <div class="detail-row">
        <div :class="[$route.fullPath === '/delegatedHarvesting' ? 'account-detail-harvesting' : 'account-detail-row-3cols']">
            <span v-if="$route.fullPath !== '/delegatedHarvesting'" class="label">{{ $t('private_key') }}</span>
            <span v-if="hasPlainPrivateKey" class="value accountPublicKey">{{ plainInformation }}</span>
            <span v-if="hasPlainPrivateKey">
                <span>
                    <ButtonCopyToClipboard v-model="plainInformation" type="icon-black" />
                </span>
            </span>
            <div v-else>
                <Tooltip
                    v-if="!hasPrivateKey"
                    word-wrap
                    placement="bottom"
                    class="linked-label not-linked-input"
                    :content="$t('please_link_your_public_key')"
                >
                    <span> {{ $t('not_linked') }}:</span>
                    <Icon type="ios-information-circle-outline" />
                </Tooltip>
                <div v-else class="value">
                    <button type="button" class="show-button" @click="onClickDisplay">
                        {{ $t('show_button') }}
                    </button>
                </div>
            </div>
            <ModalFormProfileUnlock
                v-if="hasAccountUnlockModal"
                :visible="hasAccountUnlockModal"
                :on-success="onAccountUnlocked"
                @close="hasAccountUnlockModal = false"
            />
        </div>
    </div>
</template>

<script>
import { ProtectedPrivateKeyDisplayTs } from './ProtectedPrivateKeyDisplayTs';
export default class ProtectedPrivateKeyDisplay extends ProtectedPrivateKeyDisplayTs {}
</script>

<style lang="less" scoped>
@import './../../views/resources/css/variables.less';

.show-button {
    border: none !important;
    font-weight: bold;
    cursor: pointer;
    background-color: transparent;
    color: @purpleLightest;
}

.timer-span {
    padding-left: 8px;
}

.value {
    font-family: @symbolFontLight;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #44004e;
}

.account-detail-row-3cols {
    display: grid;
    grid-template-columns: 1.4rem 5rem auto;
}

.account-detail-harvesting {
    display: grid;
    grid-template-columns: 5rem auto;
}

.not-linked-input {
    padding-left: 0.15rem;
    padding-top: 4px;
}
</style>
