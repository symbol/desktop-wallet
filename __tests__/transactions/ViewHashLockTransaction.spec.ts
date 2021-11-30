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
import { AggregateTransaction, Deadline, LockFundsTransaction, NetworkCurrencies, NetworkType, UInt64 } from 'symbol-sdk';
import { createStore } from '@MOCKS/Store';
import { getTestAccount } from '@MOCKS/Accounts';
import { ViewHashLockTransaction } from '@/core/transactions/ViewHashLockTransaction';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';

const store = createStore({});
const epochAdjustment = 1573430400;
describe('transactions/ViewHashLockTransaction', () => {
    describe('use() should', () => {
        test('populate hash lock transaction fields', () => {
            const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(epochAdjustment, 48),
                [],
                NetworkType.TEST_NET,
                [],
            );
            const signedTransaction = getTestAccount('cosigner1').sign(aggregateTransaction, generationHash);
            const hashLock = LockFundsTransaction.create(
                Deadline.create(epochAdjustment, 6),
                NetworkCurrencies.PUBLIC.currency.createRelative(10),
                UInt64.fromUint(5760),
                signedTransaction,
                NetworkType.TEST_NET,
            );
            const networkConfig = new NetworkConfigurationModel();
            Object.assign(networkConfig, { epochAdjustment: 1573430400 });
            store.getters['network/networkConfiguration'] = networkConfig;
            // act
            const view = new ViewHashLockTransaction(store, hashLock);

            // assert
            expect(view).toBeDefined();
            expect(view.transaction).toBeDefined();
            expect(view.detailItems.length).toBe(3);
        });
    });
});
