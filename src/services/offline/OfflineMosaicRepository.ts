import {
    MerkleStateInfo,
    MosaicId, MosaicInfo,
    MosaicRepository, MosaicSearchCriteria,
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime, Page, PaginationStreamer,
    RentalFees, ServerInfo, StorageInfo, Transaction,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {
    OfflineNetworkProperties,
    OfflineNodeInfo,
    OfflineStorageInfo,
    OfflineTransactionFees
} from "@/services/offline/MockModels";


export class OfflineMosaicRepository implements MosaicRepository {
    getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        throw new Error(`OfflineMosaicRepository: getMosaic not implemented`);
    }

    getMosaicMerkle(mosaicId: MosaicId): Observable<MerkleStateInfo> {
        throw new Error(`OfflineMosaicRepository: getMosaicMerkle not implemented`);
    }

    getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]> {
        throw new Error(`OfflineMosaicRepository: getMosaics not implemented`);
    }

    search(criteria: MosaicSearchCriteria): Observable<Page<MosaicInfo>> {
        return of(new Page<MosaicInfo>([], criteria.pageNumber, criteria.pageSize));
    }

    streamer(): PaginationStreamer<MosaicInfo, MosaicSearchCriteria> {
        throw new Error(`OfflineMosaicRepository: streamer not implemented`);
    }

}
