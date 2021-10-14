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
import { Address, MultisigAccountGraphInfo, MultisigAccountInfo } from 'symbol-sdk';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { Signer } from '@/store/Account';
import { CommonHelpers } from '@/core/utils/CommonHelpers';

export class MultisigService {
    /**
     * Returns all available multisig info from a multisig graph
     * @static
     * @param {MultisigAccountGraphInfo} multisig graph info
     * @returns {MultisigAccountInfo[]} multisig info
     */
    public static getMultisigInfoFromMultisigGraphInfo(graphInfo: MultisigAccountGraphInfo): MultisigAccountInfo[] {
        const { multisigEntries } = graphInfo;
        return [].concat(...this.getMultisigGraphArraySorted(multisigEntries)).map((item) => item); // flatten
    }

    /**
     * sort entries based on tree hierarchy from top to bottom
     * @param {Map<number, MultisigAccountInfo[]>} multisigEnteries
     * @returns {MultisigAccountInfo[]}  sorted multisig graph
     */
    public static getMultisigGraphArraySorted(multisigEntries: Map<number, MultisigAccountInfo[]>): MultisigAccountInfo[][] {
        return [...multisigEntries.keys()]
            .sort((a, b) => b - a) // Get addresses from top to bottom
            .map((key) => multisigEntries.get(key) || [])
            .filter((x) => x.length > 0);
    }

    public getSigners(
        knownAccounts: AccountModel[],
        currentAccountAddress: Address,
        multisigAccountGraph?: Map<number, MultisigAccountInfo[]>,
        level?: number,
        childMinApproval?: number,
        childMinRemoval?: number,
    ): Signer[] {
        if (!currentAccountAddress || (level && !multisigAccountGraph.get(level))) {
            return [];
        }

        // find the current account in the graph
        let currentMultisigAccountInfo: MultisigAccountInfo;

        if (level === undefined) {
            for (const [l, levelAccounts] of multisigAccountGraph) {
                for (const levelAccount of levelAccounts) {
                    if (levelAccount.accountAddress.equals(currentAccountAddress)) {
                        currentMultisigAccountInfo = levelAccount;
                        level = l;
                        break;
                    }
                }
            }
        } else {
            for (const levelAccount of multisigAccountGraph.get(level)) {
                if (levelAccount.accountAddress.equals(currentAccountAddress)) {
                    currentMultisigAccountInfo = levelAccount;
                }
            }
        }
        const currentSigner: Signer = {
            address: currentAccountAddress,
            label: this.getAccountLabel(currentAccountAddress, knownAccounts),
            multisig: currentMultisigAccountInfo?.isMultisig() || false,
            requiredCosigApproval: Math.max(childMinApproval || 0, currentMultisigAccountInfo?.minApproval || 0),
            requiredCosigRemoval: Math.max(childMinRemoval || 0, currentMultisigAccountInfo?.minRemoval || 0),
        };

        const parentSigners: Signer[] = [];
        if (currentMultisigAccountInfo?.multisigAddresses) {
            for (const parentSignerAddress of currentMultisigAccountInfo.multisigAddresses) {
                parentSigners.push(
                    ...this.getSigners(
                        knownAccounts,
                        parentSignerAddress,
                        multisigAccountGraph,
                        level - 1,
                        currentSigner.requiredCosigApproval,
                        currentSigner.requiredCosigRemoval,
                    ),
                );
            }

            // filter the first parents
            currentSigner.parentSigners = parentSigners.filter((ps) =>
                currentMultisigAccountInfo.multisigAddresses.some((msa) => msa.equals(ps.address)),
            );
        }
        return [currentSigner, ...parentSigners];
    }

    /**
     * creates a structred Tree object containing Current multisig account with children
     * @param {MultisigAccountInfo[][]} multisigEnteries
     * @returns {string[]} Array of string addresses
     */
    public getMultisigChildren(multisigAccountGraphInfo: MultisigAccountInfo[][]): string[] {
        const tree = [];
        if (multisigAccountGraphInfo) {
            multisigAccountGraphInfo.forEach((level: MultisigAccountInfo[]) => {
                const levelToMap = Symbol.iterator in Object(level) ? level : [].concat(level);

                levelToMap.forEach((entry: MultisigAccountInfo) => {
                    // if current entry is not a multisig account
                    if (entry.cosignatoryAddresses.length === 0) {
                        tree.push({
                            address: entry.accountAddress.plain(),
                            children: [],
                        });
                    } else {
                        // find the entry matching with address matching cosignatory address and update his children
                        const updateRecursively = (address, object) => (obj) => {
                            if (obj.address === address) {
                                obj.children.push(object);
                            } else if (obj.children !== undefined) {
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
                                    children: [],
                                }),
                            );
                        });
                    }
                });
            });
        }
        return tree;
    }

    /**
     *  return array of multisig children addreses
     * @param {MultisigAccountInfo[][]} multisigEnteries
     * @returns {Address[]} Array of Addresses
     */
    public getMultisigChildrenAddresses(multisigAccountGraphInfo: MultisigAccountInfo[][]) {
        const addresses: Address[] = [];

        if (multisigAccountGraphInfo) {
            const mutlisigChildrenTree = this.getMultisigChildren(multisigAccountGraphInfo);
            if (mutlisigChildrenTree && mutlisigChildrenTree.length) {
                // @ts-ignore
                CommonHelpers.parseObjectProperties(mutlisigChildrenTree[0].children, (k, prop) => {
                    addresses.push(Address.createFromRawAddress(prop));
                });
            }
            return addresses;
        }
    }

    /**
     * Checks if the given address in the given multisignature tree
     * @param multisigAccountGraph Multisig tree structure
     * @param address Address to search in the tree
     * @returns
     */
    public static isAddressInMultisigTree(multisigAccountGraph: Map<number, MultisigAccountInfo[]>, address: string): boolean {
        for (const [l, levelAccounts] of multisigAccountGraph) {
            for (const levelAccount of levelAccounts) {
                if (
                    levelAccount.accountAddress.plain() === address ||
                    levelAccount.cosignatoryAddresses?.some((c) => c.plain() === address)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    private getAccountLabel(address: Address, accounts: AccountModel[]): string {
        const account = accounts.find((wlt) => address.plain() === wlt.address);
        return (account && account.name) || address.plain();
    }
}
