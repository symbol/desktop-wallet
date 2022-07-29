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
import ContactSelector from '@/components/ContactSelector/ContactSelector.vue';
import { ContactSelectorTs } from '@/components/ContactSelector/ContactSelectorTs';
import { getComponent } from '@MOCKS/Components';

describe('components/ContactSelector', () => {
    const contactList = [
        { id: 1, name: 'contact1Name', isBlackListed: false },
        { id: 2, name: 'contact2Name', isBlackListed: false },
    ];
    const addressBook = {
        getWhiteListedContacts: jest.fn(() => contactList),
    };
    const mockAddressBookStore = {
        namespaced: true,
        state: {
            getAddressBook: addressBook,
        },
        getters: {
            getAddressBook: (state) => {
                return state.getAddressBook;
            },
        },
    };

    const getContactSelectorWrapper = () => {
        // Arrange:
        const wrapper = getComponent(ContactSelector, { addressBook: mockAddressBookStore }, {}, {});
        return wrapper;
    };

    test('renders contact selector', () => {
        // Arrange + Act:
        const wrapper = getContactSelectorWrapper();

        // Assert:
        const elements = wrapper.findAll('div.node-list-head');
        expect(elements.at(0).text()).toBe(contactList[0].name);
        expect(elements.at(1).text()).toBe(contactList[1].name);
    });

    test('contact is selected when the item is clicked on the list', async () => {
        // Arrange:
        const wrapper = getContactSelectorWrapper();
        const component = wrapper.vm as ContactSelectorTs;

        // Act:
        wrapper.find('ul li').trigger('click');
        await wrapper.vm.$nextTick();

        // Assert:
        expect(wrapper.emitted('change')[0][0]).toBe(contactList[0].id);
        // @ts-ignore - accessing private property
        expect(component.poptipVisible).toBe(false);
    });

    test('vue update is forced on poptip show', async () => {
        // Arrange:
        const wrapper = getContactSelectorWrapper();
        const component = wrapper.vm as ContactSelectorTs;
        component.$forceUpdate = jest.fn();

        // Act:
        component.onPopTipShow();
        await wrapper.vm.$nextTick();

        // Assert:
        expect(component.$forceUpdate).toHaveBeenCalled();
    });
});
