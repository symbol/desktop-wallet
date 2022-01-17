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
import { TransactionFilterOptionsState, TransactionState } from '@/store/Transaction';
import { TransactionFilterService } from '@/services/TransactionFilterService';
import { getTestAccount } from '@MOCKS/Accounts';
import { TransferTransaction } from 'symbol-sdk';
import { addressBookMock } from '@MOCKS/AddressBookMock';
import { IContact } from 'symbol-address-book';

const currentSigner = getTestAccount('remoteTestnet');
const recipient = getTestAccount('remoteTestnetRecipient');
const sentTransaction = {
    signer: currentSigner,
    recipientAddress: {
        address: currentSigner.address.plain(),
    },
};
const receivedTransaction = {
    signer: recipient,
    recipientAddress: {
        address: recipient.address.plain(),
    },
};
const receivedTransaction2 = {
    signer: recipient,
    recipientAddress: {
        address: currentSigner.address.plain(),
    },
};

const transactionState: TransactionState = {
    initialized: false,
    isFetchingTransactions: false,
    transactions: [
        (sentTransaction as unknown) as TransferTransaction,
        (receivedTransaction as unknown) as TransferTransaction,
        (receivedTransaction2 as unknown) as TransferTransaction,
    ],
    filteredTransactions: [],
    confirmedTransactions: [(sentTransaction as unknown) as TransferTransaction],
    unconfirmedTransactions: [(receivedTransaction as unknown) as TransferTransaction],
    partialTransactions: [],
    filterOptions: new TransactionFilterOptionsState(),
    currentConfirmedPage: { pageNumber: 1, isLastPage: false },
    isBlackListFilterActivated: false,
};

describe('services/TransactionFilterService', () => {
    describe('filter()', () => {
        test('should return all with all selected/unselected', async (done) => {
            const result = TransactionFilterService.filter(transactionState, currentSigner.address.plain(), undefined);

            transactionState.filterOptions.isSentSelected = true;
            transactionState.filterOptions.isUnconfirmedSelected = true;
            transactionState.filterOptions.isPartialSelected = true;

            expect(result.length).toBe(3);
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

        test('should return transactions only received from blacklisted contacts', async (done) => {
            const addressBook = addressBookMock;
            const contact1: IContact = {
                id: '5c9093c7-2da2-476e-bc28-87f24a83cd23',
                address: recipient.address.plain(),
                name: 'BlackListed',
                phone: '+34 000000000',
                isBlackListed: true,
            };
            addressBook.addContact(contact1);
            transactionState.filterOptions = new TransactionFilterOptionsState();
            transactionState.filterOptions.isReceivedSelected = true;
            const result = TransactionFilterService.filter(
                transactionState,
                currentSigner.address.plain(),
                addressBook.getBlackListedContacts(),
            );
            expect(result.length).toBe(1);
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

            expect(result.length).toBe(3);
            done();
        });
    });
});
