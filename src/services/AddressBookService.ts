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

import { AddressBookModelStorage } from '@/core/database/storage/AddressBookModelStorage';
import { AddressBook } from 'symbol-address-book/AddressBook';

export class AddressBookService {
    /**
     * The namespace information local cache.
     */
    private readonly addressBookModelStorage = AddressBookModelStorage.INSTANCE;

    public getAddressBook(profileName: string): AddressBook {
        try {
            const allAddressBooks = this.addressBookModelStorage.get() || {};
            return AddressBook.fromJSON(allAddressBooks[profileName]);
        } catch (e) {
            return new AddressBook();
        }
    }

    public saveAddressBook(addressBook: AddressBook, profileName: string): void {
        const allAddressBooks = this.addressBookModelStorage.get() || {};
        allAddressBooks[profileName] = addressBook.toJSON(false);
        this.addressBookModelStorage.set(allAddressBooks);
    }

    public deleteAddressBook(profileName: string): void {
        const allAddressBooks = this.addressBookModelStorage.get();
        if (!allAddressBooks) {
            return;
        }
        delete allAddressBooks[profileName];
        this.addressBookModelStorage.set(allAddressBooks);
    }
}
