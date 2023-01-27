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
import { Account, Deadline, MosaicDefinitionTransaction, MosaicFlags, MosaicId, MosaicNonce, NetworkType, UInt64 } from 'symbol-sdk';
import { createStore } from '@MOCKS/Store';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { ViewMosaicDefinitionTransaction } from '@/core/transactions/ViewMosaicDefinitionTransaction';
import { OfflineRentalFees } from '@/services/offline/MockModels';

describe('transactions/ViewMosaicSupplyRevocationTransaction', () => {
    const signerPublicAccount = Account.generateNewAccount(NetworkType.TEST_NET).publicAccount;
    const store = createStore({});
    const epochAdjustment = 1573430400;
    const blockGenerationTargetTime = 30;
    const randomNonce = MosaicNonce.createRandom();
    const mosaicId = MosaicId.createFromNonce(randomNonce, signerPublicAccount.address);
    const defaultMosaicFlags = MosaicFlags.create(false, false, false, false);

    beforeEach(() => {
        const networkConfig = new NetworkConfigurationModel();
        const rentalFees = OfflineRentalFees;
        Object.assign(networkConfig, { epochAdjustment: epochAdjustment, blockGenerationTargetTime: blockGenerationTargetTime });
        store.getters['network/networkConfiguration'] = networkConfig;
        store.getters['network/rentalFeeEstimation'] = rentalFees;
    });

    const buildTransaction = (
        mosaicFlags: MosaicFlags = defaultMosaicFlags,
        divisibility: number = 6,
        duration: UInt64 = UInt64.fromUint(0),
    ) => {
        return MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            randomNonce,
            mosaicId,
            mosaicFlags,
            divisibility,
            duration,
            NetworkType.TEST_NET,
            UInt64.fromUint(1_000_000),
        );
    };

    const assertCommonFields = (view: ViewMosaicDefinitionTransaction) => {
        expect(view).toBeDefined();
        expect(view.transaction).toBeDefined();
        expect(view.detailItems.length).toBe(8);
    };

    const testPopulateDataForMosaicDefinitionWithDifferentMosaicFlagsView = (mosaicFlags: MosaicFlags) => {
        // Arrange:
        const transaction = buildTransaction(mosaicFlags);

        // Act:
        const view = new ViewMosaicDefinitionTransaction(store, transaction);

        // Assert:
        assertCommonFields(view);
        expect(view.detailItems).toContainEqual({ key: 'table_header_transferable', value: mosaicFlags.transferable });
        expect(view.detailItems).toContainEqual({ key: 'table_header_supply_mutable', value: mosaicFlags.supplyMutable });
        expect(view.detailItems).toContainEqual({ key: 'table_header_restrictable', value: mosaicFlags.restrictable });
        expect(view.detailItems).toContainEqual({ key: 'table_header_revokable', value: mosaicFlags.revokable });
        expect(view.detailItems).toContainEqual({ key: 'table_header_divisibility', value: '6' });
        expect(view.detailItems).toContainEqual({ key: 'estimated_rental_fee', isMosaic: true, value: { amount: 500000, color: 'red' } });
        expect(view.detailItems).toContainEqual({ key: 'mosaic_id', value: mosaicId.toHex() });
    };

    test('populate mosaic definition transaction fields for unlimited duration', () => {
        // Arrange:
        const transaction = buildTransaction(defaultMosaicFlags, 3, UInt64.fromUint(0));

        // Act:
        const view = new ViewMosaicDefinitionTransaction(store, transaction);

        // Assert:
        assertCommonFields(view);
        expect(view.detailItems).toContainEqual({ key: 'duration', value: 'unlimited' });
    });

    test('populate mosaic definition transaction fields for defined duration', () => {
        // Arrange:
        const transaction = buildTransaction(defaultMosaicFlags, 3, UInt64.fromUint(10_000));

        // Act:
        const view = new ViewMosaicDefinitionTransaction(store, transaction);

        // Assert:
        assertCommonFields(view);
        expect(view.detailItems).toContainEqual({ key: 'duration', value: '3 d 11 h 20 m ' });
    });

    test('populate mosaic definition transaction fields when supply mutable', () => {
        testPopulateDataForMosaicDefinitionWithDifferentMosaicFlagsView(MosaicFlags.create(true, false, false, false));
    });

    test('populate mosaic definition transaction fields when transferable', () => {
        testPopulateDataForMosaicDefinitionWithDifferentMosaicFlagsView(MosaicFlags.create(false, true, false, false));
    });

    test('populate mosaic definition transaction fields when restrictable', () => {
        testPopulateDataForMosaicDefinitionWithDifferentMosaicFlagsView(MosaicFlags.create(false, false, true, false));
    });

    test('populate mosaic definition transaction fields when revokable', () => {
        testPopulateDataForMosaicDefinitionWithDifferentMosaicFlagsView(MosaicFlags.create(false, false, false, true));
    });
});
