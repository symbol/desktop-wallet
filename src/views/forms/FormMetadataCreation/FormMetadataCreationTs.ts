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
    MetadataType,
    AccountMetadataTransaction,
    PublicAccount,
    Deadline,
    KeyGenerator,
    UInt64,
    MosaicMetadataTransaction,
    NamespaceMetadataTransaction,
    Address,
    Transaction,
    MosaicId,
    NamespaceId,
} from 'symbol-sdk';
import { Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// @ts-ignore
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { AddressValidator } from '@/core/validation/validators';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';
import { ScopedMetadataKeysHelpers } from '@/core/utils/ScopedMetadataKeysHelpers';
import { NamespaceModel } from '@/core/database/entities/NamespaceModel';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { Signer } from '@/store/Account';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import NamespaceSelector from '@/components/NamespaceSelector/NamespaceSelector.vue';
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        MaxFeeSelector,
        MosaicSelector,
        NamespaceSelector,
        MaxFeeAndSubmit,
        FormRow,
        ModalTransactionConfirmation,
    },
    computed: {
        ...mapGetters({
            knownAccounts: 'account/knownAccounts',            namespaces: 'namespace/ownedNamespaces',
            ownedMosaics: 'mosaic/ownedMosaics',
            ownedNamespaces: 'namespace/ownedNamespaces',
        })
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
     * Currently active signer
     */
    public selectedSigner: Signer;

    /**
     * Form fields
     * @var {Object}
     */
    public formItems = {
        formType: MetadataType.Account,
        accountAddress: '',
        targetAccount: '',
        targetId: '',
        scopedKey: '',
        metadataValue: '',
        maxFee: 0,
        password: ''
    }
    
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
        this.formItems.accountAddress = this.selectedSigner ? this.selectedSigner.address.plain() : this.currentAccount.address;

        // - set default form values
        this.formItems.metadataValue = '';
        this.formItems.scopedKey = '';
        this.formItems.metadataValue = '';

        // - maxFee must be absolute
        this.formItems.maxFee = this.defaultFee;
    }

    /**
     * Modal title from modal type
     * @type {string}
     */
    get modalTitle(): string {
        let title : string = '';
        switch(this.type) {
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
    get targetLabel() : string {
        let title : string = '';
        switch(this.type) {
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
     * Default explorer link list
     * @readonly
     * @type {string[]}
     */
    get cashedScopedKeys() {
        return ScopedMetadataKeysHelpers.loadScopedMetadataKeys();
    }

    /**
     * Target id validator name
     * @return {string}
     */
    get targetIdValidatorName(): string {
        return this.isMosaic() ? 'mosaic_id' : 'namespace_id';
    }

    get ownedTargetHexIds() : string[] {
        return this.type === MetadataType.Namespace
            ? this.ownedNamespaces.map(({ namespaceIdHex }) => namespaceIdHex)
            : this.ownedMosaics
                .filter(({ ownerRawPlain }) => ownerRawPlain === this.currentAccount.address)
                .map(({ mosaicIdHex }) => mosaicIdHex);

    }

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /**
     * Getter for metadata transactions that will be staged
     * @see {FormTransactionBase}
     * @return {MetadataTransaction}
     */
    protected getTransactions(): Transaction[] {
        let targetAddress: Address;
        if (AddressValidator.validate(this.formItems.targetAccount)) {
            targetAddress = Address.createFromRawAddress(this.formItems.targetAccount);
        } else {
            const targetPublicAccount = PublicAccount.createFromPublicKey(this.formItems.targetAccount, this.networkType);
            targetAddress = targetPublicAccount.address;
        }
        const deadline = Deadline.create(this.epochAdjustment);
        const scopedMetadataKey = KeyGenerator.generateUInt64Key(this.formItems.scopedKey);
        const maxFee = UInt64.fromUint(this.formItems.maxFee);

        switch(this.type) {
            case MetadataType.Account:
                return [
                    AccountMetadataTransaction.create(
                        deadline,
                        targetAddress,
                        scopedMetadataKey,
                        this.formItems.metadataValue.length,
                        this.formItems.metadataValue,
                        this.networkType,
                        maxFee,
                    )
                ];

            case MetadataType.Mosaic:
                const mosaicId = new MosaicId(this.formItems.targetId);
                return [
                    MosaicMetadataTransaction.create(
                        deadline,
                        targetAddress,
                        scopedMetadataKey,
                        mosaicId,
                        this.formItems.metadataValue.length,
                        this.formItems.metadataValue,
                        this.networkType,
                        maxFee,
                    )
                ];

            case MetadataType.Namespace:
                const namespaceId = new NamespaceId(this.formItems.targetId);
                return [
                    NamespaceMetadataTransaction.create(
                        deadline,
                        targetAddress,
                        scopedMetadataKey,
                        namespaceId,
                        this.formItems.metadataValue.length,
                        this.formItems.metadataValue,
                        this.networkType,
                        maxFee,
                    )
                ];

            default:
                return [];
        }
    }

}