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
// internal dependencies
// @ts-ignore
import AccountSignerSelector from '@/components/AccountSignerSelector/AccountSignerSelector.vue';
import { AccountSignerSelectorTs } from '@/components/AccountSignerSelector/AccountSignerSelectorTs';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { AccountService } from '@/services/AccountService';
import { AccountState } from '@/store/Account';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';

describe('components/AccountSignerSelector', () => {
    const account = WalletsModel1;
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

    const getAccountSignerSelectorWrapper = (
        account: AccountModel,
        stateChanges?: AccountState,
        label?: string,
        noLabel?: boolean,
        disabled?: boolean,
    ) => {
        const wrapper = getComponent(AccountSignerSelector, { account: mockAccountStore }, stateChanges, {
            account,
            label,
            noLabel,
            disabled,
        });
        return wrapper;
    };

    test('renders account signer selector', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState);
        const component = wrapper.vm as AccountSignerSelectorTs;

        // Assert:
        expect(component.label).toBe('sender');
        expect(wrapper.find('select option').exists()).toBeTruthy();
        expect(wrapper.find('select option').text()).toBe(
            `${account.name} - ${account.address.slice(0, 5)}...${account.address.slice(34)}`,
        );
    });

    test('renders account signer selector with no label', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, true);
        const component = wrapper.vm as AccountSignerSelectorTs;

        // Assert:
        expect(component.noLabel).toBeTruthy();
        expect(wrapper.find('div.label').exists()).toBeFalsy();
        expect(wrapper.find('select option').exists()).toBeTruthy();
    });

    test('renders account signer selector disabled', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, false, true);
        const component = wrapper.vm as AccountSignerSelectorTs;

        // Assert:
        expect(component.disabled).toBeTruthy();
        expect(wrapper.find('div.label').exists()).toBeTruthy();
        expect(wrapper.find('select option').exists()).toBeTruthy();
        expect(wrapper.find('select').attributes('disabled')).toBeTruthy();
    });

    test('handles current account change when id is null', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, false, true);
        const component = wrapper.vm as AccountSignerSelectorTs;
        component.onChangeCurrentAccount(null);

        // Assert:
        expect(component.$store.dispatch).not.toHaveBeenCalled();
    });

    test('handles current account change when id not found in the local storage', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, false, true);
        const component = wrapper.vm as AccountSignerSelectorTs;
        component.onChangeCurrentAccount('some_fake_id');

        // Assert:
        expect(component.$store.dispatch).not.toHaveBeenCalled();
    });

    test('handles current account change when the same account is selected', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;

        jest.spyOn(AccountService.prototype, 'getAccount').mockImplementation(() => {
            return account;
        });

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, false, true);
        const component = wrapper.vm as AccountSignerSelectorTs;
        component.onChangeCurrentAccount(account.id);

        // Assert:
        expect(component.$store.dispatch).not.toHaveBeenCalled();
    });

    test('handles current account change when id found in the local storage', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account],
        } as Partial<AccountState>;
        const mockAccount = ({ id: 'someOtherId' } as unknown) as AccountModel;

        jest.spyOn(AccountService.prototype, 'getAccount').mockImplementation(() => {
            return mockAccount;
        });

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, false, true);
        const component = wrapper.vm as AccountSignerSelectorTs;
        component.onChangeCurrentAccount(mockAccount.id);

        // Assert:
        expect(component.$store.dispatch).toHaveBeenCalledWith('account/SET_CURRENT_ACCOUNT', mockAccount);
    });

    test('current account change event is dispatched when another account is selected', () => {
        // Arrange:
        const secondAccount = ({
            id: 'someOtherId',
            name: 'secondAccount',
            address: 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI',
        } as unknown) as AccountModel;
        const stateChanges = {
            currentAccount: account,
            knownAccounts: [account, secondAccount],
        } as Partial<AccountState>;

        jest.spyOn(AccountService.prototype, 'getAccount').mockImplementation(() => {
            return secondAccount;
        });

        // Act:
        const wrapper = getAccountSignerSelectorWrapper(account, stateChanges as AccountState, undefined, false, true);
        const component = wrapper.vm as AccountSignerSelectorTs;
        component.chosenAccount = secondAccount.id;

        // Assert:
        expect(component.$store.dispatch).toHaveBeenCalledWith('account/SET_CURRENT_ACCOUNT', secondAccount);
    });
});
