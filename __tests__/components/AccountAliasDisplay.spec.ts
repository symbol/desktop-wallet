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
import AccountAliasDisplay from '@/components/AccountAliasDisplay/AccountAliasDisplay.vue';
import { AccountAliasDisplayTs } from '@/components/AccountAliasDisplay/AccountAliasDisplayTs';
import Account from '@/store/Account';
import { simpleWallet1, WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { AccountNames, NamespaceId, NamespaceName } from 'symbol-sdk';

describe('components/AccountAliasDisplay', () => {
    const accountModel = WalletsModel1;
    const accountAddress = simpleWallet1.address;
    const namespaceName = new NamespaceName(new NamespaceId('alias'), 'myAccountName');
    const accountAliases: AccountNames[] = [
        {
            address: accountAddress,
            names: [namespaceName],
        },
    ];
    const getAccountAliasDisplayValue = (currentAccountAliases: AccountNames[]) => {
        // Arrange:
        const wrapper = getComponent(
            AccountAliasDisplay,
            { account: Account },
            { currentAccountAliases },
            {
                account: accountModel,
            },
        );
        const component = wrapper.vm as AccountAliasDisplayTs;

        // Act:
        const actual = component.accountAliasNames;

        return actual;
    };

    test('return empty string given no account aliases', () => {
        // Arrange + Act:
        const actual = getAccountAliasDisplayValue([]);

        // Assert:
        expect(actual).toBeDefined();
        expect(actual.length).toBe(0);
    });

    test('return the given account alias', () => {
        // Arrange + Act:
        const actual = getAccountAliasDisplayValue(accountAliases);

        // Assert:
        expect(actual).toStrictEqual([namespaceName.name]);
    });
});
