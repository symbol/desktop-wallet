/*
 * (C) Symbol Contributors 2022
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
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue';
import { RecipientInputTs } from '@/components/RecipientInput/RecipientInputTs';
import { getComponent } from '@MOCKS/Components';
import { AddressBook } from 'symbol-address-book/AddressBook';

describe('components/RecipientInput', () => {
    const addressBook = new AddressBook();

    addressBook.addContact({
        id: '',
        address: 'TDQG45HO3BTK22FJCDC6FOQTK3TWHJAFLXWLM4Q',
        name: 'Alice',
        phone: '+34 000000000',
        isBlackListed: false,
    });

    const getRecipientInputWrapper = (props = {}) => {
        const StubComponent = {
            template: '<div><slot /></div>',
        };

        const networkStore = {
            namespaced: true,
            state: { networkType: undefined },
            getters: {
                networkType: (state) => {
                    return state.networkType;
                },
            },
        };

        const addressBookStore = {
            namespaced: true,
            state: { addressBook },
            getters: {
                getAddressBook: (state) => {
                    return state.addressBook;
                },
            },
        };

        return getComponent(
            RecipientInput,
            {
                network: networkStore,
                addressBook: addressBookStore,
            },
            {},
            props,
            {
                ValidationProvider: StubComponent,
                ErrorTooltip: StubComponent,
            },
        );
    };

    test('renders value', () => {
        // Arrange + Act:
        const wrapper = getRecipientInputWrapper({
            value: 'TDQG45HO3BTK22FJCDC6FOQTK3TWHJAFLXWLM4Q',
        });

        const input = wrapper.find('input').element as HTMLInputElement;

        // Assert:
        expect(input.value).toBe('TDQG45HO3BTK22FJCDC6FOQTK3TWHJAFLXWLM4Q');
    });

    describe('onSelectContact', () => {
        const runBasicOnSelectContactTests = (contractId, expectedResult) => {
            // Arrange:
            const wrapper = getRecipientInputWrapper({
                value: '',
            });

            const vm = wrapper.vm as RecipientInputTs;

            // Act:
            vm.onSelectContact(contractId);

            // Assert:
            expect(wrapper.emitted('input')).toEqual(expectedResult);
        };

        test('emits address value when contact exists', () => {
            runBasicOnSelectContactTests(addressBook.getAllContacts()[0].id, [['TDQG45HO3BTK22FJCDC6FOQTK3TWHJAFLXWLM4Q']]);
        });

        test('skips emit when contact does not exist', () => {
            runBasicOnSelectContactTests('invalid-contact-id', undefined);
        });
    });
});
