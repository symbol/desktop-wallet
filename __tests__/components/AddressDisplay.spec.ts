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
import AddressDisplay from '@/components/AddressDisplay/AddressDisplay.vue';
import { AddressDisplayTs } from '@/components/AddressDisplay/AddressDisplayTs';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { Address, NamespaceId, NetworkType } from 'symbol-sdk';
import Vue from 'vue';

describe('components/AddressDisplay', () => {
    const address = Address.createFromRawAddress(WalletsModel1.address);
    const namespaceId = new NamespaceId('test-id');
    const networkType = NetworkType.TEST_NET;
    const mockNetworkStore = {
        namespaced: true,
        state: { networkType },
        getters: {
            networkType: (state) => {
                return state.networkType;
            },
        },
    };
    const mockNamespaceStore = {
        namespaced: true,
        actions: {
            RESOLVE_NAME: jest.fn(),
        },
    };

    const getAddressDisplayWrapper = (
        address?: Address | string | NamespaceId,
        showAddress?: boolean,
        allowExplorerLink?: boolean,
        dispatch?: () => any,
    ) => {
        const wrapper = getComponent(
            AddressDisplay,
            { network: mockNetworkStore, namespace: mockNamespaceStore },
            {},
            {
                address,
                showAddress,
                allowExplorerLink,
            },
            undefined,
            dispatch,
        );
        return wrapper;
    };

    test('renders address display when no address', async () => {
        // Arrange + Act:
        const wrapper = getAddressDisplayWrapper(undefined, true, true);
        const component = wrapper.vm as AddressDisplayTs;
        await Vue.nextTick();

        // Assert:
        expect(component.rawAddress).toBe('');
        expect(component.descriptor).toBe('');
        expect(component.explorerUrl).toBe('');
    });

    const testAddressDisplayInstanceAddressOrString = (type: string, addressObj: Address | string | NamespaceId) => {
        describe(`instance is ${type}`, () => {
            const rawAddress = addressObj instanceof Address ? addressObj.plain() : addressObj;
            test('renders address display when no contact in the address book', async () => {
                // Arrange + Act:
                const wrapper = getAddressDisplayWrapper(addressObj, true, true);
                const component = wrapper.vm as AddressDisplayTs;
                await Vue.nextTick();

                // Assert:
                expect(component.descriptor).toBe(rawAddress);
                expect(component.rawAddress).toBe(rawAddress);
                expect(component.isAddressBlocked).toBe(false);
                expect(component.explorerUrl).toBe(`https://testnet.symbol.fyi/accounts/${rawAddress}`);
            });

            test('renders address display when there is contact', async () => {
                // Arrange:
                const contact = { name: 'myContactName', isBlackListed: true };
                const dispatch = jest.fn();
                dispatch.mockImplementation((type: string) => {
                    if (type === 'addressBook/RESOLVE_ADDRESS') {
                        return Promise.resolve(contact);
                    }
                    return Promise.resolve(undefined);
                });

                const wrapper = getAddressDisplayWrapper(addressObj, true, true, dispatch);
                const component = wrapper.vm as AddressDisplayTs;
                await Vue.nextTick();

                // Assert:
                expect(component.descriptor).toBe(contact.name);
                expect(component.rawAddress).toBe(address.plain());
                expect(component.isAddressBlocked).toBe(true);
            });
        });
    };
    testAddressDisplayInstanceAddressOrString('Address', address);
    testAddressDisplayInstanceAddressOrString('string', address.plain());

    describe('instance is NamespaceId', () => {
        test('renders address display when there is no linked address', async () => {
            // Arrange:
            const namespaceFullName = 'my-namespace';
            const dispatch = jest.fn();
            dispatch.mockImplementation((type: string) => {
                if (type === 'namespace/RESOLVE_NAME') {
                    return Promise.resolve(namespaceFullName);
                }
                return Promise.resolve(undefined);
            });

            // Act:
            const wrapper = getAddressDisplayWrapper(namespaceId, true, true, dispatch);
            const component = wrapper.vm as AddressDisplayTs;
            await Vue.nextTick();

            // Assert:
            expect(component.rawAddress).toBe(undefined);
            expect(component.descriptor).toBe(namespaceFullName);
        });

        test('renders address display when there is linked address', async () => {
            // Arrange:
            const linkedAddress = Address.createFromRawAddress('TBWALHG5EOT6JUWYUAWT6GYMRASATJVQBYH2XDY');
            const namespaceFullName = 'my-namespace';
            const dispatch = jest.fn();
            dispatch.mockImplementation((type: string) => {
                if (type === 'namespace/RESOLVE_NAME') {
                    return Promise.resolve(namespaceFullName);
                } else if (type === 'namespace/GET_LINKED_ADDRESS') {
                    return Promise.resolve(linkedAddress);
                }
                return Promise.resolve(undefined);
            });

            // Act:
            const wrapper = getAddressDisplayWrapper(namespaceId, true, true, dispatch);
            const component = wrapper.vm as AddressDisplayTs;
            await Vue.nextTick();

            // Assert:
            expect(component.rawAddress).toBe(linkedAddress.plain());
            expect(component.descriptor).toBe(`${namespaceFullName} (${linkedAddress.plain()})`);
        });
    });
});
