import {
    MerkleStateInfo,
    Metadata,
    MetadataRepository, MetadataSearchCriteria,
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime, Page, PaginationStreamer,
    RentalFees, ServerInfo, StorageInfo, Transaction,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {OfflineNetworkProperties, OfflineNodeInfo, OfflineTransactionFees} from "@/services/offline/MockModels";


export class OfflineMetadataRepository implements MetadataRepository {

    getMetadata(compositeHash: string): Observable<Metadata> {
        throw new Error(`OfflineMetadataRepository: getMetadata not implemented`);
    }

    getMetadataMerkle(compositeHash: string): Observable<MerkleStateInfo> {
        throw new Error(`OfflineMetadataRepository: getMetadataMerkle not implemented`);
    }

    search(criteria: MetadataSearchCriteria): Observable<Page<Metadata>> {
        return of(new Page<Metadata>([], criteria.pageNumber, criteria.pageSize));
    }

    streamer(): PaginationStreamer<Metadata, MetadataSearchCriteria> {
        throw new Error(`OfflineMetadataRepository: streamer not implemented`);
    }

}
