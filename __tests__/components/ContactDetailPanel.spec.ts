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
import ContactDetailPanel from '@/components/ContactDetailPanel/ContactDetailPanel.vue';
import { ContactDetailPanelTs } from '@/components/ContactDetailPanel/ContactDetailPanelTs';
import { AddressBookState } from '@/store/AddressBook';
import { getComponent } from '@MOCKS/Components';
import { IContact } from 'symbol-address-book';

describe('components/ContactDetailPanel', () => {
    const dispatch = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    const contact1Address = 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI';
    const contact2Address = 'TD2KY5BKECF6YKSWSTGMUHFP66GG33S5MG6UOYQ';

    const contactList: IContact[] = [
        { id: '1', name: 'contact1Name', isBlackListed: false, address: contact1Address },
        { id: '2', name: 'contact2Name', isBlackListed: false, address: contact2Address },
    ];

    const addressBook = {
        getWhiteListedContacts: jest.fn(() => contactList),
    };
    const mockAddressBookStore = {
        namespaced: true,
        state: {
            addressBook: addressBook,
            selectedContact: contactList[0],
        },
        getters: {
            getAddressBook: (state: AddressBookState) => {
                return state.addressBook;
            },
            getSelectedContact: (state) => {
                return state.selectedContact;
            },
        },
        mutations: {
            setSelectedContact: (state: AddressBookState, selectedContact: IContact) => (state.selectedContact = selectedContact),
        },
    };

    const getContactDetailPanelWrapper = (stateChanges?: AddressBookState) => {
        // Arrange:
        const wrapper = getComponent(ContactDetailPanel, { addressBook: mockAddressBookStore }, stateChanges, {}, {}, dispatch);
        return wrapper;
    };

    test('renders contact detail panel', () => {
        // Arrange + Act:
        const wrapper = getContactDetailPanelWrapper();

        // Assert:
        expect(wrapper.find('div.account-detail-inner-container').exists()).toBe(true);
    });

    describe('save contact property', () => {
        const testSaveProperty = (property: string, value: string) => {
            // Arrange:
            const wrapper = getContactDetailPanelWrapper();
            const component = wrapper.vm as ContactDetailPanelTs;
            component.addressBook.getContactById = jest.fn(() => contactList[0]);
            const contact = { ...component.selectedContact };
            contact[property] = value;

            // Act:
            component.saveProperty(property)(value);

            // Assert:
            expect(dispatch).toHaveBeenCalledWith('addressBook/UPDATE_CONTACT', { id: component.selectedContact.id, contact });
        };

        [
            ['name', 'newName'],
            ['address', 'TDYEWBAMEW27OODEODPQ4OKYFEU6N24NC4O7KZA'],
            ['phone', '+1 (555) 555-5555'],
            ['email', 'some@example.com'],
            ['note', 'some notes'],
        ].forEach(([property, value]) => {
            test(`updates ${property}`, () => {
                testSaveProperty(property, value);
            });
        });

        test('contact already exists', () => {
            // Arrange:
            const newAddress = contactList[0].address;
            const wrapper = getContactDetailPanelWrapper();
            const component = wrapper.vm as ContactDetailPanelTs;
            component.addressBook.getContactById = jest.fn(() => contactList[0]);
            dispatch.mockImplementationOnce(() => {
                throw Error('Contact with provided address already exist');
            });

            // Act:
            component.saveProperty('address')(newAddress);

            // Assert:
            expect(dispatch).toHaveBeenCalledWith('notification/ADD_ERROR', component.$t('error_contact_already_exists'));
        });
    });

    test('removes contact', async () => {
        // Arrange:
        const wrapper = getContactDetailPanelWrapper();
        const component = wrapper.vm as ContactDetailPanelTs;

        // Act:
        component.showDeleteModal = true;
        component.removeContact();

        // Assert:
        expect(dispatch).toHaveBeenCalledWith('addressBook/REMOVE_CONTACT', component.selectedContact.id);
        expect(component.showDeleteConfirmModal).toBe(false);
    });

    const testToggleBlacklist = (isBlacklisted: boolean) => {
        // Arrange:
        const wrapper = getContactDetailPanelWrapper();
        const component = wrapper.vm as ContactDetailPanelTs;
        component.selectedContact.isBlackListed = isBlacklisted;

        // Act:
        component.toggleBlackListContact();

        // Assert:
        expect(component.selectedContact.isBlackListed).toBe(!isBlacklisted);
        expect(dispatch).toHaveBeenCalledWith('addressBook/UPDATE_CONTACT', {
            id: component.selectedContact.id,
            contact: component.selectedContact,
        });
        expect(component.showBlackWhiteListModal).toBe(false);
    };

    test('toggle blacklist contact when blacklisted', async () => {
        testToggleBlacklist(true);
    });

    test('toggle blacklist contact when whitelisted', async () => {
        testToggleBlacklist(false);
    });
});
