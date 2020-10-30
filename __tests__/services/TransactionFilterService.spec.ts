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
import { TransactionFilterOptionsState, TransactionState } from '@/store/Transaction';
import { TransactionFilterService } from '@/services/TransactionFilterService';
import { getTestAccount } from '@MOCKS/Accounts';
import { TransferTransaction } from 'symbol-sdk';

const currentSigner = getTestAccount('remoteTestnet');
const recepient = getTestAccount('remoteMijin');
const sentTransaction = {
    signer: currentSigner,
    recipientAddress: {
        address: currentSigner.address.plain(),
    },
};
const receivedTransaction = {
    signer: recepient,
    recipientAddress: {
        address: currentSigner.address.plain(),
    },
};

const transactionState: TransactionState = {
    initialized: false,
    isFetchingTransactions: false,
    transactions: [(sentTransaction as unknown) as TransferTransaction, (receivedTransaction as unknown) as TransferTransaction],
    filteredTransactions: [],
    confirmedTransactions: [(sentTransaction as unknown) as TransferTransaction],
    unconfirmedTransactions: [(receivedTransaction as unknown) as TransferTransaction],
    partialTransactions: [],
    filterOptions: new TransactionFilterOptionsState(),
    currentConfirmedPage: { pageNumber: 1, isLastPage: false },
};

describe('services/TransactionFilterService', () => {
    describe('filter()', () => {
        test('should return all with all selected/unselected', async (done) => {
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            transactionState.filterOptions.isSentSelected = true;
            transactionState.filterOptions.isUnconfirmedSelected = true;
            transactionState.filterOptions.isPartialSelected = true;

            expect(result.length).toBe(2);
            done();
        });

        test('should return correct confirmed transactions', async (done) => {
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isConfirmedSelected = true;
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(1);
            expect(result[0]).toBe(sentTransaction);
            done();
        });

        test('should return correct unconfirmed and confirmed transactions', async (done) => {
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isUnconfirmedSelected = true;
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(1);
            expect(result[0]).toBe(receivedTransaction);
            done();
        });

        test('should return correct partial transactions', async (done) => {
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isPartialSelected = true;
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(0);
            done();
        });

        test('should return correct sent transactions', async (done) => {
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isSentSelected = true;
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(1);
            expect(result[0]).toBe(sentTransaction);

            done();
        });

        test('should return correct received transactions', async (done) => {
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isReceivedSelected = true;
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(2);
            done();
        });

        test('should return correct transactions on multiple criterias', async (done) => {
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isConfirmedSelected = true;
            transactionState.filterOptions.isUnconfirmedSelected = true;
            let result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(2);

            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isSentSelected = true;
            transactionState.filterOptions.isReceivedSelected = true;

            result = TransactionFilterService.filter(transactionState, currentSigner.address.plain());

            expect(result.length).toBe(2);
            done();
        });
    });
});
