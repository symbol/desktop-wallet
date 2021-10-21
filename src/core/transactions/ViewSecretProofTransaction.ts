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
import { SecretProofTransaction } from 'symbol-sdk';
// internal dependencies
import { TransactionView } from './TransactionView';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';

export class ViewSecretProofTransaction extends TransactionView<SecretProofTransaction> {
    /**
     * Displayed items
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        return [
            { key: 'transfer_target', value: this.transaction.recipientAddress, isAddress: true },
            { key: 'deadline', value: this.transaction.deadline },
            {
                key: 'secret',
                value: this.transaction.secret,
            },
            {
                key: 'lock_hash_algorithm',
                value: this.transaction.hashAlgorithm,
            },
            {
                key: 'proof',
                value: this.transaction.proof,
            },
        ];
    }
}
