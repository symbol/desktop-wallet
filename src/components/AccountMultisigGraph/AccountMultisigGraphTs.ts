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
import { Component, Prop, Vue } from 'vue-property-decorator';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { mapGetters } from 'vuex';
import { Address, MultisigAccountInfo } from 'symbol-sdk';

@Component({
    computed: {
        ...mapGetters({
            multisigAccountGraphInfo: 'account/multisigAccountGraph',
            knownAccounts: 'account/knownAccounts',
        }),
    },
})
export class AccountMultisigGraphTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;

    @Prop({
        default: null,
    })
    visible: boolean;
    public multisigAccountGraphInfo: MultisigAccountInfo[][];
    public knownAccounts: AccountModel[];

    get multisigGraphTree(): any[] {
        if (this.multisigAccountGraphInfo) {
            const tree = [];
            this.multisigAccountGraphInfo.map((level: MultisigAccountInfo[]) => {
                level.map((entry: MultisigAccountInfo) => {
                    const selected = this.account.address === entry.accountAddress.plain();
                    if (!entry.cosignatoryAddresses.length) {
                        tree.push({
                            address: entry.accountAddress.plain(),
                            title: this.getAccountLabel(entry.accountAddress, this.knownAccounts),
                            children: [],
                            selected,
                        });
                    } else {
                        // find the entry matching with address matching cosignatory address and update his children
                        const updateRecursively = (address, object) => (obj) => {
                            if (obj.address === address) {
                                obj.children.push(object);
                            } else if (obj.children) {
                                obj.children.forEach(updateRecursively(address, object));
                            }
                        };
                        // @ts-ignore
                        entry.cosignatoryAddresses.forEach((addressVal) => {
                            tree.forEach(
                                updateRecursively(addressVal['address'], {
                                    // @ts-ignore
                                    address: entry.accountAddress.plain(),
                                    // @ts-ignore
                                    title: this.getAccountLabel(entry.accountAddress, this.knownAccounts),
                                    children: [],
                                    selected,
                                }),
                            );
                        });
                    }
                });
            });
            return tree;
        }
        return [];
    }

    getAccountLabel(address: Address, accounts: AccountModel[]): string {
        const account = accounts.find((wlt) => address.plain() === wlt.address);
        return (account && account.name) || address.plain();
    }
}
