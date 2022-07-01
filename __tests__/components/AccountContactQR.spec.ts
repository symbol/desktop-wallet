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
import AccountContactQR from '@/components/AccountContactQR/AccountContactQR.vue';
import { AccountContactQRTs } from '@/components/AccountContactQR/AccountContactQRTs';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { simpleWallet1, WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { ContactQR } from 'symbol-qr-library';

beforeEach(() => {
    // override the default implementation as it returns observable and causes a jsdom error
    // @ts-ignore
    jest.spyOn(ContactQR.prototype, 'toString').mockImplementation(() => '');
});

describe('components/AccountContactQR', () => {
    const accountModel = WalletsModel1;
    const accountAddress = simpleWallet1.address;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    const mockNetworkStore = {
        namespaced: true,
        state: { generationHash },
        getters: {
            generationHash: (state) => {
                return state.generationHash;
            },
        },
    };

    const getAccountContactQRValue = (accountModel?: AccountModel) => {
        // Arrange:
        const wrapper = getComponent(
            AccountContactQR,
            { network: mockNetworkStore },
            { generationHash },
            {
                account: accountModel,
            },
        );
        const component = wrapper.vm as AccountContactQRTs;

        // Act:
        const actual = component.qrCodeArgs;

        return actual;
    };

    test('returns null when given no account model', () => {
        // Arrange + Act:
        const actual = getAccountContactQRValue();

        // Assert:
        expect(actual).toBeNull();
    });

    test('returns ContactQR details when given account model', () => {
        // Arrange + Act:
        const actual = getAccountContactQRValue(accountModel);

        // Assert:
        expect(actual).toBeDefined();
        expect(actual.name).toBe(accountModel.name);
        expect(actual.accountPublicKey).toBe(accountModel.publicKey);
        expect(actual.networkType).toBe(accountAddress.networkType);
        expect(actual.generationHash).toBe(generationHash);
    });
});
