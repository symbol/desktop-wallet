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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Address } from 'symbol-sdk';

import { AddressBook } from 'symbol-address-book/AddressBook';
import { AccountModel } from '@/core/database/entities/AccountModel';

@Component({
    computed: {
        ...mapGetters({
            addressBook: 'addressBook/getAddressBook',
            knownAccounts: 'account/knownAccounts',
            currentAccount: 'account/currentAccount',
        }),
    },
    data: function () {
        return {
            autoCompletionGroups: [],
        };
    },
    watch: {
        value: {
            handler: function (val) {
                this.updateAutoCompletionGroups(val);
            },
        },
    },
})
export class AccountAutoCompleteInputTs extends Vue {
    @Prop({ default: null })
    value: string;

    @Prop({ default: false })
    readonly disabled!: boolean;

    @Prop({ default: '' })
    placeholder: string;

    @Prop({ default: undefined })
    autocompletePopupMaxWidthInRem: number;

    public get autoCompletePopupStyle(): string {
        return this.autocompletePopupMaxWidthInRem ? `max-width: ${this.autocompletePopupMaxWidthInRem}rem;` : '';
    }

    /**
     * Current address book
     * @var {AddressBook}
     */
    public addressBook: AddressBook;

    /**
     * Known accounts identifiers
     * @var {string[]}
     */
    public knownAccounts: AccountModel[];

    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    public currentAccount: AccountModel;

    public autoCompletionGroups: { title: string; items: { name: string; address: string }[] }[];

    /// region computed properties getter/setter
    public get rawValue(): string {
        return this.value;
    }

    public set rawValue(input: string) {
        this.$emit('input', input);
    }
    /// end-region computed properties getter/setter

    public mounted(): void {
        this.updateAutoCompletionGroups(this.rawValue);
    }

    public updateAutoCompletionGroups(recipientInput: string): void {
        this.autoCompletionGroups = [];

        const contacts = this.addressBook
            .getAllContacts()
            .filter(
                (contact) =>
                    contact.name.toLowerCase().includes(recipientInput) || contact.address.toLocaleLowerCase().includes(recipientInput),
            )
            .map((contact) => ({ name: contact.name, address: Address.createFromRawAddress(contact.address).pretty() }));

        if (contacts.length) {
            this.autoCompletionGroups.push({
                title: 'recipient_input_contacts',
                items: contacts,
            });
        }

        const accounts = this.knownAccounts
            .filter(
                (account) =>
                    this.currentAccount.id !== account.id &&
                    (account.name.toLowerCase().includes(recipientInput) || account.address.toLocaleLowerCase().includes(recipientInput)),
            )
            .map((account) => ({ name: account.name, address: Address.createFromRawAddress(account.address).pretty() }));

        if (accounts.length) {
            this.autoCompletionGroups.push({
                title: 'recipient_input_accounts',
                items: accounts,
            });
        }
    }
}
