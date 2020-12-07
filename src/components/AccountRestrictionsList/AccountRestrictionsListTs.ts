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
// external dependencies
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd';
// @ts-ignore
import SignerFilter from '@/components/SignerFilter/SignerFilter.vue';
// @ts-ignore
import { TableAssetType } from '@/components/TableDisplay/TableAssetType';
// @ts-ignore
import { TableDisplayTs } from '@/components/TableDisplay/TableDisplayTs';
// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue';
// @ts-ignore
import { AccountRestrictionTableService } from '@/services/AssetTableService/AccountRestrictionTableService';
// internal dependencies
import { AssetTableService } from '@/services/AssetTableService/AssetTableService';
import { AccountRestrictionTxType } from '@/views/forms/FormAccountRestrictionTransaction/FormAccountRestrictionTransactionTs';
// @ts-ignore
import FormAliasTransaction from '@/views/forms/FormAliasTransaction/FormAliasTransaction.vue';
// @ts-ignore
import FormExtendNamespaceDurationTransaction from '@/views/forms/FormExtendNamespaceDurationTransaction/FormExtendNamespaceDurationTransaction.vue';
// @ts-ignore
import FormMosaicSupplyChangeTransaction from '@/views/forms/FormMosaicSupplyChangeTransaction/FormMosaicSupplyChangeTransaction.vue';
// @ts-ignore
import ModalFormWrap from '@/views/modals/ModalFormWrap/ModalFormWrap.vue';
// @ts-ignore
import ModalMetadataDisplay from '@/views/modals/ModalMetadataDisplay/ModalMetadataDisplay.vue';
// @ts-ignore
import ModalMetadataUpdate from '@/views/modals/ModalMetadataUpdate/ModalMetadataUpdate.vue';
import { Address } from 'symbol-sdk';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

export type AccountRestrictionTableField = {
    label: string;
    name: string;
    type: 'text' | 'check' | 'icon';
};

@Component({
    components: {
        TableRow,
        ModalFormWrap,
        FormAliasTransaction,
        FormExtendNamespaceDurationTransaction,
        FormMosaicSupplyChangeTransaction,
        ModalMetadataDisplay,
        SignerFilter,
        ButtonAdd,
        ModalMetadataUpdate,
    },
    computed: {
        ...mapGetters({
            accountAddressRestrictions: 'restriction/accountAddressRestrictions',
            accountMosaicRestrictions: 'restriction/accountMosaicRestrictions',
            accountOperationRestrictions: 'restriction/accountOperationRestrictions',
            isFetchingRestrictions: 'restriction/isFetchingRestrictions',
            currentSignerAddress: 'account/currentSignerAddress',
        }),
    },
})
export class AccountRestrictionsListTs extends TableDisplayTs {
    /**
     * Type of assets shown in the table
     * @type {string}
     */
    @Prop({
        default: TableAssetType.AccountRestrictions,
    })
    assetType: TableAssetType;

    @Prop({
        default: AccountRestrictionTxType.ADDRESS,
    })
    restrictionTxType: AccountRestrictionTxType;

    public isFetchingRestrictions: boolean;
    public accountAddressRestrictions;
    public accountMosaicRestrictions;
    public accountOperationRestrictions;
    public currentSignerAddress: Address;

    public get isLoading() {
        return this.isFetchingRestrictions;
    }

    public getService(): AssetTableService {
        let restrictions = this.accountAddressRestrictions;
        if (this.restrictionTxType === AccountRestrictionTxType.MOSAIC) {
            restrictions = this.accountMosaicRestrictions;
        } else if (this.restrictionTxType === AccountRestrictionTxType.TRANSACTION_TYPE) {
            restrictions = this.accountOperationRestrictions;
        }
        return new AccountRestrictionTableService(restrictions);
    }

    protected async doRefresh() {
        await this.$store.dispatch('restriction/LOAD_ACCOUNT_RESTRICTIONS');
    }

    public handleRemoveRestriction(restriction) {
        this.$emit('deleteRestriction', restriction);
    }

    @Watch('currentSignerAddress', { immediate: true })
    protected watchCurrentSigner() {
        this.doRefresh();
    }
}
