/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Address,
    AggregateTransaction,
    CosignatureSignedTransaction,
    FinalizedBlock,
    IListener,
    NamespaceId,
    NewBlock,
    Transaction,
    TransactionStatusError,
} from 'symbol-sdk';
import { Observable } from 'rxjs';

export class OfflineListener implements IListener {
    url = 'mock';

    aggregateBondedAdded(
        unresolvedAddress: Address | NamespaceId,
        transactionHash?: string,
        subscribeMultisig?: boolean,
    ): Observable<AggregateTransaction> {
        return new Observable();
    }

    aggregateBondedRemoved(
        unresolvedAddress: Address | NamespaceId,
        transactionHash?: string,
        subscribeMultisig?: boolean,
    ): Observable<string> {
        return new Observable();
    }

    close(): void {
        return;
    }

    confirmed(unresolvedAddress: Address | NamespaceId, transactionHash?: string, subscribeMultisig?: boolean): Observable<Transaction> {
        return new Observable();
    }

    cosignatureAdded(unresolvedAddress: Address | NamespaceId, subscribeMultisig?: boolean): Observable<CosignatureSignedTransaction> {
        return new Observable();
    }

    finalizedBlock(): Observable<FinalizedBlock> {
        return new Observable();
    }

    isOpen(): boolean {
        return true;
    }

    newBlock(): Observable<NewBlock> {
        return new Observable();
    }

    open(): Promise<void> {
        return Promise.resolve();
    }

    status(unresolvedAddress: Address | NamespaceId, transactionHash?: string): Observable<TransactionStatusError> {
        return new Observable();
    }

    unconfirmedAdded(
        unresolvedAddress: Address | NamespaceId,
        transactionHash?: string,
        subscribeMultisig?: boolean,
    ): Observable<Transaction> {
        return new Observable();
    }

    unconfirmedRemoved(
        unresolvedAddress: Address | NamespaceId,
        transactionHash?: string,
        subscribeMultisig?: boolean,
    ): Observable<string> {
        return new Observable();
    }
}
