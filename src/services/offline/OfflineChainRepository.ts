import {
    ChainInfo,
    ChainRepository,
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime,
    RentalFees, ServerInfo, StorageInfo,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {
    OfflineChainInfo,
    OfflineNetworkProperties,
    OfflineNodeInfo,
    OfflineTransactionFees
} from "@/services/offline/MockModels";


export class OfflineChainRepository implements ChainRepository {
    getChainInfo(): Observable<ChainInfo> {
        return of(OfflineChainInfo);
    }

}
