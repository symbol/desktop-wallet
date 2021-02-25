import {
    Address, MerkleStateInfo,
    MultisigAccountGraphInfo, MultisigAccountInfo,
    MultisigRepository,
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime,
    RentalFees, ServerInfo, StorageInfo,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {
    OfflineMultisigAccountGraphInfo,
    OfflineNetworkProperties,
    OfflineNodeInfo,
    OfflineStorageInfo,
    OfflineTransactionFees
} from "@/services/offline/MockModels";


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
