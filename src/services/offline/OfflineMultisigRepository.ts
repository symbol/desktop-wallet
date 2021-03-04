/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address, MerkleStateInfo, MultisigAccountGraphInfo, MultisigAccountInfo, MultisigRepository } from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { OfflineMultisigAccountGraphInfo } from '@/services/offline/MockModels';

export class OfflineMultisigRepository implements MultisigRepository {
    getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo> {
        return of(OfflineMultisigAccountGraphInfo);
    }

    getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
        throw new Error(`OfflineMultisigRepository: getMultisigAccountInfo not implemented`);
    }

    getMultisigAccountInfoMerkle(address: Address): Observable<MerkleStateInfo> {
        throw new Error(`OfflineMultisigRepository: getMultisigAccountInfoMerkle not implemented`);
    }
}
