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
import HarvestingStore from '@/store/Harvesting';
import { getTestAccount } from '@MOCKS/Accounts';
import { HarvestingService } from '@/services/HarvestingService';
import { Account, AccountInfo, NetworkType, UInt64, AccountType } from 'symbol-sdk';
import { NodeModel } from '@/core/database/entities/NodeModel';

let commit;
let dispatch;

let harvestingService: HarvestingService;
let mockAccount: Account;

beforeEach(() => {
    commit = jest.fn();
    dispatch = jest.fn();

    harvestingService = new HarvestingService();
    mockAccount = getTestAccount('remoteTestnet');

    // Mock Harvesting Model
    harvestingService.saveHarvestingModel({
        accountAddress: mockAccount.address.plain(),
    });
});

describe('store/Harvesting', () => {
    describe('action "UPDATE_LOCAL_ACCOUNT_LINK_PRIVATE_KEY" should', () => {
        it('should update encRemotePrivateKey and encVrfPrivateKey to Null given supplementalPublicKeys empty', () => {
            // Arrange
            const mockAccountInfo = new AccountInfo(
                1,
                'someId',
                mockAccount.address,
                UInt64.fromUint(1),
                '0'.repeat(64),
                UInt64.fromUint(1),
                AccountType.Main,
                {},
                [],
                [],
                UInt64.fromUint(1),
                UInt64.fromUint(1),
            );

            // Act
            HarvestingStore.actions.UPDATE_LOCAL_ACCOUNT_LINK_PRIVATE_KEY(
                { dispatch },
                {
                    currentSignerAccountInfo: mockAccountInfo,
                    currentSignerHarvestingModel: {
                        accountAddress: mockAccount.address.plain(),
                    },
                },
            );

            // Assert
            expect(dispatch).toHaveBeenNthCalledWith(1, 'UPDATE_REMOTE_ACCOUNT_PRIVATE_KEY', {
                accountAddress: mockAccount.address.plain(),
                encRemotePrivateKey: null,
            });

            expect(dispatch).toHaveBeenNthCalledWith(2, 'UPDATE_VRF_ACCOUNT_PRIVATE_KEY', {
                accountAddress: mockAccount.address.plain(),
                encVrfPrivateKey: null,
            });
        });

        it('should update encRemotePrivateKey and encVrfPrivateKey given linked / vrf public key equal new remote / vrf public key', () => {
            // Arrange
            const linkedKeyInfo = Account.generateNewAccount(NetworkType.TEST_NET);
            const vrfKeyInfo = Account.generateNewAccount(NetworkType.TEST_NET);

            const mockAccountInfo = new AccountInfo(
                1,
                'someId',
                mockAccount.address,
                UInt64.fromUint(1),
                '0'.repeat(64),
                UInt64.fromUint(1),
                AccountType.Main,
                {
                    linked: {
                        publicKey: linkedKeyInfo.publicKey,
                    },
                    vrf: {
                        publicKey: vrfKeyInfo.publicKey,
                    },
                },
                [],
                [],
                UInt64.fromUint(1),
                UInt64.fromUint(1),
            );

            const LinkedKeyInfo = {
                accountAddress: mockAccount.address.plain(),
                newEncRemotePrivateKey: linkedKeyInfo.privateKey.toString(),
                newRemotePublicKey: linkedKeyInfo.publicKey,
                newEncVrfPrivateKey: vrfKeyInfo.privateKey.toString(),
                newVrfPublicKey: vrfKeyInfo.publicKey,
            };

            // Act
            HarvestingStore.actions.UPDATE_LOCAL_ACCOUNT_LINK_PRIVATE_KEY(
                { dispatch },
                {
                    currentSignerAccountInfo: mockAccountInfo,
                    currentSignerHarvestingModel: LinkedKeyInfo,
                },
            );

            // Assert
            expect(dispatch).toHaveBeenNthCalledWith(1, 'UPDATE_REMOTE_ACCOUNT_PRIVATE_KEY', {
                accountAddress: mockAccount.address.plain(),
                encRemotePrivateKey: LinkedKeyInfo.newEncRemotePrivateKey,
            });

            expect(dispatch).toHaveBeenNthCalledWith(2, 'UPDATE_VRF_ACCOUNT_PRIVATE_KEY', {
                accountAddress: mockAccount.address.plain(),
                encVrfPrivateKey: LinkedKeyInfo.newEncVrfPrivateKey,
            });
        });
    });

    describe('action "UPDATE_NEW_REMOTE_KEY_INFO" should', () => {
        it('should update new Remote key info', () => {
            // Arrange
            const newRemoteKeyInfo = {
                accountAddress: mockAccount.address.plain(),
                newEncRemotePrivateKey: '1',
                newRemotePublicKey: '2',
            };

            // Act
            HarvestingStore.actions.UPDATE_NEW_REMOTE_KEY_INFO({ commit }, newRemoteKeyInfo);

            // Assert
            expect(commit).toHaveBeenCalledTimes(1);
            expect(commit).toHaveBeenNthCalledWith(1, 'currentSignerHarvestingModel', newRemoteKeyInfo);
        });
    });
    describe('action "UPDATE_NEW_VRF_KEY_INFO" should', () => {
        it('should update new VRF key info', () => {
            // Arrange
            const newVrfKeyInfo = {
                accountAddress: mockAccount.address.plain(),
                newEncVrfPrivateKey: '1',
                newVrfPublicKey: '2',
            };

            // Act
            HarvestingStore.actions.UPDATE_NEW_VRF_KEY_INFO({ commit }, newVrfKeyInfo);

            // Assert
            expect(commit).toHaveBeenCalledTimes(1);
            expect(commit).toHaveBeenNthCalledWith(1, 'currentSignerHarvestingModel', newVrfKeyInfo);
        });
    });
    describe('action "UPDATE_ACCOUNT_NEW_SELECTED_HARVESTING_NODE" should', () => {
        it('should update new selected harvesting node', () => {
            // Arrange
            const harvestingNode = {
                accountAddress: mockAccount.address.plain(),
                newSelectedHarvestingNode: {
                    nodePublicKey: '0'.repeat(64),
                } as NodeModel,
            };

            // Act
            HarvestingStore.actions.UPDATE_ACCOUNT_NEW_SELECTED_HARVESTING_NODE({ commit }, harvestingNode);

            // Assert
            expect(commit).toHaveBeenCalledTimes(1);
            expect(commit).toHaveBeenNthCalledWith(1, 'currentSignerHarvestingModel', harvestingNode);
        });
    });
});
