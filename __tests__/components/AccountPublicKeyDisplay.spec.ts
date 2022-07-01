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
import AccountPublicKeyDisplay from '@/components/AccountPublicKeyDisplay/AccountPublicKeyDisplay.vue';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';

describe('components/AccountPublicKeyDisplay', () => {
    const accountModel = WalletsModel1;

    const getAccountPublicKeyDisplayWrapper = (accountModel?: AccountModel, publicKey?: string) => {
        const wrapper = getComponent(
            AccountPublicKeyDisplay,
            {},
            {},
            {
                account: accountModel,
                publicKey,
            },
        );
        return wrapper;
    };

    test('renders account public key with given account model', () => {
        // Arrange + Act:
        const wrapper = getAccountPublicKeyDisplayWrapper(accountModel);

        // Assert:
        expect(wrapper.find('div div').text()).toBe(accountModel.publicKey);
    });

    test('renders account public key with given public key', () => {
        // Arrange + Act:
        const publicKey = 'B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D';
        const wrapper = getAccountPublicKeyDisplayWrapper(undefined, publicKey);

        // Assert:
        expect(wrapper.find('div div').text()).toBe(publicKey);
    });
});
