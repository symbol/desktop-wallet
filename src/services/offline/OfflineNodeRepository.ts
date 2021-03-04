import { NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime, ServerInfo, StorageInfo } from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { OfflineNodeInfo, OfflineStorageInfo } from '@/services/offline/MockModels';

export class OfflineNodeRepository implements NodeRepository {
    constructor(private readonly networkType: NetworkType) {}

    getNodeHealth(): Observable<NodeHealth> {
        throw new Error(`OfflineNodeRepository: getNodeHealth not implemented`);
    }

    getNodeInfo(): Observable<NodeInfo> {
        return of(OfflineNodeInfo(this.networkType));
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
