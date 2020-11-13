/*
 * Copyright 2020 NEM (https://nem.io)
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

import { AwaitLock } from './AwaitLock';
import { AddressBook, IContact } from 'symbol-address-book';
import Vue from 'vue';
import { AddressBookService } from '@/services/AddressBookService';
import { ProfileModel } from '@/core/database/entities/ProfileModel';

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

type AddressBookState = {
    initialized: boolean;
    addressBook: AddressBook;
    selectedContact: IContact;
};

const addressBookState: AddressBookState = {
    initialized: false,
    addressBook: null,
    selectedContact: null,
};

/**
 * AddressBook Store
 */
export default {
    namespaced: true,
    state: addressBookState,
    getters: {
        getInitialized: (state: AddressBookState) => state.initialized,
        getAddressBook: (state: AddressBookState) => state.addressBook,
        getSelectedContact: (state: AddressBookState): IContact => state.selectedContact,
    },
    mutations: {
        setInitialized: (state: AddressBookState, initialized: boolean) => {
            state.initialized = initialized;
        },
        setAddressBook: (state: AddressBookState, addressBook: AddressBook) => {
            // state.addressBook = addressBook;
            Vue.set(state, 'addressBook', addressBook);
        },
        setSelectedContact: (state: AddressBookState, selectedContact: IContact) => {
            Vue.set(state, 'selectedContact', selectedContact);
            // state.selectedContact = selectedContact;
        },
    },
    actions: {
        /**
         * Possible `options` values include:
         * @type {
         *    skipTransactions: boolean,
         * }
         */
        async initialize({ commit, getters }) {
            const callback = async () => {
                commit('setInitialized', true);
            };
            await Lock.initialize(callback, { getters });
        },
        async uninitialize({ commit, dispatch, getters }) {
            const callback = async () => {
                await dispatch('SAVE_ADDRESS_BOOK');
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },

        async SAVE_ADDRESS_BOOK({ getters, rootGetters }) {
            const currentProfile: ProfileModel = rootGetters['profile/currentProfile'];
            const addressBook: AddressBook = getters.getAddressBook;
            await new AddressBookService().saveAddressBook(addressBook, currentProfile.profileName);
        },

        async LOAD_ADDRESS_BOOK({ commit, rootGetters }) {
            const currentProfile: ProfileModel = rootGetters['profile/currentProfile'];
            const addressBook = await new AddressBookService().getAddressBook(currentProfile.profileName);
            commit('setAddressBook', addressBook);
            const allContacts = addressBook.getAllContacts();
            if (allContacts.length > 0) {
                commit('setSelectedContact', allContacts[0]);
            }
        },

        async ADD_CONTACT({ commit, dispatch, getters }, contact) {
            const addressBook: AddressBook = getters.getAddressBook;
            addressBook.addContact(contact);
            const newAddressBook = AddressBook.fromJSON(addressBook.toJSON());
            commit('setAddressBook', newAddressBook);
            const newSelectedContact = newAddressBook.getContactById(contact.id);
            commit('setSelectedContact', newSelectedContact);
            dispatch('SAVE_ADDRESS_BOOK');
        },

        async UPDATE_CONTACT({ dispatch, getters }, { id, contact }) {
            const addressBook: AddressBook = getters.getAddressBook;
            addressBook.updateContact(id, contact);
            dispatch('SAVE_ADDRESS_BOOK');
        },

        async REMOVE_CONTACT({ commit, dispatch, getters }, id) {
            const addressBook: AddressBook = getters.getAddressBook;
            addressBook.removeContact(id);
            const newAddressBook = AddressBook.fromJSON(addressBook.toJSON());
            commit('setAddressBook', newAddressBook);
            commit('setSelectedContact', null);
            dispatch('SAVE_ADDRESS_BOOK');
        },

        async RESOLVE_ADDRESS({ getters }, address) {
            const addressBook: AddressBook = getters.getAddressBook;
            return addressBook.getContactByAddress(address);
        },
    },
};
