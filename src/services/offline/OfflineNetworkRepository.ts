import { NetworkConfiguration, NetworkName, NetworkRepository, NetworkType, RentalFees, TransactionFees } from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { OfflineNetworkProperties, OfflineRentalFees, OfflineTransactionFees } from '@/services/offline/MockModels';

export class OfflineNetworkRepository implements NetworkRepository {
    constructor(private readonly networkType: NetworkType) {}

    getNetworkName(): Observable<NetworkName> {
        throw new Error(`OfflineNetworkRepository: getNetworkName not implemented`);
    }

    getNetworkProperties(): Observable<NetworkConfiguration> {
        return of(OfflineNetworkProperties[this.networkType]);
    }

    getNetworkType(): Observable<NetworkType> {
        return of(this.networkType);
    }

    getRentalFees(): Observable<RentalFees> {
        return of(OfflineRentalFees);
    }

    getTransactionFees(): Observable<TransactionFees> {
        return of(OfflineTransactionFees);
    }
}
