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
// external dependencies
import { Address, MultisigAccountModificationTransaction } from 'symbol-sdk';
// internal dependencies
import { TransactionView } from './TransactionView';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';
import i18n from '@/language';

// eslint-disable-next-line max-len
export class ViewMultisigAccountModificationTransaction extends TransactionView<MultisigAccountModificationTransaction> {
    protected resolveDetailItems(): TransactionDetailItem[] {
        // get data from view values
        const minApprovalDelta = this.transaction.minApprovalDelta;
        const minRemovalDelta = this.transaction.minRemovalDelta;
        const addressAdditions = this.transaction.addressAdditions;
        const addressDeletions = this.transaction.addressDeletions;

        // push approval and removal deltas to view items
        const items = [
            { key: 'minApprovalDelta', value: `${minApprovalDelta}` },
            { key: 'minRemovalDelta', value: `${minRemovalDelta}` },
        ];

        // render views for public key additions and deletions
        const additions = addressAdditions.map((address, index, self) => {
            return {
                key: `${i18n.t('public_key_addition')} (${index + 1}/${self.length})`,
                value: (address as Address).pretty(),
            };
        });

        const deletions = addressDeletions.map((address, index, self) => {
            return {
                key: `${i18n.t('public_key_deletion')} (${index + 1}/${self.length})`,
                value: (address as Address).pretty(),
            };
        });

        return [...items, ...additions, ...deletions];
    }
}
