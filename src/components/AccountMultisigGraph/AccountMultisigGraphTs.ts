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
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueTree from '@ssthouse/vue-tree-chart';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { mapGetters } from 'vuex';
import { AddressBook } from 'symbol-address-book';
import { MultisigAccountInfo } from 'symbol-sdk';
import i18n from '@/language';

interface TreeNode {
    name: string;
    title: string;
    selected: boolean;
    children: TreeNode[];
    multisig?: {
        minApproval: number;
        minRemoval: number;
    };
}

interface MultisigAccountInfoWithChildren extends MultisigAccountInfo {
    children: TreeNode[];
}

@Component({
    components: {
        VueTree,
    },
    computed: {
        ...mapGetters({
            multisigAccountGraphInfo: 'account/multisigAccountGraphInfo',
            knownAccounts: 'account/knownAccounts',
            addressBook: 'addressBook/getAddressBook',
        }),
    },
})
export class AccountMultisigGraphTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;

    public multisigAccountGraphInfo: MultisigAccountInfo[];
    public knownAccounts: AccountModel[];
    public addressBook: AddressBook;
    public graphConfig = {};
    public isGraphModalShown = false;

    get dataset(): TreeNode[] {
        if (!this.multisigAccountGraphInfo?.length) {
            return [];
        }

        const tree: TreeNode[] = [];
        const hashTable = {};
        this.multisigAccountGraphInfo.forEach((multisigAccountInfo) => {
            const address = multisigAccountInfo.accountAddress.plain();
            hashTable[address] = {
                ...multisigAccountInfo,
                children: [],
            };
        });
        this.multisigAccountGraphInfo.forEach((multisigAccountInfo) => {
            const address = multisigAccountInfo.accountAddress.plain();

            if (multisigAccountInfo.multisigAddresses.length) {
                const parentPlainAddresses = multisigAccountInfo.multisigAddresses.map((address) => address.plain());
                parentPlainAddresses.forEach((parentAddress) => {
                    const treeNode = this.multisigAccountInfoToTreeNode(hashTable[address]);
                    hashTable[parentAddress]?.children.push(treeNode);
                });
            } else {
                const treeNode = this.multisigAccountInfoToTreeNode(hashTable[address]);
                tree.push(treeNode);
            }
        });

        return tree;
    }

    private multisigAccountInfoToTreeNode(info: MultisigAccountInfoWithChildren): TreeNode {
        const address = info.accountAddress.plain();
        const name = this.getAccountLabel(address, true);
        const selected = this.account.address === address;
        const children = info.children;
        const cosignatoryAddressesCount = info.cosignatoryAddresses.length;
        let multisig = null;
        let title = this.getAccountLabel(address, false);

        if (cosignatoryAddressesCount > 0) {
            multisig = {
                minApproval: `${i18n.t('form_label_min_approval')}: ${info.minApproval}`,
                minRemoval: `${i18n.t('form_label_min_removal')}: ${info.minRemoval}`,
            };
            title += `
                ${info.minApproval} of ${info.cosignatoryAddresses.length} ${i18n.t('label_for_approvals')}
                ${info.minRemoval} of ${info.cosignatoryAddresses.length} ${i18n.t('label_for_removals')}`;
        }

        return {
            name,
            title,
            selected,
            children,
            multisig,
        };
    }

    private getAccountLabel(address: string, shortenAddress: boolean): string {
        const contact = this.addressBook.getContactByAddress(address);

        if (contact) {
            return contact.name;
        }

        const account = this.knownAccounts.find((knownAccount) => address === knownAccount.address);

        if (account) {
            return account.name;
        }

        if (shortenAddress) {
            const addressStart = address.substring(0, 5);
            const addressEnd = address.slice(-5);

            return `${addressStart}...${addressEnd}`;
        }

        return address;
    }

    public showGraphModal() {
        this.isGraphModalShown = true;
        this.updateGraphConfig();
        this.centerGraph();
    }

    private centerGraph() {
        const offsetX = this.remToPixels(5.8);
        const stylePositionCeneter = `transform: scale(1) translate(${offsetX}px, 0px); transform-origin: center center;`;
        const vueTree = this.$refs['VueTree'] as Vue;
        vueTree.$el.children[0].setAttribute('style', stylePositionCeneter);
        vueTree.$el.children[1].setAttribute('style', stylePositionCeneter);
    }

    private updateGraphConfig() {
        this.graphConfig = {
            nodeWidth: this.remToPixels(2),
            nodeHeight: this.remToPixels(1),
            levelHeight: this.remToPixels(1),
            linkStyle: 'streight',
            collapseEnabled: false,
        };
    }

    private remToPixels(rem: number): number {
        return Math.round(rem * parseFloat(getComputedStyle(document.documentElement).fontSize));
    }

    created() {
        this.updateGraphConfig();
    }
}
