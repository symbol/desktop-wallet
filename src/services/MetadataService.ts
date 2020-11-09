/**
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { 
    Address, 
    MetadataType, 
    RepositoryFactory, 
    RepositoryFactoryHttp,
    AccountMetadataTransaction, 
    TransactionService,
} from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MetadataModel } from '@/core/database/entities/MetadataModel';
import { ObservableHelpers } from '@/core/utils/ObservableHelpers';
import { MetadataModelStorage } from '@/core/database/storage/MetadataModelStorage';

/**
 * The service in charge of loading and caching anything related to Metadata from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */

export class MetadataService {
    /**
     * The metadata information local cache.
     */
    private readonly metadataModelStorage = MetadataModelStorage.INSTANCE;

    /**
     * This method loads and caches the metadata information for the given accounts.
     * The returned Observable will announce the cached information first, then the rest returned
     * information (if possible).
     *
     * @param repositoryFactory the repository factory
     * @param generationHash the current network generation hash.
     * @param address the current address.
     */
    public getMetadataList(
        repositoryFactory: RepositoryFactory,
        generationHash: string,
        address: Address,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        metadataType: MetadataType,
    ): Observable<MetadataModel[]> {
        if (!address) {
            return of([]);
        }

        const metadataModelList = this.metadataModelStorage.get(generationHash) || [];
        const metadataRepository = repositoryFactory.createMetadataRepository();
        const searchCriteria = {targetAddress: address, metadataType: metadataType};

        return metadataRepository
            .search(searchCriteria)
            .pipe(map((metadatasPage) => metadatasPage.data.map((metadata) => new MetadataModel(metadata))))
            .pipe(
                tap((d: MetadataModel[]) => this.metadataModelStorage.set(generationHash, d)),
                ObservableHelpers.defaultFirst(metadataModelList),
            );
    }
}
