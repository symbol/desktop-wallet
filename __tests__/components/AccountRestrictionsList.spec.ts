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
import i18n from '@/language/index';
import { Signer } from '@/store/Account';
import { RestrictionState } from '@/store/Restriction';
import { AccountRestrictionTxType } from '@/views/forms/FormAccountRestrictionTransaction/FormAccountRestrictionTransactionTs';
import { simpleWallet1 } from '@MOCKS/Accounts';
import { createLocalVue, mount, MountOptions } from '@vue/test-utils';
import { Address, AddressRestrictionFlag, MosaicId, MosaicRestrictionFlag, OperationRestrictionFlag, TransactionType } from 'symbol-sdk';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

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

    const mockRestrictionStore = {
        namespaced: true,
        state: {
            accountRestrictions: [],
            isFetchingRestrictions: false,
        },
        getters: {
            accountAddressRestrictions: (state: RestrictionState) =>
                state.accountRestrictions.filter((r) => r.values && r.values[0] instanceof Address),
            accountMosaicRestrictions: (state) => state.accountRestrictions.filter((r) => r.values && r.values[0] instanceof MosaicId),
            accountOperationRestrictions: (state) =>
                state.accountRestrictions.filter(
                    (r) => r.values && !(r.values[0] instanceof Address) && !(r.values[0] instanceof MosaicId),
                ),
            isFetchingRestrictions: (state) => state.isFetchingRestrictions,
        },
    };

    const getAccountRestrictionsListWrapper = (
        assetType?: TableAssetType,
        restrictionTxType?: AccountRestrictionTxType,
        stateChanges?: RestrictionState,
        dispatch?: () => any,
    ) => {
        const localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(VueI18n);

        const effectiveMockRestrictionStore = { ...mockRestrictionStore };
        effectiveMockRestrictionStore.state = { ...mockRestrictionStore.state, ...stateChanges };

        const store = new Vuex.Store({
            modules: {
                account: mockAccountStore,
                restriction: effectiveMockRestrictionStore,
                network: mockNetworkStore,
                mosaic: mockMosaicStore,
            },
        });
        if (dispatch) {
            store.dispatch = dispatch;
        }
        const options: MountOptions<Vue> = {
            localVue,
            i18n,
            store,
            propsData: {
                assetType,
                restrictionTxType,
            },
        };
        const wrapper = mount(AccountRestrictionsList, options);
        return wrapper;
    };

    test('render account address restrictions', () => {
        // Arrange:
        const allowedIncomingAddress = Address.createFromRawAddress('TBCPGZ3S2SCC3YHBBTYDCUZV4ZZEPHM2KECZT7I');
        const stateChanges: Partial<RestrictionState> = {
            accountRestrictions: [
                {
                    restrictionFlags: AddressRestrictionFlag.AllowIncomingAddress,
                    values: [allowedIncomingAddress],
                },
            ],
        };
        const dispatch = jest.fn();

        // Act:
        const wrapper = getAccountRestrictionsListWrapper(
            TableAssetType.AccountRestrictions,
            AccountRestrictionTxType.ADDRESS,
            stateChanges as RestrictionState,
            dispatch,
        );
        const component = wrapper.vm as AccountRestrictionsListTs;

        // Assert:
        expect(dispatch).toHaveBeenCalledWith('restriction/LOAD_ACCOUNT_RESTRICTIONS');
        expect(component.displayedValues.length).toBe(1);
        expect(component.displayedValues[0].value).toBe(allowedIncomingAddress.plain());
    });

    test('render account mosaic restrictions', () => {
        // Arrange:
        const allowedMosaicId = new MosaicId('85BBEA6CC462B244');
        const stateChanges: Partial<RestrictionState> = {
            accountRestrictions: [
                {
                    restrictionFlags: MosaicRestrictionFlag.AllowMosaic,
                    values: [allowedMosaicId],
                },
            ],
        };
        const dispatch = jest.fn();

        // Act:
        const wrapper = getAccountRestrictionsListWrapper(
            TableAssetType.AccountRestrictions,
            AccountRestrictionTxType.MOSAIC,
            stateChanges as RestrictionState,
            dispatch,
        );

        const component = wrapper.vm as AccountRestrictionsListTs;

        // Assert:
        expect(dispatch).toHaveBeenCalledWith('restriction/LOAD_ACCOUNT_RESTRICTIONS');
        expect(component.displayedValues.length).toBe(1);
        expect(component.displayedValues[0].value).toBe(allowedMosaicId.toHex());
    });

    test('render account operation restrictions', () => {
        // Arrange:
        const blockedTransactionType = TransactionType.TRANSFER;
        const stateChanges: Partial<RestrictionState> = {
            accountRestrictions: [
                {
                    restrictionFlags: OperationRestrictionFlag.BlockOutgoingTransactionType,
                    values: [blockedTransactionType],
                },
            ],
        };
        const dispatch = jest.fn();

        // Act:
        const wrapper = getAccountRestrictionsListWrapper(
            TableAssetType.AccountRestrictions,
            AccountRestrictionTxType.TRANSACTION_TYPE,
            stateChanges as RestrictionState,
            dispatch,
        );

        const component = wrapper.vm as AccountRestrictionsListTs;

        // Assert:
        expect(dispatch).toHaveBeenCalledWith('restriction/LOAD_ACCOUNT_RESTRICTIONS');
        expect(component.displayedValues.length).toBe(1);
        expect(component.displayedValues[0].value).toBe(i18n.t(`transaction_descriptor_${blockedTransactionType.toString()}`));
    });

    test('handle remove restriction', () => {
        // Arrange:
        const blockedTransactionType = TransactionType.TRANSFER;
        const stateChanges: Partial<RestrictionState> = {
            accountRestrictions: [
                {
                    restrictionFlags: OperationRestrictionFlag.BlockOutgoingTransactionType,
                    values: [blockedTransactionType],
                },
            ],
        };

        // Act:
        const wrapper = getAccountRestrictionsListWrapper(
            TableAssetType.AccountRestrictions,
            AccountRestrictionTxType.TRANSACTION_TYPE,
            stateChanges as RestrictionState,
        );

        const component = wrapper.vm as AccountRestrictionsListTs;
        component.handleRemoveRestriction(stateChanges.accountRestrictions[0]);

        // Assert:
        expect(wrapper.emitted('deleteRestriction')[0][0]).toStrictEqual(stateChanges.accountRestrictions[0]);
    });
});
