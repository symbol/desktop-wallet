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
                            <span class="label">{{ $t('accounts_flags_default_account') }}</span>
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

                    <div class="detail-row">
                        <AccountAliasDisplay :account="currentAccount" />
                    </div>
                </div>


                
                <!-- TODO : Make a "CosignatoryDisplay" component -->
                <div class="detail-row" style="margin-top:1; max-height:25vh; overflow-y: auto; overflow-x: hidden;">
                    <div class="account-detail-row">
                            <div class="account-detail-row-3cols">
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                                <span class="title">Cosignatory of:</span>
                                <span class="title">YUGWDYDIUQWDITo7dybuYUGWDYDIUQWDITo7dybuIUQWDITo7dybuYUu</span>
                            </div>
                    </div>
                </div>

                <br>
                <br>
                <div class="bottom-buttons-container">
                    <button type="button" class="centered-button button-style inverted-button danger-button">Delete Account</button>
                    <button type="button" class="centered-button button-style inverted-button ">Hide Account</button>
                </div>
            
            </div>
        </div>

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
    color:@primary;
    margin-left:0.1em;
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


</style>
