import {
    AccountInfo,
    AccountRepository, AccountSearchCriteria, Address, MerkleStateInfo,
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType, NodeHealth, NodeInfo, NodeRepository, NodeTime, Page, PaginationStreamer,
    RentalFees, ServerInfo, StorageInfo,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {
    OfflineAccountInfo,
    OfflineNetworkProperties,
    OfflineNodeInfo,
    OfflineTransactionFees
} from "@/services/offline/MockModels";


export class OfflineAccountRepository implements AccountRepository {

    getAccountInfo(address: Address): Observable<AccountInfo> {
        return of(OfflineAccountInfo(address));
    }

    getAccountInfoMerkle(address: Address): Observable<MerkleStateInfo> {
        throw new Error(`OfflineAccountRepository: getAccountInfoMerkle not implemented`);
    }

    getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
        return of(addresses.map(OfflineAccountInfo));
    }

    search(criteria: AccountSearchCriteria): Observable<Page<AccountInfo>> {
        throw new Error(`OfflineAccountRepository: search not implemented`);
    }

    streamer(): PaginationStreamer<AccountInfo, AccountSearchCriteria> {
        throw new Error(`OfflineAccountRepository: streamer not implemented`);
    }

}
