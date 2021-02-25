import {
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime,
    RentalFees, ServerInfo, StorageInfo,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {
    OfflineNetworkProperties,
    OfflineNodeInfo,
    OfflineStorageInfo,
    OfflineTransactionFees
} from "@/services/offline/MockModels";


export class OfflineNodeRepository implements NodeRepository {
    getNodeHealth(): Observable<NodeHealth> {
        throw new Error(`OfflineNodeRepository: getNodeHealth not implemented`);
    }

    getNodeInfo(): Observable<NodeInfo> {
        return of(OfflineNodeInfo);
    }

    getNodePeers(): Observable<NodeInfo[]> {
        return of([]);
    }

    getNodeTime(): Observable<NodeTime> {
        throw new Error(`OfflineNodeRepository: getNodeTime not implemented`);
    }

    getServerInfo(): Observable<ServerInfo> {
        throw new Error(`OfflineNodeRepository: getServerInfo not implemented`);
    }

    getStorageInfo(): Observable<StorageInfo> {
        return of(OfflineStorageInfo);
    }

    getUnlockedAccount(): Observable<string[]> {
        throw new Error(`OfflineNodeRepository: getUnlockedAccount not implemented`);
    }

}
