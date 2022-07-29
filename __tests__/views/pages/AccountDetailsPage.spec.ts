/*
 * (C) Symbol Contributors 2022
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
import AccountDetailsPage from '@/views/pages/accounts/AccountDetailsPage/AccountDetailsPage.vue';
import { AccountDetailsPageTs } from '@/views/pages/accounts/AccountDetailsPage/AccountDetailsPageTs';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { Signer } from '@/store/Account';
import { getComponent } from '@MOCKS/Components';
import { WalletsModel1, account1 } from '@MOCKS/Accounts';

const accountDetailsPageTs = new AccountDetailsPageTs();
type Props = typeof accountDetailsPageTs.$props;

describe('pages/AccountDetailsPage', () => {
    const defaultSigner = {
        label: 'label',
        address: account1.address,
        multisig: false,
        requiredCosigApproval: 0,
        requiredCosigRemoval: 0,
    };

    const getAccountDetailsPageWrapper = (props: Props, stateChanges?: Record<string, any>) => {
        const mockStore = {
            app: {
                namespaced: true,
                getters: {
                    defaultAccount: () => account1,
                },
            },
            account: {
                namespaced: true,
                state: {
                    currentAccount: WalletsModel1,
                    currentSigner: defaultSigner,
                },
                getters: {
                    currentAccount: (state) => state.currentAccount,
                    currentSigner: (state) => state.currentSigner,
                    knownAccounts: () => [],
                },
            },
            metadata: {
                namespaced: true,
                getters: {
                    accountMetadataList: () => [],
                },
            },
            profile: {
                namespaced: true,
                getters: {
                    currentProfile: () => WalletsModel1,
                },
            },
        };

        return getComponent(AccountDetailsPage, mockStore, stateChanges, props, {});
    };

    describe('AccountMultisigGraph', () => {
        const runAccountMultisigGraphTest = async (
            currentAccount: AccountModel,
            currentSigner: Signer,
            shouldComponentBeShown: boolean,
        ) => {
            // Arrange:
            const props = {};
            const stateChanges = {
                currentAccount,
                currentSigner,
            };

            // Act:
            const wrapper = getAccountDetailsPageWrapper(props, stateChanges);
            const component = wrapper.vm as AccountDetailsPageTs;
            await component.$nextTick();
            const isComponentShown = component.hasAccountMultisigGraph;

            // Assert:
            expect(isComponentShown).toBe(shouldComponentBeShown);
        };

        test('show component when current account is multisig', async () => {
            // Arrange:
            const currentAccount = {
                ...WalletsModel1,
                isMultisig: true,
            };
            const currentSigner = defaultSigner;
            const shouldComponentBeShown = true;

            // Act + Assert:
            await runAccountMultisigGraphTest(currentAccount, currentSigner, shouldComponentBeShown);
        });

        test('show component when current signer is multisig cosigner', async () => {
            // Arrange:
            const currentAccount = WalletsModel1;
            const currentSigner = {
                ...defaultSigner,
                parentSigners: [defaultSigner],
            };
            const shouldComponentBeShown = true;

            // Act + Assert:
            await runAccountMultisigGraphTest(currentAccount, currentSigner, shouldComponentBeShown);
        });

        test('hide component when current signer is not multisig cosigner ', async () => {
            // Arrange:
            const currentAccount = null;
            const currentSigner = defaultSigner;
            const shouldComponentBeShown = false;

            // Act + Assert:
            await runAccountMultisigGraphTest(currentAccount, currentSigner, shouldComponentBeShown);
        });
    });
});
