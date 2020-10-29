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

import { Transaction } from 'symbol-sdk';
import { TransactionFilterOptionsState, TransactionState } from '@/store/Transaction';

/**
 * TransactionFilter used for filtering transactions by group and sent status.
 */
export class TransactionFilter {
    /**
     * Filters transactions depends of selected filter options.
     * @param state for extracting transactions filter options and list filtered by group.
     * @param currentSignerAddress selected signer address
     */
    public static filter(state: TransactionState, currentSignerAddress: string): Transaction[] {
        const { filterOptions, transactions, confirmedTransactions, unconfirmedTransactions, partialTransactions } = state;
        if (!filterOptions.isFilterShouldBeApplied) {
            return [...transactions];
        }

        const mainFilterGroup = [filterOptions.isConfirmedSelected, filterOptions.isUnconfirmedSelected, filterOptions.isPartialSelected];
        // Indicates if all checkboxes in main group selected or unselected
        const areAllGroupResultsShown = mainFilterGroup.every((option) => option) || mainFilterGroup.every((option) => !option);

        let result: Transaction[] = areAllGroupResultsShown ? [...transactions] : [];

        if (!areAllGroupResultsShown) {
            if (filterOptions.isConfirmedSelected) {
                result = result.concat(confirmedTransactions);
            }
            if (filterOptions.isUnconfirmedSelected) {
                result = result.concat(unconfirmedTransactions);
            }
            if (filterOptions.isPartialSelected) {
                result = result.concat(partialTransactions);
            }
        }

        return this.filterByRecepient(result, filterOptions, currentSignerAddress);
    }

    /**
     * Filters transactions depends of selected sent status filter options.
     * @param transactions
     * @param filterOptions
     * @param currentSignerAddress selected signer address
     */
    private static filterByRecepient(
        transactions: Transaction[],
        filterOptions: TransactionFilterOptionsState,
        currentSignerAddress: string,
    ): Transaction[] {
        const recepientFilterOptions = [filterOptions.isSentSelected, filterOptions.isReceivedSelected];
        const areAllShouldBeShown: boolean = recepientFilterOptions.every((option) => !option);
        if (areAllShouldBeShown) {
            return transactions;
        }

        const areAllWithRecepientShouldBeShown: boolean = recepientFilterOptions.every((option) => option);
        if (areAllWithRecepientShouldBeShown) {
            return transactions.filter((transaction) => {
                return (transaction as any).recipientAddress && (transaction as any).recipientAddress.address;
            });
        }

        return transactions.filter((transaction) => {
            if ((transaction as any).recipientAddress && (transaction as any).recipientAddress.address) {
                if (filterOptions.isSentSelected) {
                    return (transaction as any).recipientAddress.address !== currentSignerAddress;
                }

                if (filterOptions.isReceivedSelected) {
                    return (transaction as any).recipientAddress.address === currentSignerAddress;
                }
            }
        });
    }
}
