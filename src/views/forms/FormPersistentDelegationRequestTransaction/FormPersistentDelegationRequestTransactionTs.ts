/*
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import {
    Address,
    UInt64,
    AccountKeyLinkTransaction,
    LinkAction,
    Transaction,
    VrfKeyLinkTransaction,
    Account,
    NodeKeyLinkTransaction,
    PersistentDelegationRequestTransaction,
    AccountInfo,
} from 'symbol-sdk';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { Formatters } from '@/core/utils/Formatters';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';

// child components
import { ValidationObserver } from 'vee-validate';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import NetworkNodeSelector from '@/components/NetworkNodeSelector/NetworkNodeSelector.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';

import { feesConfig } from '@/config';
import { HarvestingStatus } from '@/store/Harvesting';

export enum HarvestingAction {
    START = 1,
    STOP = 2,
    SWAP = 3,
}

@Component({
    components: {
        FormWrapper,
        ModalTransactionConfirmation,
        SignerSelector,
        ValidationObserver,
        MaxFeeAndSubmit,
        FormRow,
        NetworkNodeSelector,
    },
    computed: {
        ...mapGetters({
            currentHeight: 'network/currentHeight',
            currentSignerAccountInfo: 'account/currentSignerAccountInfo',
            harvestingStatus: 'harvesting/status',
        }),
    },
})
export class FormPersistentDelegationRequestTransactionTs extends FormTransactionBase {
    @Prop({ default: null }) signerAddress: string;
    //@Prop({ default: true }) withLink: boolean;

    /**
     * Formatters helpers
     */
    public formatters = Formatters;

    /**
     * Form items
     */
    public formItems = {
        nodePublicKey: '',
        signerAddress: '',
    };

    private newVrfKeyAccount: Account;
    private newRemoteAccount: Account;

    /**
     * Current signer account info
     */
    private currentSignerAccountInfo: AccountInfo;

    private action = HarvestingAction.START;

    private harvestingStatus: HarvestingStatus;

    /**
     * Reset the form with properties
     * @return {void}
     */
    protected resetForm() {
        // - set default form values
        this.action = HarvestingAction.START;
        // - maxFee must be absolute
        this.newVrfKeyAccount = Account.generateNewAccount(this.networkType);
        this.newRemoteAccount = Account.generateNewAccount(this.networkType);
    }

    @Watch('currentSignerAccountInfo', { immediate: true })
    private currentSignerWatch() {
        this.formItems.signerAddress = this.signerAddress || this.currentSignerAccountInfo?.address.plain();

        if (this.isNodeKeyLinked) {
            this.formItems.nodePublicKey = this.currentSignerAccountInfo?.supplementalPublicKeys.node.publicKey;
        } else {
            this.formItems.nodePublicKey = '';
        }
    }

    /**
     * Getter for PERSISTENT DELEGATION REQUEST transactions that will be staged
     * @see {FormTransactionBase}
     * @return {TransferTransaction[]}
     */
    protected getTransactions(): Transaction[] {
        const maxFee = UInt64.fromUint(feesConfig.highest); // fixed to the Highest, txs must get confirmed
        const txs: Transaction[] = [];

        /*
         START => link all (new keys)
         STOP =>  unlink all (linked keys)
         SWAP =>  unlink(linked) + link all (new keys)
         */

        if (this.isAccountKeyLinked) {
            const accountKeyUnLinkTx = this.createAccountKeyLinkTx(
                this.currentSignerAccountInfo.supplementalPublicKeys.linked.publicKey,
                LinkAction.Unlink,
                maxFee,
            );
            txs.push(accountKeyUnLinkTx);
        }

        if (this.isVrfKeyLinked) {
            const vrfKeyUnLinkTx = this.createVrfKeyLinkTx(
                this.currentSignerAccountInfo.supplementalPublicKeys.vrf.publicKey,
                LinkAction.Unlink,
                maxFee,
            );
            txs.push(vrfKeyUnLinkTx);
        }

        if (this.isNodeKeyLinked) {
            const nodeUnLinkTx = this.createNodeKeyLinkTx(
                this.currentSignerAccountInfo.supplementalPublicKeys.node.publicKey,
                LinkAction.Unlink,
                maxFee,
            );

            txs.push(nodeUnLinkTx);
        }

        if (this.action !== HarvestingAction.STOP) {
            const accountKeyLinkTx = this.createAccountKeyLinkTx(this.newRemoteAccount.publicKey, LinkAction.Link, maxFee);
            const vrfKeyLinkTx = this.createVrfKeyLinkTx(this.newVrfKeyAccount.publicKey, LinkAction.Link, maxFee);
            const nodeLinkTx = this.createNodeKeyLinkTx(this.formItems.nodePublicKey, LinkAction.Link, maxFee);

            txs.push(accountKeyLinkTx, vrfKeyLinkTx, nodeLinkTx);

            const persistentDelegationReqTx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                this.createDeadline(),
                this.newRemoteAccount.privateKey,
                this.newVrfKeyAccount.privateKey,
                this.formItems.nodePublicKey,
                this.networkType,
                maxFee,
            );
            txs.push(persistentDelegationReqTx);
        }

        return txs;
    }

    private createAccountKeyLinkTx(publicKey: string, linkAction: LinkAction, maxFee: UInt64): AccountKeyLinkTransaction {
        return AccountKeyLinkTransaction.create(this.createDeadline(), publicKey, linkAction, this.networkType, maxFee);
    }
    private createVrfKeyLinkTx(publicKey: string, linkAction: LinkAction, maxFee: UInt64): VrfKeyLinkTransaction {
        return VrfKeyLinkTransaction.create(this.createDeadline(), publicKey, linkAction, this.networkType, maxFee);
    }
    private createNodeKeyLinkTx(publicKey: string, linkAction: LinkAction, maxFee: UInt64): NodeKeyLinkTransaction {
        return NodeKeyLinkTransaction.create(this.createDeadline(), publicKey, linkAction, this.networkType, maxFee);
    }

    /**
     * Whether all keys are linked
     */
    private get allKeysLinked(): boolean {
        return this.isAccountKeyLinked && this.isVrfKeyLinked && this.isNodeKeyLinked;
    }

    /**
     * Whether account key is linked
     */
    private get isAccountKeyLinked(): boolean {
        return !!this.currentSignerAccountInfo?.supplementalPublicKeys.linked;
    }

    /**
     * Whether vrf key is linked
     */
    private get isVrfKeyLinked(): boolean {
        return !!this.currentSignerAccountInfo?.supplementalPublicKeys.vrf;
    }

    /**
     * Whether node key is linked
     */
    private get isNodeKeyLinked(): boolean {
        return !!this.currentSignerAccountInfo?.supplementalPublicKeys.node;
    }

    /**
     * Setter for TRANSFER transactions that will be staged
     * @see {FormTransactionBase}
     * @throws {Error} If not overloaded in derivate component
     */
    protected setTransactions() {
        throw new Error('This transaction can not be staged');
    }

    /**
     * Recipient used in the transaction
     * @readonly
     * @protected
     * @type {Address}
     */
    protected get instantiatedRecipient(): Address {
        return Address.createFromPublicKey(this.formItems.nodePublicKey, this.networkType);
    }

    public onStart() {
        this.action = HarvestingAction.START;
        this.onSubmit();
    }

    public onStop() {
        this.action = HarvestingAction.STOP;
        this.onSubmit();
    }

    public onSwap() {
        this.action = HarvestingAction.SWAP;
        this.onSubmit();
    }

    public get swapDisabled(): boolean {
        return this.formItems.nodePublicKey === this.currentSignerAccountInfo.supplementalPublicKeys?.node?.publicKey;
    }

    public onSubmit() {
        if (!this.allKeysLinked && !this.formItems.nodePublicKey.length) {
            this.$refs.observer.setErrors({ endpoint: this.$t('invalid_node').toString() });
            return;
        }

        // - open signature modal
        this.command = this.createTransactionCommand();
        this.onShowConfirmationModal();
        return this.command;
    }
}
