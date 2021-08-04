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

import { HarvestingService } from '@/services/HarvestingService';
import { Account } from 'symbol-sdk';
import { getTestAccount } from '@MOCKS/Accounts';
import { NodeModel } from '@/core/database/entities/NodeModel';

let harvestingService: HarvestingService;
let mockAccount: Account;

beforeAll(() => {
    harvestingService = new HarvestingService();
    mockAccount = getTestAccount('remoteTestnet');

    // Mock Harvesting Model
    harvestingService.saveHarvestingModel({
        accountAddress: mockAccount.address.plain(),
    });
});

describe('Harvesting Service', () => {
    it('should be able to get harvesting model', async () => {
        const address = mockAccount.address.plain();

        const harvestingModel = harvestingService.getHarvestingModel(address);

        expect(harvestingModel.accountAddress).toBe(address);
    });

    it('should be able to update NewAccountLinkKeyInfo', () => {
        const address = mockAccount.address.plain();
        const newEncRemotePrivateKey = '1'.repeat(64);
        const newRemotePublicKey = '0'.repeat(64);

        harvestingService.saveHarvestingModel({
            accountAddress: address,
        });

        const harvestingModel = harvestingService.getHarvestingModel(address);
        harvestingService.updateNewAccountLinkKeyInfo(harvestingModel, {
            newEncRemotePrivateKey,
            newRemotePublicKey,
        });

        expect(harvestingModel.newEncRemotePrivateKey).toBe(newEncRemotePrivateKey);
        expect(harvestingModel.newRemotePublicKey).toBe(newRemotePublicKey);
    });

    it('should be able to update newSelectedHarvestingNode', () => {
        const address = mockAccount.address.plain();
        const newSelectedHarvestingNode = {
            nodePublicKey: '0'.repeat(64),
        } as NodeModel;

        const harvestingModel = harvestingService.getHarvestingModel(address);
        harvestingService.updateNewSelectedHarvestingNode(harvestingModel, newSelectedHarvestingNode);

        expect(harvestingModel.newSelectedHarvestingNode).toBe(newSelectedHarvestingNode);
    });
});
