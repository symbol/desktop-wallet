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
import AccountLinks from '@/components/AccountLinks/AccountLinks.vue';
import { AccountLinksTs } from '@/components/AccountLinks/AccountLinksTs';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { simpleWallet1, WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { NetworkType } from 'symbol-sdk';

describe('components/AccountLinks', () => {
    const accountModel = WalletsModel1;
    const accountAddress = simpleWallet1.address;
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

    const mockAppStore = {
        namespaced: true,
        getters: {
            explorerUrl: () => 'https://testnet.symbol.fyi/',
            faucetUrl: () => 'https://testnet.symbol.tools/',
        },
    };

    const getAccountLinksWrapper = (accountModel?: AccountModel, title?: string, link?: string, icon?: string) => {
        const wrapper = getComponent(
            AccountLinks,
            { network: mockNetworkStore, app: mockAppStore },
            { networkType },
            {
                account: accountModel,
                title,
                link,
                icon,
            },
        );
        return wrapper;
    };

    test('address is included in the links when given account model', () => {
        // Arrange:
        const wrapper = getAccountLinksWrapper(accountModel);
        const component = wrapper.vm as AccountLinksTs;

        // Act + Assert:
        expect(component.explorerUrl).toContain(accountAddress.plain());
        expect(component.faucetUrl).toContain(accountAddress.plain());
    });

    test('renders title, icon and link properties', () => {
        // Arrange:
        const title = 'Faucet';
        const icon = 'faucet-icon';
        const link = 'faucet-link';
        const wrapper = getAccountLinksWrapper(accountModel, title, link, icon);

        // Act + Assert:
        expect(wrapper.find('a').text()).toBe(title);
        expect(wrapper.find('a').attributes('href')).toBe(link);
        expect(wrapper.find('img').attributes('src')).toBe(icon);
    });
});
