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
import { AccountAddressRestrictionTransaction, Address, AddressRestrictionFlag } from 'symbol-sdk';

// internal dependencies
import { TransactionView } from './TransactionView';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';

export class ViewAccountAddressRestrictionTransaction extends TransactionView<AccountAddressRestrictionTransaction> {
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
                value: this.transaction.restrictionAdditions.map((a) => (a instanceof Address ? a.pretty() : a.fullName)).join('\n') || '-',
            },
            {
                key: 'Restriction Deletions',
                value: this.transaction.restrictionDeletions.map((a) => (a instanceof Address ? a.pretty() : a.fullName)).join('\n') || '-',
            },
            { key: 'Restriction Flag', value: AddressRestrictionFlag[this.transaction.restrictionFlags] },
        ];
    }
}
