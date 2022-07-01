/*
 * (C) Symbol Contributors 2021
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
jest.mock('@/views/forms/FormAliasTransaction/FormAliasTransaction.vue');
jest.mock('@/views/forms/FormExtendNamespaceDurationTransaction/FormExtendNamespaceDurationTransaction.vue');
jest.mock('@/views/forms/FormMosaicSupplyChangeTransaction/FormMosaicSupplyChangeTransaction.vue');

import AccountRestrictionsList from '@/components/AccountRestrictionsList/AccountRestrictionsList.vue';
import { AccountRestrictionsListTs } from '@/components/AccountRestrictionsList/AccountRestrictionsListTs';
import { TableAssetType } from '@/components/TableDisplay/TableAssetType';
import { Signer } from '@/store/Account';
import Restriction, { RestrictionState } from '@/store/Restriction';
import { AccountRestrictionTxType } from '@/views/forms/FormAccountRestrictionTransaction/FormAccountRestrictionTransactionTs';
import { simpleWallet1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { Address, AddressRestrictionFlag } from 'symbol-sdk';

describe('components/AccountRestrictionsList', () => {
    const accountAddress = simpleWallet1.address;
    const accountSigner = {
        label: '',
        address: accountAddress,
        multisig: false,
        requiredCosigApproval: 0,
    } as Signer;
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentAccountSigner: accountSigner,
            currentSignerAddress: accountAddress,
        },
        getters: {
            currentSignerAddress: (state) => {
                return state.currentSignerAddress;
            },
            currentAccountSigner: (state) => {
                return state.currentAccountSigner;
            },
        },
    };

    const mockNetworkStore = {
        namespaced: true,
        state: {
            currentHeight: 0,
        },
        getters: {
            currentHeight: (state) => {
                return state.currentHeight;
            },
        },
    };

    const mockMosaicStore = {
        namespaced: true,
        state: {
            holdMosaics: [],
            isFetchingMosaics: false,
        },
        getters: {
            holdMosaics: (state) => {
                return state.holdMosaics;
            },
            isFetchingMosaics: (state) => {
                return state.isFetchingMosaics;
            },
        },
    };

    const getAccountRestrictionsListWrapper = (
        assetType?: TableAssetType,
        restrictionTxType?: AccountRestrictionTxType,
        stateChanges?: RestrictionState,
    ) => {
        // Arrange:
        const wrapper = getComponent(
            AccountRestrictionsList,
            { account: mockAccountStore, restriction: Restriction, network: mockNetworkStore, mosaic: mockMosaicStore },
            stateChanges,
            {
                assetType,
                restrictionTxType,
            },
        );
        return wrapper;
    };

    test('render account address restrictions', () => {
        const allowedIncomingAddress = Address.createFromRawAddress('TBCPGZ3S2SCC3YHBBTYDCUZV4ZZEPHM2KECZT7I');
        const stateChanges: Partial<RestrictionState> = {
            accountRestrictions: [
                {
                    restrictionFlags: AddressRestrictionFlag.AllowIncomingAddress,
                    values: [allowedIncomingAddress],
                },
            ],
        };
        const wrapper = getAccountRestrictionsListWrapper(
            TableAssetType.AccountRestrictions,
            AccountRestrictionTxType.ADDRESS,
            stateChanges as RestrictionState,
        );

        const component = wrapper.vm as AccountRestrictionsListTs;
        jest.spyOn(component, 'doRefresh').mockImplementation(async () => {
            console.debug('To be Continued ...');
        });
    });
});
