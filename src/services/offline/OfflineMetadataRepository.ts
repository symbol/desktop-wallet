/* eslint-disable @typescript-eslint/no-unused-vars */
import { MerkleStateInfo, Metadata, MetadataRepository, MetadataSearchCriteria, Page, PaginationStreamer } from 'symbol-sdk';
import { Observable, of } from 'rxjs';

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
