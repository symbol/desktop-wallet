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
import { Address, MetadataType, PublicAccount, RepositoryFactory, Transaction } from 'symbol-sdk';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue';
// @ts-ignore
import NamespaceSelector from '@/components/NamespaceSelector/NamespaceSelector.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';

import { TransactionCommandMode } from '@/services/TransactionCommand';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { NamespaceModel } from '@/core/database/entities/NamespaceModel';
import { AddressValidator } from '@/core/validation/validators';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';

// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        MaxFeeSelector,
        MosaicSelector,
        NamespaceSelector,
        MaxFeeAndSubmit,
        FormWrapper,
        FormRow,
        ModalTransactionConfirmation,
        SignerSelector,
    },
    computed: {
        ...mapGetters({
            knownAccounts: 'account/knownAccounts',
            ownedMosaics: 'mosaic/ownedMosaics',
            ownedNamespaces: 'namespace/ownedNamespaces',
            repositoryFactory: 'network/repositoryFactory',
            metadataTransactions: 'metadata/transactions',
        }),
    },
})
export class FormMetadataCreationTs extends FormTransactionBase {
    /**
     * Metadata type
     * @type {MetadataType}
     */
    @Prop({
        default: MetadataType.Account,
        required: true,
    })
    protected type: MetadataType;

    /**
     * Metadata type
     */
    protected MetadataType = MetadataType;

    /**
     * Repository factory for metadata transaction service
     */
    protected repositoryFactory: RepositoryFactory;

    /**
     * metadata transactions
     */
    protected metadataTransactions: Transaction[];

    /**
     * Form fields
     * @var {Object}
     */
    public formItems = {
        signerAddress: '',
        targetAccount: '',
        targetId: '',
        metadataValue: '',
        maxFee: 0,
    };

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /**
     * Known accounts
     * @protected
     * @var {AccountModel[]}
     */
    protected knownAccounts: AccountModel[];

    /**
     * Current account owned mosaics
     * @protected
     * @type {MosaicModel[]}
     */
    protected ownedMosaics: MosaicModel[];

    /**
     * Current account owned namespaces
     * @protected
     * @type {NamespaceModel[]}
     */
    protected ownedNamespaces: NamespaceModel[];

    /**
     * Mosaic check
     * @return {boolean}
     */
    protected isMosaic(): boolean {
        return this.type === MetadataType.Mosaic;
    }

    /**
     * Reset the form with properties
     * @return {void}
     */
    protected resetForm() {
        this.formItems.signerAddress = this.selectedSigner ? this.selectedSigner.address.plain() : this.currentAccount.address;

        // - set default form values
        this.formItems.metadataValue = '';
        this.formItems.metadataValue = '';

        // - maxFee must be absolute
        this.formItems.maxFee = this.defaultFee;
    }

    /**
     * get transaction command mode
     * @override
     * @see {FormTransactionBase}
     * @param transactions
     */
    protected getTransactionCommandMode(): TransactionCommandMode {
        const target = this.getTargetAddress().plain();
        if (this.selectedSigner.multisig) {
            return TransactionCommandMode.MULTISIGN;
        } else if (this.formItems.signerAddress === target) {
            return TransactionCommandMode.AGGREGATE;
        } else if (this.isMultisigAccount) {
            // multisig mode
        } else {
            return TransactionCommandMode.MULTISIGN;
        }
    }

    /**
     * get transactions
     * @see {FormTransactionBase}
     */
    public getTransactions() {
        return this.metadataTransactions;
    }

    /**
     * @override
     * @see {FormTransactionBase}
     */
    public async onSubmit() {
        await this.persistFormState();

        // - open signature modal
        this.command = this.createTransactionCommand();
        this.onShowConfirmationModal();
    }

    /**
     * Modal title from modal type
     * @type {string}
     */
    get modalTitle(): string {
        let title: string = '';
        switch (this.type) {
            case MetadataType.Mosaic:
                title = 'modal_title_mosaic_metadata';
                break;

            case MetadataType.Namespace:
                title = 'modal_title_namespace_metadata';
                break;

            default:
                title = 'modal_title_account_metadata';
                break;
        }
        return title;
    }

    /**
     * Target account or public key label depends on MetadataType
     * @param {void}
     * @returns {string}
     */
    get targetLabel(): string {
        let title: string = '';
        switch (this.type) {
            case MetadataType.Mosaic:
                title = 'form_label_target_mosaic_id';
                break;

            case MetadataType.Namespace:
                title = 'form_label_target_namespace_id';
                break;
        }
        return title;
    }

    /**
     * Target id validator name
     * @return {string}
     */
    get targetIdValidatorName(): string {
        return this.isMosaic() ? 'mosaic_id' : 'namespace_id';
    }

    get ownedTargetHexIds(): string[] {
        return this.type === MetadataType.Namespace
            ? this.ownedNamespaces.map(({ namespaceIdHex }) => namespaceIdHex)
            : this.ownedMosaics
                  .filter(({ ownerRawPlain }) => ownerRawPlain === this.currentAccount.address)
                  .map(({ mosaicIdHex }) => mosaicIdHex);
    }

    private async persistFormState() {
        const targetAddress: Address = this.getTargetAddress();
        const metadataForm: {
            targetAddress: Address;
            metadataValue: string;
            targetId: string;
            maxFee: number;
        } = {
            targetAddress,
            metadataValue: this.formItems.metadataValue,
            targetId: this.formItems.targetId,
            maxFee: this.formItems.maxFee,
        };

        await this.$store.dispatch('metadata/SET_METADATA_FORM_STATE', metadataForm);
        await this.$store.dispatch('metadata/RESOLVE_METADATA_TRANSACTIONS', this.type);
    }

    private getTargetAddress(): Address {
        let targetAddress: Address;
        if (AddressValidator.validate(this.formItems.targetAccount)) {
            targetAddress = Address.createFromRawAddress(this.formItems.targetAccount);
        } else {
            const targetPublicAccount = PublicAccount.createFromPublicKey(this.formItems.targetAccount, this.networkType);
            targetAddress = targetPublicAccount.address;
        }

        return targetAddress;
    }

    /**
     * Whether form has any changes
     * @readonly
     * @return {boolean}
     */
    public get hasFormAnyChanges(): boolean {
        return (
            this.formItems.signerAddress.length > 0 || this.formItems.targetAccount.length > 0 || this.formItems.metadataValue.length > 0
        );
    }
}
