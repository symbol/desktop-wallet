/* eslint-disable @typescript-eslint/no-unused-vars */
import { MerkleStateInfo, MosaicId, MosaicInfo, MosaicRepository, MosaicSearchCriteria, Page, PaginationStreamer } from 'symbol-sdk';
import { Observable, of } from 'rxjs';

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
