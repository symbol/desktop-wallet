<template>
    <div class="detail-row">
        <div class="account-detail-row-3cols">
            <span class="label">{{ $t('private_key') }}</span>
            <span v-if="hasPlainPrivateKey" class="value accountPublicKey">{{ plainInformation }}</span>
            <span v-if="hasPlainPrivateKey">
                <span>
                    <ButtonCopyToClipboard v-model="plainInformation">
                        <img src="@/views/resources/img/account/cloneIcon.svg" class="copy-icon" />
                    </ButtonCopyToClipboard>
                </span>
            </span>
            <div v-else>
                <div class="value">
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

.copy-icon {
    width: 0.24rem;
    height: 0.24rem;
    cursor: pointer;
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
</style>
