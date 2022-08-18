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
import { Account, MosaicMetadataTransaction, Convert, Deadline, NetworkType, UInt64, MosaicId } from 'symbol-sdk';
import { createStore } from '@MOCKS/Store';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { ViewMosaicMetadataTransaction } from '@/core/transactions/ViewMosaicMetadataTransaction';
import i18n from '@/language';

const store = createStore({});
const epochAdjustment = 1573430400;
describe('transactions/ViewMosaicMetadataTransaction', () => {
    describe('use() should', () => {
        test('populate mosaic metadata transaction fields', () => {
            // arrange
            const account = Account.generateNewAccount(NetworkType.TEST_NET);
            store.getters['account/currentSignerAddress'] = account.address;
            const value = 'This is the message for this mosaic! 汉字89664';
            const valueBytes = Convert.utf8ToUint8(value);
            const scopedMetadataKey = UInt64.fromUint(1_000);
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const metadataValue = i18n.t('view_metadata_value', {
                hexValue: Convert.uint8ToHex(valueBytes),
                textValue: Convert.uint8ToUtf8(valueBytes),
            });
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                scopedMetadataKey,
                mosaicId,
                valueBytes.length,
                valueBytes,
                NetworkType.TEST_NET,
                UInt64.fromUint(1_000_000),
                undefined,
                account.publicAccount,
            );

            const networkConfig = new NetworkConfigurationModel();
            Object.assign(networkConfig, { epochAdjustment });
            store.getters['network/networkConfiguration'] = networkConfig;

            // act
            const view = new ViewMosaicMetadataTransaction(store, mosaicMetadataTransaction);

            // assert
            expect(view).toBeDefined();
            expect(view.transaction).toBeDefined();
            expect(view.detailItems).toEqual([
                { key: 'sender', value: account.address.plain(), isAddress: true },
                { key: 'target', value: account.address.plain(), isAddress: true },
                { key: 'mosaic', value: mosaicId.toHex() },
                { key: 'value_size_delta', value: valueBytes.length },
                { key: 'value', value: metadataValue },
                { key: 'scoped_metadata_key', value: scopedMetadataKey.toHex() },
            ]);
        });
    });
});
