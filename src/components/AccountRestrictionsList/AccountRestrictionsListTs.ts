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
import {Component} from 'vue-property-decorator';
import {AccountRestriction, Address, AddressRestrictionFlag} from 'symbol-sdk';
// internal dependencies
import {AssetTableService,} from '@/services/AssetTableService/AssetTableService';
// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue';
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd';
// @ts-ignore
import ModalFormWrap from '@/views/modals/ModalFormWrap/ModalFormWrap.vue';
// @ts-ignore
import FormAliasTransaction from '@/views/forms/FormAliasTransaction/FormAliasTransaction.vue';
// @ts-ignore
import FormExtendNamespaceDurationTransaction
    from '@/views/forms/FormExtendNamespaceDurationTransaction/FormExtendNamespaceDurationTransaction.vue';
// @ts-ignore
import FormMosaicSupplyChangeTransaction
    from '@/views/forms/FormMosaicSupplyChangeTransaction/FormMosaicSupplyChangeTransaction.vue';
// @ts-ignore
import ModalMetadataDisplay from '@/views/modals/ModalMetadataDisplay/ModalMetadataDisplay.vue';
// @ts-ignore
import SignerFilter from '@/components/SignerFilter/SignerFilter.vue';
// @ts-ignore
import ModalMetadataUpdate from '@/views/modals/ModalMetadataUpdate/ModalMetadataUpdate.vue';
// @ts-ignore
import {TableDisplayTs} from "@/components/TableDisplay/TableDisplayTs";
// @ts-ignore
import {TableAssetType} from "@/components/TableDisplay/TableAssetType";
// @ts-ignore
import {AccountRestrictionTableService} from "@/services/AssetTableService/AccountRestrictionTableService";

export type AccountRestrictionTableField = {
    label: string,
    name: string,
    type: 'text' | 'check' | 'icon'
}

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
    }
})
export class AccountRestrictionsListTs extends TableDisplayTs {
    assetType = TableAssetType.AccountRestrictions;

    public isFetchingRestrictions:boolean = false;

    public get isLoading() {
        return this.isFetchingRestrictions;
    }

    public getService(): AssetTableService {
        //TODO: Fetch from store and service
        const dummyRestrictions = [
            new AccountRestriction(AddressRestrictionFlag.AllowOutgoingAddress, [Address.createFromRawAddress('TBVNFB2OPA6Q3QZJI5S3LEVVO22SECIVNKCLCWQ')]),
            new AccountRestriction(AddressRestrictionFlag.BlockOutgoingAddress, [Address.createFromRawAddress('TBVNFB2OPA6Q3QZJI5S3LEVVO22SECIVNKCLCWQ')]),
            new AccountRestriction(AddressRestrictionFlag.AllowIncomingAddress, [Address.createFromRawAddress('TBVNFB2OPA6Q3QZJI5S3LEVVO22SECIVNKCLCWQ')]),
            new AccountRestriction(AddressRestrictionFlag.BlockIncomingAddress, [Address.createFromRawAddress('TBVNFB2OPA6Q3QZJI5S3LEVVO22SECIVNKCLCWQ')]),
            new AccountRestriction(AddressRestrictionFlag.AllowOutgoingAddress, [Address.createFromRawAddress('TBVNFB2OPA6Q3QZJI5S3LEVVO22SECIVNKCLCWQ')]),
        ]

        return new AccountRestrictionTableService(dummyRestrictions);
    }

    public handleRemoveRestriction(restriction) {
        console.log('Remove restriction:');
        console.log(restriction);
    }

}
