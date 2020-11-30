/*
 * Copyright 2020-present NEM (https://nem.io)
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
    EncryptedMessage,
    Message,
    Mosaic,
    MosaicId,
    NamespaceId,
    PlainMessage,
    RawUInt64,
    Transaction,
    TransferTransaction,
    UInt64,
    Account,
    PublicAccount,
} from 'symbol-sdk';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { Formatters } from '@/core/utils/Formatters';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';
// child components
import { ValidationObserver } from 'vee-validate';
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';
// @ts-ignore
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue';
// @ts-ignore
import RestrictionDirectionInput from '@/components/RestrictionDirectionInput/RestrictionDirectionInput.vue';
// @ts-ignore
import RestrictionTypeInput from '@/components/RestrictionTypeInput/RestrictionTypeInput.vue';
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';

// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import {FilterHelpers} from "@/core/utils/FilterHelpers";

@Component({
    components: {
        AmountInput,
        FormWrapper,
        MessageInput,
        ModalTransactionConfirmation,
        RecipientInput,
        SignerSelector,
        ValidationObserver,
        MaxFeeAndSubmit,
        FormRow,
        RestrictionTypeInput,
        ProtectedPrivateKeyDisplay,
        ModalFormProfileUnlock,
        RestrictionDirectionInput,
    },
    computed: {
        ...mapGetters({
            currentHeight: 'network/currentHeight',
            currentRecipient: 'account/currentRecipient',
        }),
    },
})
export class FormAccountRestrictionTransactionTs extends FormTransactionBase {
    @Prop({
        default: null,
    })
    recipient: Address;

    @Prop({
        default: false,
    })
    hideSigner: boolean;

    /// end-region component properties

    /**
     * Formatters helpers
     * @var {Formatters}
     */
    public formatters = Formatters;

    /**
     * Form items
     * @var {any}
     */
    public formItems = {
        signerAddress: '',
        maxFee: 0,
        signerPublicKey: '',
        recipientRaw: '',
    };

    public currentHeight: number;

    /**
     * Calculated recommended fee based on the txs size
     */
    private calculatedRecommendedFee: number = 0;

    /**
     * Calculated highest fee based on the txs size
     */
    private calculatedHighestFee: number = 0;

    private showUnlockAccountModal = false;

    /**
     * Reset the form with properties
     * @return {void}
     */
    protected resetForm() {
    }

    /// region computed properties getter/setter

    protected get hasAccountUnlockModal(): boolean {
        return this.showUnlockAccountModal;
    }

    protected set hasAccountUnlockModal(f: boolean) {
        this.showUnlockAccountModal = f;
    }

    /// end-region computed properties getter/setter

    /**
     * Handler when changing max fee
     */
    onChangeMaxFee() {}

    triggerChange() {
    }

    /**
     * Handler when changing recipient
     */
    onChangeRecipient() {
    }

    /**
     * Hook called when the account has been unlocked
     * @param {Account} account
     * @return {boolean}
     */
    onAccountUnlocked(account: Account): boolean {
        this.hasAccountUnlockModal = false;
        return true;
    }

    closeAccountUnlockModal() {
        this.hasAccountUnlockModal = false;
    }

    /**
     * Resets calculated dynamic fees
     */
    private resetDynamicFees() {
        this.calculatedRecommendedFee = 0;
        this.calculatedHighestFee = 0;
    }
}
