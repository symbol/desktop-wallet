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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MetadataType } from 'symbol-sdk';
import { mapGetters } from 'vuex';

// @ts-ignore
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';

import { ScopedMetadataKeysHelpers } from '@/core/utils/ScopedMetadataKeysHelpers';
import { NamespaceModel } from '@/core/database/entities/NamespaceModel';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { AccountModel } from '@/core/database/entities/AccountModel';

// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        MaxFeeSelector,
        FormRow,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            knownAccounts: 'account/knownAccounts',            namespaces: 'namespace/ownedNamespaces',
            ownedMosaics: 'mosaic/ownedMosaics',
            ownedNamespaces: 'namespace/ownedNamespaces',
        })
    },
})
export class FormMetadataCreationTs extends Vue {

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
     * Form fields
     * @var {Object}
     */
    public formItems = {
        accountAddress: '',
        targetAccount: '',
        targetId: '',
        scopedKey: '',
        metadataValue: '',
        maxFee: '',
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
     * Current account
     * @protected
     * @type {AccountModel}
     */
    protected currentAccount: AccountModel;

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
        this.formItems.accountAddress = this.currentAccount.address;
        this.formItems.metadataValue = '';
        this.formItems.scopedKey = '';
        this.formItems.metadataValue = '';
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
     * Persist created metadata
     * @return {void}
     */
    protected onSubmit() : void {
        ScopedMetadataKeysHelpers.storeKey(this.formItems.scopedKey);

        switch(this.type) {
            case MetadataType.Account:
                break;

            case MetadataType.Mosaic:
                break;

            case MetadataType.Namespace:
                break;
        }
    }

}