import {
    NetworkConfiguration,
    NetworkName,
    NetworkRepository,
    NetworkType,
    RentalFees,
    TransactionFees
} from "symbol-sdk";
import {Observable, of} from "rxjs";
import {OfflineNetworkProperties, OfflineRentalFees, OfflineTransactionFees} from "@/services/offline/MockModels";


export class
OfflineNetworkRepository implements NetworkRepository {
    getNetworkName(): Observable<NetworkName> {
        throw new Error(`OfflineNetworkRepository: getNetworkName not implemented`);
    }

    getNetworkProperties(): Observable<NetworkConfiguration> {
        return of(OfflineNetworkProperties);
    }

    getNetworkType(): Observable<NetworkType> {
        return of(NetworkType.TEST_NET);
    }

    getRentalFees(): Observable<RentalFees> {
        return of(OfflineRentalFees);
    }

    getTransactionFees(): Observable<TransactionFees> {
        return of(OfflineTransactionFees);
    }

}
