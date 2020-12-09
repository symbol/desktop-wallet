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
import { MultisigAccountInfo } from 'symbol-sdk';

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
    public multisigAccountGraphInfo: Map<number, MultisigAccountInfo[]>;
    public knownAccounts: AccountModel[];

    get multisigGraphTree(): any[] {
        if (this.multisigAccountGraphInfo) {
            return this.getMultisigDisplayGraph(this.multisigAccountGraphInfo);
        }
        return [];
    }

    public getMultisigDisplayGraph(multisigEntries: Map<number, MultisigAccountInfo[]>): any[] {
        const firstLevelNumber = [...multisigEntries.keys()].sort()[0];
        const firstLevel = multisigEntries.get(firstLevelNumber);
        const graph = [];
        for (const entry of firstLevel) {
            graph.push({
                info: entry,
                address: entry.accountAddress.plain(),
                title: this.getAccountLabel(entry, this.knownAccounts),
                children: [this.getMultisigDisplayGraphChildren(firstLevelNumber + 1, entry, multisigEntries)],
                selected: this.account.address === entry.accountAddress.plain(),
            });
        }
        return graph[0].children;
    }

    private getMultisigDisplayGraphChildren(
        level: number,
        info: MultisigAccountInfo,
        multisigEntries: Map<number, MultisigAccountInfo[]>,
    ): any {
        const entries = multisigEntries.get(level);
        if (!entries) {
            return {
                info: info,
                address: info.accountAddress.plain(),
                title: this.getAccountLabel(info, this.knownAccounts),
                children: [],
                selected: this.account.address === info.accountAddress.plain(),
            };
        }
        const children = [];
        for (const entry of entries) {
            const isFromParent = entry.multisigAddresses.find((address) => address.plain() === info.accountAddress.plain());
            if (isFromParent) {
                children.push(this.getMultisigDisplayGraphChildren(level + 1, entry, multisigEntries));
            }
        }
        return {
            info: info,
            address: info.accountAddress.plain(),
            title: this.getAccountLabel(info, this.knownAccounts),
            children: children,
            selected: this.account.address === info.accountAddress.plain(),
        };
    }

    getAccountLabel(info: MultisigAccountInfo, accounts: AccountModel[]): string {
        const account = accounts.find((wlt) => info.accountAddress.plain() === wlt.address);
        const addressOrName = (account && account.name) || info.accountAddress.plain();
        return addressOrName + (info.isMultisig() ? ` - ${info.minApproval} of ${info.minRemoval}` : '');
    }
}
