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
import { AddressBook } from 'symbol-address-book';
import { Address, MultisigAccountInfo } from 'symbol-sdk';

describe('components/AccountMultisigGraph', () => {
    const msigAddress = 'TBY22A6EX73URRW3YVZUX72223RNFCI4QR2C3GY';
    const cosig1Address = 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI';
    const cosig2Address = 'TD2KY5BKECF6YKSWSTGMUHFP66GG33S5MG6UOYQ';
    const cosig11Address = 'TDYEWBAMEW27OODEODPQ4OKYFEU6N24NC4O7KZA';
    const cosig21Address = 'TCZCGIGFXU5LW7BCUQCXVVYS6JJDHJWONYVVGXY';
    const randomAddress = 'TCZ1234FXU5LW7BCUQCXVVYS6JJDHJWONYVVGXY';
    const mockAddressBook = new AddressBook([
        {
            id: '0',
            name: 'contact name',
            address: cosig2Address,
        },
    ]);

    const multisigAccounts = [
        {
            version: 1,
            accountAddress: Address.createFromRawAddress(msigAddress),
            minApproval: 2,
            minRemoval: 1,
            cosignatoryAddresses: [Address.createFromRawAddress(cosig1Address), Address.createFromRawAddress(cosig2Address)],
            multisigAddresses: [],
        },
        {
            version: 1,
            accountAddress: Address.createFromRawAddress(cosig1Address),
            minApproval: 1,
            minRemoval: 1,
            cosignatoryAddresses: [Address.createFromRawAddress(cosig11Address)],
            multisigAddresses: [Address.createFromRawAddress(msigAddress)],
        },
        {
            version: 1,
            accountAddress: Address.createFromRawAddress(cosig2Address),
            minApproval: 1,
            minRemoval: 1,
            cosignatoryAddresses: [Address.createFromRawAddress(cosig21Address)],
            multisigAddresses: [Address.createFromRawAddress(msigAddress)],
        },
        {
            version: 1,
            accountAddress: Address.createFromRawAddress(cosig21Address),
            minApproval: 0,
            minRemoval: 0,
            cosignatoryAddresses: [],
            multisigAddresses: [Address.createFromRawAddress(cosig2Address)],
        },
        {
            version: 1,
            accountAddress: Address.createFromRawAddress(cosig11Address),
            minApproval: 0,
            minRemoval: 0,
            cosignatoryAddresses: [],
            multisigAddresses: [Address.createFromRawAddress(cosig1Address), Address.createFromRawAddress(randomAddress)],
        },
    ];

    const mockAccountStore = {
        namespaced: true,
        state: {
            multisigAccountGraphInfo: undefined,
            knownAccounts: [],
        },
        getters: {
            multisigAccountGraphInfo: (state) => {
                return state.multisigAccountGraphInfo;
            },
            knownAccounts: (state) => {
                return state.knownAccounts;
            },
        },
    };

    const mockAddressBookStore = {
        namespaced: true,
        getters: {
            getAddressBook: () => {
                return mockAddressBook;
            },
        },
    };

    const mockStore = {
        account: mockAccountStore,
        addressBook: mockAddressBookStore,
    };

    const getAccountMultisigGraphWrapper = (account: AccountModel, stateChanges?: AccountState, stubs?: Record<string, any>) => {
        const props = {
            account,
        };

        return getComponent(AccountMultisigGraph, mockStore, stateChanges, props, stubs);
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
            multisigAccountGraph: [],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account, stateChanges as AccountState);

        // Assert:
        expect(wrapper.find('span.label').exists()).toBeTruthy();
    });

    test('current account is selected in multisig graph', async () => {
        // Arrange:
        const account = ({ address: cosig1Address } as unknown) as AccountModel;
        const stateChanges = {
            multisigAccountGraphInfo: (multisigAccounts as unknown) as MultisigAccountInfo[],
            knownAccounts: [{ name: 'myAccount', address: cosig1Address }],
        } as Partial<AccountState>;

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account, stateChanges as AccountState);
        const component = wrapper.vm as AccountMultisigGraphTs;
        await component.$nextTick();

        // Assert:
        expect(component.dataset[0].title).toContain(msigAddress);
        expect(component.dataset[0].children[0].selected).toBe(true);
    });

    test('center graph view', () => {
        // Arrange:
        const account = ({ address: cosig1Address } as unknown) as AccountModel;
        const stateChanges = {
            multisigAccountGraph: [],
        } as Partial<AccountState>;
        const stubs = {
            VueTree: {
                template: '<div class="graph-view"><div/><svg/></div>',
            },
        };
        const mockSetAttribute = jest.fn();
        const mockRemToPixels = jest.fn().mockReturnValue(2);
        const expectedStyles = `transform: scale(1) translate(2px, 0px); transform-origin: center center;`;

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account, stateChanges as AccountState, stubs);
        const component = wrapper.vm as AccountMultisigGraphTs;
        const vueTreeChildren = (component.$refs['VueTree'] as Vue).$el.children;
        vueTreeChildren[0].setAttribute = mockSetAttribute;
        vueTreeChildren[1].setAttribute = mockSetAttribute;
        component['remToPixels'] = mockRemToPixels;
        component['centerGraph']();

        // Assert:
        expect(mockSetAttribute).toBeCalledTimes(2);
        expect(mockSetAttribute).nthCalledWith(1, 'style', expectedStyles);
        expect(mockSetAttribute).nthCalledWith(2, 'style', expectedStyles);
    });

    test('show graph modal', () => {
        // Arrange:
        const account = ({ address: cosig1Address } as unknown) as AccountModel;
        const stateChanges = {
            multisigAccountGraph: [],
        } as Partial<AccountState>;
        const mockUpdateGraphConfig = jest.fn();
        const mockCenterGraph = jest.fn();
        const stubs = {
            VueTree: {
                template: '<div class="graph-view"><div/><svg/></div>',
            },
        };

        // Act:
        const wrapper = getAccountMultisigGraphWrapper(account, stateChanges as AccountState, stubs);
        const graphViewElement = wrapper.find('.graph-view');
        const component = wrapper.vm as AccountMultisigGraphTs;
        component['updateGraphConfig'] = mockUpdateGraphConfig;
        component['centerGraph'] = mockCenterGraph;
        component['showGraphModal']();

        // Assert:
        expect(mockUpdateGraphConfig).toBeCalledTimes(1);
        expect(mockCenterGraph).toBeCalledTimes(1);
        expect(component.isGraphModalShown).toBe(true);
        expect(graphViewElement.exists()).toBe(true);
    });
});
