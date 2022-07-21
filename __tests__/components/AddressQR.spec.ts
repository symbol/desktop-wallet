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
import AddressQR from '@/components/AddressQR/AddressQR.vue';
import { AddressQRTs } from '@/components/AddressQR/AddressQRTs';
import { simpleWallet1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { IContact } from 'symbol-address-book';
import { AddressQR as AddressQRObject } from 'symbol-qr-library';

beforeEach(() => {
    // override the default implementation as it returns observable and causes a jsdom error
    // @ts-ignore
    jest.spyOn(AddressQRObject.prototype, 'toString').mockImplementation(() => '');
});

describe('components/AddressQR', () => {
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

    const getAddressQRWrapper = (contact?: IContact) => {
        const wrapper = getComponent(
            AddressQR,
            { network: mockNetworkStore },
            { generationHash },
            {
                contact,
            },
        );
        return wrapper;
    };

    test('returns null when given no contact', () => {
        // Arrange + Act:
        const wrapper = getAddressQRWrapper();
        const component = wrapper.vm as AddressQRTs;
        const actual = component.qrCodeArgs;

        // Assert:
        expect(actual).toBeNull();
        expect(component.downloadName).toBe('');
    });

    test('returns AddressQR details when given contact', () => {
        // Arrange:
        const contact: IContact = {
            id: '1',
            name: 'myContactName',
            address: accountAddress.plain(),
        };

        // Act:
        const wrapper = getAddressQRWrapper(contact);
        const component = wrapper.vm as AddressQRTs;
        const actual = component.qrCodeArgs;

        // Assert:
        expect(actual).toBeDefined();
        expect(actual.name).toBe(contact.name);
        expect(actual.accountAddress).toBe(contact.address);
        expect(actual.networkType).toBe(accountAddress.networkType);
        expect(actual.generationHash).toBe(generationHash);
        expect(component.downloadName).toBe(`contact-qr-${contact.name}.png`);
    });
});
