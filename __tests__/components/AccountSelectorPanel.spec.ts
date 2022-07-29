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
import AccountSelectorPanel from '@/components/AccountSelectorPanel/AccountSelectorPanel.vue';
import { AccountSelectorPanelTs } from '@/components/AccountSelectorPanel/AccountSelectorPanelTs';
import { AccountState } from '@/store/Account';
import { WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { mosaicsMock } from '@MOCKS/mosaics';
import _ from 'lodash';
import { MosaicId, NetworkType } from 'symbol-sdk';

describe('components/AccountSelectorPanel', () => {
    const account = WalletsModel1;
    const account2 = WalletsModel2;
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentAccount: undefined,
            knownAccounts: [],
        },
        getters: {
            currentAccount: (state) => {
                return state.currentAccount;
            },
            knownAccounts: (state) => {
                return state.knownAccounts;
            },
        },
    };

    const mockNetworkStore = {
        namespaced: true,
        state: {
            networkType: NetworkType.TEST_NET,
        },
        getters: {
            networkType: (state) => {
                return state.networkType;
            },
        },
    };

    const mockMosaicStore = {
        namespaced: true,
        state: {
            mosaics: mosaicsMock,
            networkMosaic: new MosaicId(mosaicsMock[0].mosaicIdHex),
        },
        getters: {
            mosaics: (state) => {
                return state.mosaics;
            },
            networkMosaic: (state) => {
                return state.networkMosaic;
            },
        },
    };

    const getAccountSelectorPanelWrapper = (stateChanges?: { [field: string]: any }) => {
        const wrapper = getComponent(
            AccountSelectorPanel,
            { account: mockAccountStore, network: mockNetworkStore, mosaic: mockMosaicStore },
            stateChanges,
            {},
        );
        return wrapper;
    };

    test('renders account selector panel', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);

        // Assert:
        expect(wrapper.find('div').exists()).toBeTruthy();
    });

    test('current account identifier is set when account is selected', async () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        const component = wrapper.vm as AccountSelectorPanelTs;
        wrapper.find('div.account-tile').trigger('click');
        await wrapper.vm.$nextTick();

        // Assert:
        expect(wrapper.find('span.mosaic_name').text()).toBe(account.name);
        expect(component.currentAccountIdentifier).toBe(account.id);
    });

    test('current account identifier is empty when current account is not set', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: undefined,
            knownAccounts: [],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        const component = wrapper.vm as AccountSelectorPanelTs;

        // Assert:
        expect(component.currentAccountIdentifier).toBe('');
    });

    test('current account identifier is empty given empty id param', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: undefined,
            knownAccounts: [],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        const component = wrapper.vm as AccountSelectorPanelTs;
        component.currentAccountIdentifier = null;

        // Assert:
        expect(component.currentAccountIdentifier).toBe('');
    });

    test('current account identifier is empty when account is not found in the account service', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: undefined,
            knownAccounts: [],
        } as Partial<AccountState>;
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        const component = wrapper.vm as AccountSelectorPanelTs;
        component.accountService.getAccount = jest.fn();

        // Act:
        component.currentAccountIdentifier = '123';

        // Assert:
        expect(component.currentAccountIdentifier).toBe('');
    });

    test('set current account event is dispatched when a different account is selected', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account, account2],
        } as Partial<AccountState>;
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        wrapper.vm.$store.dispatch = jest.fn();
        const component = wrapper.vm as AccountSelectorPanelTs;
        component.accountService.getAccount = jest.fn().mockReturnValue(account2);

        // Act:
        component.currentAccountIdentifier = account2.id;

        // Assert:
        expect(wrapper.emitted('input')[0][0]).toBe(account2.id);
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('account/SET_CURRENT_ACCOUNT', account2);
    });

    test('set current account event is not dispatched when the same account is selected', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account, account2],
        } as Partial<AccountState>;
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        wrapper.vm.$store.dispatch = jest.fn();
        const component = wrapper.vm as AccountSelectorPanelTs;
        component.accountService.getAccount = jest.fn().mockReturnValue(account);

        // Act:
        component.currentAccountIdentifier = account.id;

        // Assert:
        expect(wrapper.emitted('input')).not.toBeDefined();
        expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalledWith('account/SET_CURRENT_ACCOUNT', account2);
    });

    const testModal = (
        field: 'isAddingAccount' | 'isViewingExportModal',
        modalOpenField: 'hasAddAccountModal' | 'hasBackupProfileModal',
        value: boolean,
    ) => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account, account2],
        } as Partial<AccountState>;
        const wrapper = getAccountSelectorPanelWrapper(stateChanges);
        const component = wrapper.vm as AccountSelectorPanelTs;

        // Act:
        component[modalOpenField] = value;

        // Assert:
        expect(component[field]).toBe(value);
    };

    test('add account modal is to be opened', () => {
        testModal('isAddingAccount', 'hasAddAccountModal', true);
    });

    test('add account modal is to be closed', () => {
        testModal('isAddingAccount', 'hasAddAccountModal', false);
    });

    test('backup profile modal is to be opened', () => {
        testModal('isViewingExportModal', 'hasBackupProfileModal', true);
    });

    test('backup profile modal is to be closed', () => {
        testModal('isViewingExportModal', 'hasBackupProfileModal', false);
    });
});
