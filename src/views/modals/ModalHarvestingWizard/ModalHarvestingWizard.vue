<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-harvesting-wizard" :footer-hide="true">
            <ModalWizardDisplay :items="wizardStepsItems" :icons="wizardStepsIcons" :current-item-index="currentStepIndex" />

            <div v-if="wizardSteps[currentStepIndex] === 'ACCOUNT_LINK'">
                <div v-if="!supportedProfileTypes.includes(currentAccount.type)">
                    <h2>Upps! Harvesting is available only for HD Accounts!</h2>
                </div>
                <div v-else-if="!isCurrentAccountLinked">
                    <FormRemoteAccountCreation @setRemoteAccount="onSetRemoteAccount" @toggleNext="onNextToggled" />
                </div>
                <div v-else-if="!!linkedAccount" class="form-remote-account">
                    <h2>{{ $t('harvesting_subtitle_overview') }}</h2>
                    <p>{{ $t('harvesting_remote_linked_description_1') }} {{ $t('harvesting_remote_linked_description_2') }}</p>

                    <div class="account-details-grid">
                        <p class="detail-row">
                            <AccountAddressDisplay :address="linkedAccount.address.plain()" />
                        </p>

                        <p class="detail-row">
                            <AccountPublicKeyDisplay :account="linkedAccount" />
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="wizardSteps[currentStepIndex] === 'SET_UP'">
                <div class="form-remote-account">
                    <h2>{{ $t('harvesting_subtitle_overview') }}</h2>
                    <p>
                        {{ $t('harvesting_remote_account_description_1') }} {{ $t('harvesting_create_remote_account') }}
                        {{ $t('harvesting_remote_account_description_3') }}
                    </p>

                    <div v-if="!!remoteAccount" class="account-details-grid">
                        <p class="detail-row">
                            <AccountAddressDisplay :address="remoteAccount.address.plain()" />
                        </p>

                        <p class="detail-row">
                            <AccountPublicKeyDisplay :account="remoteAccount" />
                        </p>

                        <p class="detail-row">
                            <ProtectedPrivateKeyDisplay :account="remoteAccount" />
                        </p>
                    </div>
                    <div v-else-if="!!linkedAccount" class="account-details-grid">
                        <p class="detail-row">
                            <AccountAddressDisplay :address="linkedAccount.address.plain()" />
                        </p>

                        <p class="detail-row">
                            <AccountPublicKeyDisplay :account="linkedAccount" />
                        </p>
                    </div>
                </div>

                <FormPersistentDelegationRequestTransaction
                    ref="delegationRequest"
                    :remote-account="!!remoteAccount ? remoteAccount.publicAccount : linkedAccount"
                    :with-link="!linkedAccount"
                    @setNodePublicKey="onSetNodePublicKey"
                    @error="(e) => form.setErrors({ endpoint: e })"
                />
            </div>
            <div v-if="wizardSteps[currentStepIndex] === 'CONFIRMATION'">
                <div class="form-remote-account">
                    <h2>{{ $t('harvesting_subtitle_confirmation') }}</h2>
                    <p>{{ $t('harvesting_confirmation_description_1') }} {{ $t('harvesting_confirmation_description_2') }}</p>

                    <FormTransactionConfirmation
                        ref="confirmationForm"
                        :command="command"
                        :hide-submit="true"
                        @success="onConfirmationSuccess"
                        @error="onConfirmationError"
                        @close="onConfirmationCancel"
                    />
                </div>
            </div>

            <div v-if="!!linkedAccount || !!remoteAccount" class="stepper-pagination">
                <div class="left">
                    <button
                        v-if="currentStepIndex > 0"
                        class="centered-button button-style validation-button cancel-button"
                        @click="onPreviousClicked"
                    >
                        {{ $t('previous') }}
                    </button>
                </div>
                <div class="right">
                    <button
                        v-if="!!linkedAccount || !!remoteAccount"
                        class="centered-button button-style validation-button submit-button"
                        @click="onNextClicked"
                    >
                        {{ $t('next') }}
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalHarvestingWizardTs } from './ModalHarvestingWizardTs';
export default class ModalHarvestingWizard extends ModalHarvestingWizardTs {}
</script>

<style lang="less" scoped>
@import '../../resources/css/variables.less';

/deep/.modal-harvesting-wizard {
    .ivu-steps.ivu-steps-small {
        width: 50%;
        margin: auto;

        .ivu-steps-item {
            text-align: center;

            .ivu-steps-head-inner {
                width: 0.64rem !important;
                height: 0.64rem !important;
                line-height: 0.58rem;
                background-color: @grayDark;
                font-weight: 800;
                border-radius: 50%;

                span {
                    font-size: 0.32rem;
                    color: @white;
                    padding-top: 0.15rem;
                    width: 0.32rem;
                    height: 0.32rem;
                }
            }
        }

        .ivu-steps-item.active {
            .ivu-steps-head-inner {
                background-color: @primary;
            }
        }

        .ivu-steps-item.completed {
            .ivu-steps-head-inner {
                background-color: @primary;
            }
        }

        .ivu-steps-item:last-child {
            flex: 1;
        }

        .ivu-steps-tail {
            display: none;
        }

        .ivu-steps-main {
            display: block;

            .ivu-steps-title {
                font-family: @symbolFont;
                font-size: @normalFont;
            }
        }
    }

    .form-remote-account,
    .form-persistent-delegation-request {
        h2 {
            font-family: @symbolFont;
            font-size: @subtitleFont;
            color: @secondary;
            font-weight: 900;
            margin-top: 0.15rem;
            margin-bottom: 0.15rem;
        }

        p {
            font-family: @symbolFont;
            font-size: 0.22rem;
            font-weight: 400;
            color: @secondary;
            margin-bottom: 0.05rem;
        }

        .account-detail-row-3cols {
            display: flex;
            color: @black;

            .label {
                width: 1.5rem;
            }

            .value {
                font-weight: 600;
            }
        }
    }

    .stepper-pagination {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(2, 50%);

        .left {
            padding-right: 50%;
        }

        .right {
            padding-left: 50%;
            justify-self: right;
        }
    }

    .form-row-inner-container {
        grid-template-columns: 12% 85%;
    }

    .ivu-modal-body {
        max-height: inherit;
    }
}
</style>
