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
import ContactSelectorPanel from '@/components/ContactSelectorPanel/ContactSelectorPanel.vue';
import { ContactSelectorPanelTs } from '@/components/ContactSelectorPanel/ContactSelectorPanelTs';
import { UIHelpers } from '@/core/utils/UIHelpers';
import { AddressBookState } from '@/store/AddressBook';
import { getComponent } from '@MOCKS/Components';
import { AddressBook, IContact } from 'symbol-address-book';

describe('components/ContactSelectorPanel', () => {
    const dispatch = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    const contact1Name = 'contact1Name';
    const contact2Name = 'contact2Name';
    const contact3Name = 'contact3Name';
    const contact4Name = 'contact4Name';

    const contact1Address = 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI';
    const contact2Address = 'TD2KY5BKECF6YKSWSTGMUHFP66GG33S5MG6UOYQ';
    const contact3Address = 'TDYEWBAMEW27OODEODPQ4OKYFEU6N24NC4O7KZA';
    const contact4Address = 'TCZCGIGFXU5LW7BCUQCXVVYS6JJDHJWONYVVGXY';

    const whiteListedContacts: IContact[] = [
        { id: '1', name: contact1Name, isBlackListed: false, address: contact1Address },
        { id: '2', name: contact2Name, isBlackListed: false, address: contact2Address },
    ];

    const blackListedContacts: IContact[] = [
        { id: '3', name: contact3Name, isBlackListed: true, address: contact3Address },
        { id: '4', name: contact4Name, isBlackListed: true, address: contact4Address },
    ];

    const addressBook = new AddressBook([...whiteListedContacts, ...blackListedContacts]);

    const mockAddressBookStore = {
        namespaced: true,
        state: {
            addressBook: addressBook,
            selectedContact: whiteListedContacts[0],
            isBlackListedSelected: false,
        },
        getters: {
            getAddressBook: (state: AddressBookState) => {
                return state.addressBook;
            },
            getSelectedContact: (state) => {
                return state.selectedContact;
            },
            getBlackListedContactsSelected: (state) => state.isBlackListedSelected,
        },
        mutations: {
            setSelectedContact: (state: AddressBookState, selectedContact: IContact) => (state.selectedContact = selectedContact),
        },
    };

    const getContactSelectorPanelWrapper = (stateChanges?: AddressBookState) => {
        // Arrange:
        const wrapper = getComponent(ContactSelectorPanel, { addressBook: mockAddressBookStore }, stateChanges, {}, {}, dispatch);
        return wrapper;
    };

    test('renders contact selector panel', () => {
        // Arrange + Act:
        const wrapper = getContactSelectorPanelWrapper();

        // Assert:
        expect(wrapper.find('div.account-selector-panel').exists()).toBe(true);
    });

    test('only whitelisted contacts are listed', () => {
        // Arrange + Act:
        const wrapper = getContactSelectorPanelWrapper();
        const elements = wrapper.findAll('span.contact-info');

        // Assert:
        expect(elements.length).toBe(2);
        expect(elements.at(0).findAll('p').at(0).text()).toBe(contact1Name);
        expect(elements.at(0).findAll('p').at(1).text()).toBe(contact1Address);
        expect(elements.at(1).findAll('p').at(0).text()).toBe(contact2Name);
        expect(elements.at(1).findAll('p').at(1).text()).toBe(contact2Address);
    });

    test('only blacklisted contacts are listed', async () => {
        // Arrange + Act:
        const wrapper = getContactSelectorPanelWrapper();
        const component = wrapper.vm as ContactSelectorPanelTs;
        // select blacklisted contacts tab
        component.activePanel = 1;
        await wrapper.vm.$nextTick();
        const elements = wrapper.findAll('span.contact-info');

        // Assert:
        expect(elements.length).toBe(2);
        expect(elements.at(0).findAll('p').at(0).text()).toBe(contact3Name);
        expect(elements.at(0).findAll('p').at(1).text()).toBe(contact3Address);
        expect(elements.at(1).findAll('p').at(0).text()).toBe(contact4Name);
        expect(elements.at(1).findAll('p').at(1).text()).toBe(contact4Address);
    });

    test('changes to whitelisted tab onclick when blacklisted tab is active', async () => {
        // Arrange:
        const wrapper = getContactSelectorPanelWrapper();
        const component = wrapper.vm as ContactSelectorPanelTs;
        // select blacklisted contacts tab
        component.activePanel = 1;
        await wrapper.vm.$nextTick();
        let elements = wrapper.findAll('span.contact-info');

        expect(elements.length).toBe(2);
        expect(elements.at(0).findAll('p').at(0).text()).toBe(contact3Name);
        expect(elements.at(0).findAll('p').at(1).text()).toBe(contact3Address);
        expect(elements.at(1).findAll('p').at(0).text()).toBe(contact4Name);
        expect(elements.at(1).findAll('p').at(1).text()).toBe(contact4Address);

        // Act:
        // select whitelisted contacts tab
        component.activePanel = 0;
        await wrapper.vm.$nextTick();
        elements = wrapper.findAll('span.contact-info');

        // Assert:
        expect(elements.length).toBe(2);
        expect(elements.at(0).findAll('p').at(0).text()).toBe(contact1Name);
        expect(elements.at(0).findAll('p').at(1).text()).toBe(contact1Address);
        expect(elements.at(1).findAll('p').at(0).text()).toBe(contact2Name);
        expect(elements.at(1).findAll('p').at(1).text()).toBe(contact2Address);
    });

    test('selected contact event is fired on select', async () => {
        // Arrange:
        const stateChanges = { selectedContact: whiteListedContacts[0] };
        const wrapper = getContactSelectorPanelWrapper(stateChanges as AddressBookState);
        const component = wrapper.vm as ContactSelectorPanelTs;
        component.$store.commit = jest.fn();
        expect(component.selectedContactId).toBe(whiteListedContacts[0].id);

        // Act:
        component.selectedContactId = whiteListedContacts[1].id;

        // Assert:
        expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('addressBook/setSelectedContact', whiteListedContacts[1]);
    });

    test('blacklisted tab is selected', async () => {
        // Arrange:
        const stateChanges = { isBlackListedSelected: true };
        const wrapper = getContactSelectorPanelWrapper(stateChanges as AddressBookState);
        const component = wrapper.vm as ContactSelectorPanelTs;

        // Act:
        expect(component.activeIndex).toBe(1);
    });

    test('active contact is the selected one', async () => {
        // Arrange:
        const stateChanges = { selectedContact: whiteListedContacts[0] };
        const wrapper = getContactSelectorPanelWrapper(stateChanges as AddressBookState);
        const component = wrapper.vm as ContactSelectorPanelTs;

        // Act:
        expect(component.isActiveContact(whiteListedContacts[0])).toBe(true);
    });

    test('active contact is different than the selected one', async () => {
        // Arrange:
        const stateChanges = { selectedContact: whiteListedContacts[1] };
        const wrapper = getContactSelectorPanelWrapper(stateChanges as AddressBookState);
        const component = wrapper.vm as ContactSelectorPanelTs;

        // Act:
        expect(component.isActiveContact(whiteListedContacts[0])).toBe(false);
    });

    test('isActiveContact returns false when no contact is selected', async () => {
        // Arrange:
        const stateChanges = { selectedContact: undefined };
        const wrapper = getContactSelectorPanelWrapper(stateChanges as AddressBookState);
        const component = wrapper.vm as ContactSelectorPanelTs;

        // Act + Assert:
        expect(component.isActiveContact(whiteListedContacts[0])).toBe(false);
    });

    test('download address book', async () => {
        // Arrange:
        const wrapper = getContactSelectorPanelWrapper();
        const component = wrapper.vm as ContactSelectorPanelTs;
        jest.spyOn(UIHelpers, 'downloadBytesAsFile').mockImplementationOnce(() => Promise.resolve(true));

        // Act:
        component.downloadAddressBook();

        // Assert:
        expect(UIHelpers.downloadBytesAsFile).toHaveBeenCalledWith(addressBook.toJSON(), 'address-book.json', 'application/json');
    });
});
