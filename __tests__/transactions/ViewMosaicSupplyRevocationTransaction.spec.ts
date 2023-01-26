/*
 * (C) Symbol Contributors 2023
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
import { Account, Address, Deadline, Mosaic, MosaicId, MosaicSupplyRevocationTransaction, NetworkType, UInt64 } from 'symbol-sdk';
import { createStore } from '@MOCKS/Store';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { ViewMosaicSupplyRevocationTransaction } from '@/core/transactions/ViewMosaicSupplyRevocationTransaction';

describe('transactions/ViewMosaicSupplyRevocationTransaction', () => {
    const sourceAddress = Account.generateNewAccount(NetworkType.TEST_NET).address;
    const signerPublicAccount = Account.generateNewAccount(NetworkType.TEST_NET).publicAccount;
    const store = createStore({});
    const epochAdjustment = 1573430400;
    const mosaic = new Mosaic(new MosaicId('119C8A107ACADD5F'), UInt64.fromUint(10));
    const transaction = MosaicSupplyRevocationTransaction.create(
        Deadline.create(epochAdjustment),
        sourceAddress,
        mosaic,
        NetworkType.TEST_NET,
        UInt64.fromUint(1_000_000),
        undefined,
        signerPublicAccount,
    );

    beforeEach(() => {
        const networkConfig = new NetworkConfigurationModel();
        Object.assign(networkConfig, { epochAdjustment: epochAdjustment });
        store.getters['network/networkConfiguration'] = networkConfig;
    });

    const testPopulateDataForMosaicSupplyRevocationView = (signerAddress: Address, expectedColor: string) => {
        // Arrange:
        store.getters['account/currentSignerAddress'] = signerAddress;

        // Act:
        const view = new ViewMosaicSupplyRevocationTransaction(store, transaction);

        // Assert:
        expect(view).toBeDefined();
        expect(view.transaction).toBeDefined();
        expect(view.detailItems.length).toBe(3);
        expect(view.detailItems).toEqual([
            { key: 'reclaim_source', value: sourceAddress, isAddress: true },
            { key: 'reclaim_target', value: signerPublicAccount.address.plain(), isAddress: true },
            {
                key: 'mosaics',
                value: {
                    id: mosaic.id,
                    mosaicHex: mosaic.id.toHex(),
                    amount: mosaic.amount.compact(),
                    color: expectedColor,
                },
                isMosaic: true,
            },
        ]);
    };

    test('populate mosaic supply revocation transaction fields for source address view', () => {
        testPopulateDataForMosaicSupplyRevocationView(sourceAddress, 'red');
    });

    test('populate mosaic supply revocation transaction fields for mosaic owner view', () => {
        testPopulateDataForMosaicSupplyRevocationView(signerPublicAccount.address, 'green');
    });
});
