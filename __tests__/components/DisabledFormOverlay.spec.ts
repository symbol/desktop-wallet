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
import DisabledFormOverlay from '@/components/DisabledFormOverlay/DisabledFormOverlay.vue';
import { NotificationType } from '@/core/utils/NotificationType';
import i18n from '@/language';
import { AccountState } from '@/store/Account';
import { WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { mosaicsMock } from '@MOCKS/mosaics';
import { Address, MosaicId, MultisigAccountInfo } from 'symbol-sdk';

describe('components/DisabledFormOverlay', () => {
    const account = WalletsModel1;
    const account2 = WalletsModel2;
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentAccount: undefined,
            currentAccountMultisigInfo: undefined,
        },
        getters: {
            currentAccount: (state) => {
                return state.currentAccount;
            },
            currentAccountMultisigInfo: (state) => {
                return state.currentAccountMultisigInfo;
            },
        },
    };

    const mockMosaicStore = {
        namespaced: true,
        state: {
            networkMosaic: new MosaicId(mosaicsMock[0].mosaicIdHex),
        },
        getters: {
            networkMosaic: (state) => {
                return state.networkMosaic;
            },
        },
    };

    const getDisabledFormOverlayWrapper = (whitelisted?: boolean, stateChanges?: { [field: string]: any }, routeName: string = '') => {
        const mocks = { $route: { matched: [{ name: routeName }] } };
        const wrapper = getComponent(
            DisabledFormOverlay,
            { account: mockAccountStore, mosaic: mockMosaicStore },
            stateChanges,
            { whitelisted },
            undefined,
            undefined,
            mocks,
        );
        return wrapper;
    };

    test('renders no alerts', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
        } as Partial<AccountState>;

        // Act:
        const wrapper = getDisabledFormOverlayWrapper(false, stateChanges);

        // Assert:
        expect(wrapper.find('div').exists()).toBe(false);
    });

    test('renders alert when no network currency', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            networkMosaic: undefined,
        } as Partial<AccountState>;

        // Act:
        const wrapper = getDisabledFormOverlayWrapper(false, stateChanges);

        // Assert:
        expect(wrapper.find('div alert').text()).toBe(i18n.t(NotificationType.NO_NETWORK_CURRENCY));
    });

    test('renders no alert when whitelisted', () => {
        // Arrange:
        const stateChanges = {
            currentAccount: account,
            networkMosaic: undefined,
        } as Partial<AccountState>;

        // Act:
        const wrapper = getDisabledFormOverlayWrapper(true, stateChanges);

        // Assert:
        expect(wrapper.find('div').exists()).toBe(false);
    });

    const arrangeTestForMultisigAccount = (routeName?: string) => {
        // Arrange:
        const multisigAccountInfo = { cosignatoryAddresses: [Address.createFromRawAddress(account2.address)] } as MultisigAccountInfo;
        const stateChanges = {
            currentAccount: { ...account, isMultisig: true },
            currentAccountMultisigInfo: multisigAccountInfo,
        } as Partial<AccountState>;

        // Act:
        return getDisabledFormOverlayWrapper(false, stateChanges, routeName);
    };

    test('renders alert when account is multisig', () => {
        const wrapper = arrangeTestForMultisigAccount();

        // Assert:
        expect(wrapper.find('div alert').text()).toBe(i18n.t(NotificationType.MULTISIG_ACCOUNTS_NO_TX));
    });

    test('renders no alert when account is multisig and the route is multisig friendly', () => {
        const wrapper = arrangeTestForMultisigAccount('dashboard.invoice');

        // Assert:
        expect(wrapper.find('div').exists()).toBe(false);
    });
});
