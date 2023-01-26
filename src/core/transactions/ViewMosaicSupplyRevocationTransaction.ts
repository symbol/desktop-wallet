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
import { MosaicSupplyRevocationTransaction } from 'symbol-sdk';
// internal dependencies
import { TransactionView } from './TransactionView';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';
import { AttachedMosaic } from '@/services/MosaicService';

export class ViewMosaicSupplyRevocationTransaction extends TransactionView<MosaicSupplyRevocationTransaction> {
    /**
     * Displayed items
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        const color = this.isMosaicOwner ? 'green' : 'red';
        const attachedMosaic: AttachedMosaic = {
            id: this.transaction.mosaic.id,
            mosaicHex: this.transaction.mosaic.id.toHex(),
            amount: this.transaction.mosaic.amount.compact(),
        };
        return [
            { key: 'reclaim_source', value: this.transaction.sourceAddress, isAddress: true },
            { key: 'reclaim_target', value: this.transaction.signer.address.plain(), isAddress: true },
            {
                key: 'mosaics',
                value: { ...attachedMosaic, color },
                isMosaic: true,
            },
        ];
    }

    private get isMosaicOwner() {
        const currentSignerAddress = this.$store.getters['account/currentSignerAddress'];
        return currentSignerAddress && currentSignerAddress.equals(this.transaction.signer.address);
    }
}
