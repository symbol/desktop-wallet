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
import AccountNameDisplay from '@/components/AccountNameDisplay/AccountNameDisplay.vue';
import { AccountNameDisplayTs } from '@/components/AccountNameDisplay/AccountNameDisplayTs';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';

describe('components/AccountNameDisplay', () => {
    const accountModel = WalletsModel1;

    const getAccountNameDisplayWrapper = (accountModel?: AccountModel, editable?: boolean) => {
        const wrapper = getComponent(
            AccountNameDisplay,
            {},
            {},
            {
                account: accountModel,
                editable,
            },
        );
        return wrapper;
    };

    test('renders account name', () => {
        // Arrange + Act:
        const wrapper = getAccountNameDisplayWrapper(accountModel, false);

        // Assert:
        expect(wrapper.find('span').text()).toBe(accountModel.name);
    });

    test('edit account name', () => {
        // Arrange + Act:
        const wrapper = getAccountNameDisplayWrapper(accountModel, true);
        const component = wrapper.vm as AccountNameDisplayTs;
        wrapper.find('button').trigger('click');

        // Assert:
        expect(component.isEditingName).toBeTruthy();
    });
});
