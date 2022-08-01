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
import AccountStore from '@/store/Account';
import { account1 } from '@MOCKS/Accounts';
import { MultisigService } from '@/services/MultisigService';
import { Address, MultisigAccountInfo } from 'symbol-sdk';

type MultisigAccountInfoProperties = Omit<MultisigAccountInfo, 'isMultisig' | 'hasCosigner' | 'isCosignerOfMultisigAccount' | 'serialize'>;

let commit;
let dispatch;

beforeEach(() => {
    commit = jest.fn();
    dispatch = jest.fn();
});

describe('store/Account', () => {
    describe('action "LOAD_MULTISIG_GRAPH"', () => {
        const address1 = 'TBY22A6EX73URRW3YVZUX72223RNFCI4QR2C3GY';
        const address2 = 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI';
        const address3 = 'TD2KY5BKECF6YKSWSTGMUHFP66GG33S5MG6UOYQ';
        const address4 = 'TDYEWBAMEW27OODEODPQ4OKYFEU6N24NC4O7KZA';
        const address5 = 'TCZCGIGFXU5LW7BCUQCXVVYS6JJDHJWONYVVGXY';

        const createMultisigAccountsInfo = (address: string) => ({
            version: 1,
            accountAddress: Address.createFromRawAddress(address),
            minApproval: 2,
            minRemoval: 1,
            cosignatoryAddresses: [],
            multisigAddresses: [],
        });

        const createMockRepositoryFactory = (promise: jest.Mock<Promise<any>>) => {
            return {
                createMultisigRepository: () => ({
                    getMultisigAccountGraphInfo: () => ({
                        toPromise: promise,
                    }),
                }),
            };
        };

        const runLoadMultisigGraphTest = async (
            mockMultisigAccountGraphInfoPromise: jest.Mock<Promise<any>>,
            rootMultisigAccountsInfo: MultisigAccountInfoProperties[],
            expectedResult: MultisigAccountInfoProperties[],
            expectedMultisigAccountGraph: Map<number, MultisigAccountInfoProperties[]> | Array<any>,
            expectedMultisigAccountGraphInfo: MultisigAccountInfoProperties[],
        ) => {
            // Arrange
            const repositoryFactory = createMockRepositoryFactory(mockMultisigAccountGraphInfoPromise);
            const getters = {
                currentAccountAddress: account1.address,
            };
            const rootGetters = {
                'network/repositoryFactory': repositoryFactory,
            };
            const storeContext = {
                commit,
                dispatch,
                getters,
                rootGetters,
            };
            //@ts-ignore
            jest.spyOn(MultisigService, 'getMultisigInfoFromMultisigGraphInfo').mockReturnValue(rootMultisigAccountsInfo);

            // Act
            const result = await AccountStore.actions.LOAD_MULTISIG_GRAPH(storeContext);

            // Assert
            expect(commit).toHaveBeenNthCalledWith(1, 'multisigAccountGraph', expectedMultisigAccountGraph);
            expect(commit).toHaveBeenNthCalledWith(2, 'multisigAccountGraphInfo', expectedMultisigAccountGraphInfo);
            expect(result).toEqual(expectedResult);
        };

        test('load full multisig tree', async () => {
            // Arrange
            const multisigAccountsInfo = [createMultisigAccountsInfo(address1)];
            const currentMultisigAccountGraphInfo = {
                multisigEntries: new Map([
                    [-1, [createMultisigAccountsInfo(address1)]],
                    [0, [createMultisigAccountsInfo(address2), createMultisigAccountsInfo(address3)]],
                ]),
            };
            const rootMultisigAccountGraphInfo = {
                multisigEntries: new Map([
                    [0, [createMultisigAccountsInfo(address4)]],
                    [1, [createMultisigAccountsInfo(address5)]],
                ]),
            };
            const fullMultisigAccountGraphInfo = {
                multisigEntries: new Map([
                    [-1, [createMultisigAccountsInfo(address1), createMultisigAccountsInfo(address4)]],
                    [0, [createMultisigAccountsInfo(address2), createMultisigAccountsInfo(address3), createMultisigAccountsInfo(address5)]],
                ]),
            };

            const mockMultisigAccountGraphInfoPromise = jest
                .fn()
                .mockResolvedValueOnce(currentMultisigAccountGraphInfo)
                .mockResolvedValueOnce(rootMultisigAccountGraphInfo as any);
            const rootMultisigAccountsInfo = multisigAccountsInfo;
            const expectedResult = multisigAccountsInfo;
            const expectedMultisigAccountGraph = fullMultisigAccountGraphInfo.multisigEntries;
            const expectedMultisigAccountGraphInfo = multisigAccountsInfo;

            // Act + Assert;
            await runLoadMultisigGraphTest(
                mockMultisigAccountGraphInfoPromise,
                rootMultisigAccountsInfo,
                expectedResult,
                expectedMultisigAccountGraph,
                expectedMultisigAccountGraphInfo,
            );
        });

        test('handle error', async () => {
            // Arrange
            const mockMultisigAccountGraphInfoPromise = jest.fn().mockRejectedValue(null);
            const rootMultisigAccountsInfo = [];
            const expectedResult = [];
            const expectedMultisigAccountGraph = [];
            const expectedMultisigAccountGraphInfo = [];

            // Act + Assert;
            await runLoadMultisigGraphTest(
                mockMultisigAccountGraphInfoPromise,
                rootMultisigAccountsInfo,
                expectedResult,
                expectedMultisigAccountGraph,
                expectedMultisigAccountGraphInfo,
            );
        });
    });
});
