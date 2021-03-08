/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CosignatureSignedTransaction,
    Page,
    PaginationStreamer,
    SignedTransaction,
    Transaction,
    TransactionAnnounceResponse,
    TransactionGroup,
    TransactionRepository,
    TransactionSearchCriteria,
} from 'symbol-sdk';
import { Observable, of } from 'rxjs';

export class OfflineTransactionRepository implements TransactionRepository {
    announce(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        throw new Error(`OfflineNetworkRepository: announce not implemented`);
    }

    announceAggregateBonded(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        throw new Error(`OfflineNetworkRepository: announceAggregateBonded not implemented`);
    }

    announceAggregateBondedCosignature(
        cosignatureSignedTransaction: CosignatureSignedTransaction,
    ): Observable<TransactionAnnounceResponse> {
        throw new Error(`OfflineNetworkRepository: announceAggregateBondedCosignature not implemented`);
    }

    getTransaction(transactionId: string, transactionGroup: TransactionGroup): Observable<Transaction> {
        throw new Error(`OfflineNetworkRepository: getTransaction not implemented`);
    }

    getTransactionEffectiveFee(transactionId: string): Observable<number> {
        throw new Error(`OfflineNetworkRepository: getTransactionEffectiveFee not implemented`);
    }

    getTransactionsById(transactionIds: string[], transactionGroup: TransactionGroup): Observable<Transaction[]> {
        throw new Error(`OfflineNetworkRepository: getTransactionsById not implemented`);
    }

    search(criteria: TransactionSearchCriteria): Observable<Page<Transaction>> {
        return of(new Page<Transaction>([], criteria.pageNumber, criteria.pageSize));
    }

    streamer(): PaginationStreamer<Transaction, TransactionSearchCriteria> {
        throw new Error(`OfflineNetworkRepository: streamer not implemented`);
    }
}
