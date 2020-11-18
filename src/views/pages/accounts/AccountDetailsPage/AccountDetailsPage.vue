<template>
    <div v-show="currentAccount" class="account-detail-outer-container">
        <div class="account-detail-inner-container">
            <div class="left-container">
                <AccountContactQR :account="currentAccount" />
            </div>
            <div class="right-container">
                <div class="account-details-grid">
                    <div class="detail-row">
                        <AccountNameDisplay v-if="currentAccount" :account="currentAccount" :editable="true" />
                    </div>

                    <div class="detail-row">
                        <ImportanceScoreDisplay v-if="currentAccount" :address="currentAccount.address" />
                    </div>

                    <div class="detail-row">
                        <AccountAddressDisplay v-if="currentAccount" :address="currentAccount.address" />
                    </div>

                    <div class="detail-row">
                        <AccountPublicKeyDisplay :account="currentAccount" />
                    </div>

                    <div class="detail-row">
                        <ProtectedPrivateKeyDisplay :account="currentAccount" />
                    </div>

                    <!-- default account flag -->
                    <div v-if="currentAccount && defaultAccount === currentAccount.id" class="detail-row">
                        <div class="account-detail-row">
                            <span class="label">{{ $t('accounts_flags_default_account') }}:</span>
                            <div class="value">
                                <span>{{ $t('accounts_flags_default_account_explain') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- simple/multisig flag -->
                    <div v-if="currentAccount && currentAccount.isMultisig" class="detail-row">
                        <div class="account-detail-row">
                            <span class="label">{{ $t('accounts_flags_default_account') }}</span>
                            <div class="value">
                                <span>{{ $t('accounts_flags_default_account_explain') }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="!!accountMetadataList.length" class="detail-row">
                        <AccountMetadataDisplay
                            :metadata-list="accountMetadataList"
                            :visible="!!accountMetadataList.length"
                            @on-view-metadata="showMetadataDetailModal = true"
                        />
                    </div>

                    <div class="detail-row">
                        <AccountAliasDisplay :account="currentAccount" />
                    </div>

                    <div class="graph-row">
                        <AccountMultisigGraph
                            v-if="currentAccount && currentAccount.isMultisig"
                            :account="currentAccount"
                            :visible="currentAccount.isMultisig"
                        />
                        <div class="bottom-buttons-container">
                            <span></span>
                            <button
                                type="button"
                                class="centered-button button-style button danger-button"
                                :disabled="knownAccounts.length <= 1"
                                @click="deleteAccount()"
                            >
                                {{ $t('delete_account') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalFormProfileUnlock
            v-if="hasAccountUnlockModal"
            :visible="hasAccountUnlockModal"
            :on-success="onAccountUnlocked"
            @close="hasAccountUnlockModal = false"
        />
        <ModalMetadataDisplay
            v-if="showMetadataDetailModal"
            :visible="showMetadataDetailModal"
            :metadata-list="accountMetadataList"
            @close="showMetadataDetailModal = false"
        />

        <!--<div class="account-detail-inner-container">
            <div class="left-container">
                <div class="title-row">
                    <span>{{ $t('accounts_subtitle_account_links') }}</span>
                </div>

                <AccountLinks :account="currentAccount" />
            </div>
        </div>-->
    </div>
</template>

<script lang="ts">
import { AccountDetailsPageTs } from './AccountDetailsPageTs';
export default class AccountDetailsPage extends AccountDetailsPageTs {}
</script>

<style lang="less" scoped>
@import './AccountDetailsPage.less';

.title {
    color: @primary;
    font-size: 18px;
}

.bottom-buttons-container {
    margin-left: auto;
    margin-right: 1em;
    width: 50%;
    display: grid;
    grid-template-columns: 50% 50%;
}
.bottom-buttons-container button {
    margin: 0 0.5em;
}

.overflow-elipsis {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
