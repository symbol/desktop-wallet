/**
 *
 * Copyright 2020 for NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// external dependencies
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';
import i18n from '@/language';
import { AccountOperationRestrictionTransaction, OperationRestrictionFlag } from 'symbol-sdk';
// internal dependencies
import { TransactionView } from './TransactionView';

export class ViewAccountOperationRestrictionTransaction extends TransactionView<AccountOperationRestrictionTransaction> {
    /**
     * Displayed sender
     * @var {string}
     */
    private get sender(): string {
        if (this.transaction.signer) {
            return this.transaction.signer.address.pretty();
        }
        const currentSignerAddress = this.$store.getters['account/currentSignerAddress'];
        return currentSignerAddress ? currentSignerAddress.pretty() : '';
    }

    /**
     * Displayed items
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        return [
            { key: 'sender', value: this.sender },
            // @ts-ignore
            {
                key: 'Restriction Additions',
                value: this.transaction.restrictionAdditions.map((tt) => i18n.t(`transaction_descriptor_${tt}`)).join('\n') || '-',
            },
            {
                key: 'Restriction Deletions',
                value: this.transaction.restrictionDeletions.map((tt) => i18n.t(`transaction_descriptor_${tt}`)).join('\n') || '-',
            },
            { key: 'Restriction Flag', value: OperationRestrictionFlag[this.transaction.restrictionFlags] },
        ];
    }
}
