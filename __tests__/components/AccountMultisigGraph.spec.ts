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
import AccountMultisigGraph from '@/components/AccountMultisigGraph/AccountMultisigGraph.vue';
import { AccountMultisigGraphTs } from '@/components/AccountMultisigGraph/AccountMultisigGraphTs';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { AccountState } from '@/store/Account';
import { getComponent } from '@MOCKS/Components';
import { MultisigAccountInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { Address, MultisigAccountInfo } from 'symbol-sdk';

describe('components/AccountMultisigGraph', () => {
    const msigAddress = 'TBY22A6EX73URRW3YVZUX72223RNFCI4QR2C3GY';
    const cosig1Address = 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI';
    const cosig2Address = 'TD2KY5BKECF6YKSWSTGMUHFP66GG33S5MG6UOYQ';
    const cosig11Address = 'TDYEWBAMEW27OODEODPQ4OKYFEU6N24NC4O7KZA';
    const cosig21Address = 'TCZCGIGFXU5LW7BCUQCXVVYS6JJDHJWONYVVGXY';

    const multisigAccountGraphInfosDTO = [
        {
            level: 0,
            multisigEntries: [
                {
                    multisig: {
                        version: 1,
                        accountAddress: msigAddress,
                        minApproval: 2,
                        minRemoval: 1,
                        cosignatoryAddresses: [cosig1Address, cosig2Address],
                        multisigAddresses: [],
                    },
                },
            ],
        },
        {
            level: 1,
            multisigEntries: [
                {
                    multisig: {
                        version: 1,
                        accountAddress: cosig1Address,
                        minApproval: 1,
                        minRemoval: 1,
                        cosignatoryAddresses: [cosig11Address],
                        multisigAddresses: [msigAddress],
                    },
                },
                {
                    multisig: {
                        version: 1,
                        accountAddress: cosig2Address,
                        minApproval: 1,
                        minRemoval: 1,
                        cosignatoryAddresses: [cosig21Address],
                        multisigAddresses: [msigAddress],
                    },
                },
            ],
        },
        {
            level: 2,
            multisigEntries: [
                {
                    multisig: {
                        version: 1,
                        accountAddress: cosig21Address,
                        minApproval: 0,
                        minRemoval: 0,
                        cosignatoryAddresses: [],
                        multisigAddresses: [cosig2Address],
                    },
                },
                {
                    multisig: {
                        version: 1,
                        accountAddress: cosig11Address,
                        minApproval: 0,
                        minRemoval: 0,
                        cosignatoryAddresses: [],
                        multisigAddresses: [cosig1Address],
                    },
                },
            ],
        },
    ];

    const toMultisigAccountInfo = (dto: MultisigAccountInfoDTO): MultisigAccountInfo => {
        return new MultisigAccountInfo(
            dto.multisig.version || 1,
            Address.createFromRawAddress(dto.multisig.accountAddress),
            dto.multisig.minApproval,
            dto.multisig.minRemoval,
            dto.multisig.cosignatoryAddresses.map((cosigner) => Address.createFromRawAddress(cosigner)),
            dto.multisig.multisigAddresses.map((multisig) => Address.createFromRawAddress(multisig)),
        );
    };
    const multisigAccounts = new Map<number, MultisigAccountInfo[]>();

    multisigAccountGraphInfosDTO.map((multisigAccountGraphInfoDTO) => {
        multisigAccounts.set(
            multisigAccountGraphInfoDTO.level,
            multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
                return toMultisigAccountInfo(multisigAccountInfoDTO);
            }),
        );
    });

    const mockAccountStore = {
        namespaced: true,
        state: {
            rootMultisigAccountGraph: undefined,
            knownAccounts: [],
        },
        getters: {
            rootMultisigAccountGraph: (state) => {
                return state.rootMultisigAccountGraph;
            },
            knownAccounts: (state) => {
                return state.knownAccounts;
            },
        },
    };

    const getAccountMultisigGraphWrapper = (account: AccountModel, stateChanges?: AccountState) => {
        const wrapper = getComponent(AccountMultisigGraph, { account: mockAccountStore }, stateChanges, {
            account,
        });
        return wrapper;
    };

    test('renders account multisig graph component when multisig account graph is undefined', () => {
        // Arrange:
        const account = ({ address: msigAddress } as unknown) as AccountModel;

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account);

        // Assert:
        expect(wrapper.find('span.label').exists()).toBeTruthy();
    });

    test('renders account multisig graph component when multisig account graph is empty', () => {
        // Arrange:
        const account = ({ address: msigAddress } as unknown) as AccountModel;
        const stateChanges = {
            rootMultisigAccountGraph: [],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account, stateChanges as AccountState);

        // Assert:
        expect(wrapper.find('span.label').exists()).toBeTruthy();
    });

    test('current account is selected in multisig graph', () => {
        // Arrange:
        const account = ({ address: cosig1Address } as unknown) as AccountModel;
        const stateChanges = {
            rootMultisigAccountGraph: (multisigAccounts as unknown) as MultisigAccountInfo[][],
            knownAccounts: [{ name: 'myAccount', address: cosig1Address }],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account, stateChanges as AccountState);
        const component = wrapper.vm as AccountMultisigGraphTs;

        // Assert:
        expect(component.multisigGraphTree[0].info.accountAddress.address).toBe(msigAddress);
        expect(component.multisigGraphTree[0].info.cosignatoryAddresses[0].address).toBe(cosig1Address);
        expect(component.multisigGraphTree[0].info.cosignatoryAddresses[1].address).toBe(cosig2Address);
        expect(component.multisigGraphTree[0].children[0].info.accountAddress.address).toBe(cosig1Address);
        expect(component.multisigGraphTree[0].children[1].info.accountAddress.address).toBe(cosig2Address);
        expect(component.multisigGraphTree[0].children[0].children[0].info.accountAddress.address).toBe(cosig11Address);
        expect(component.multisigGraphTree[0].children[1].children[0].info.accountAddress.address).toBe(cosig21Address);
        expect(component.multisigGraphTree[0].children[0].selected).toBe(true);
    });
});
