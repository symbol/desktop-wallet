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
    Transaction,
    NetworkType,
    Deadline,
    UInt64,
    KeyGenerator,
    MosaicId,
    NamespaceId,
    MetadataTransactionService,
    MetadataSearchCriteria,
    Crypto,
} from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetadataModel } from '@/core/database/entities/MetadataModel';
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
    public getMetadataList(repositoryFactory: RepositoryFactory, generationHash: string, address: Address): Observable<MetadataModel[]> {
        if (!address) {
            return of([]);
        }

        const metadataRepository = repositoryFactory.createMetadataRepository();
        const searchCriteria: MetadataSearchCriteria = { targetAddress: address };

        return metadataRepository
            .search(searchCriteria)
            .pipe(map((metadataListPage) => metadataListPage.data.map((metadata) => new MetadataModel(metadata))));
    }

    /**
     * get metadata creation observable
     * @returns {Observable<Transaction>}
     */
    public metadataTransactionObserver(
        repositoryFactory: RepositoryFactory,
        deadline: Deadline,
        networkType: NetworkType,
        sourceAddress: Address,
        targetAddress: Address,
        value: string,
        targetId: string,
        metadataType: MetadataType,
        maxFee: UInt64,
    ): Observable<Transaction> {
        const scopedMetadataKey = KeyGenerator.generateUInt64Key(Crypto.randomBytes(8));

        const metadataRepository = repositoryFactory.createMetadataRepository();
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);

        let metadataObservable: Observable<Transaction> = null;

        if (metadataType === MetadataType.Account) {
            metadataObservable = metadataTransactionService.createAccountMetadataTransaction(
                deadline,
                networkType,
                targetAddress,
                scopedMetadataKey,
                value,
                sourceAddress,
                maxFee,
            );
        } else if (metadataType === MetadataType.Mosaic) {
            const mosaicId = new MosaicId(targetId);
            metadataObservable = metadataTransactionService.createMosaicMetadataTransaction(
                deadline,
                networkType,
                targetAddress,
                mosaicId,
                scopedMetadataKey,
                value,
                sourceAddress,
                maxFee,
            );
        } else {
            const namespaceId = new NamespaceId(targetId);
            metadataObservable = metadataTransactionService.createNamespaceMetadataTransaction(
                deadline,
                networkType,
                targetAddress,
                namespaceId,
                scopedMetadataKey,
                value,
                sourceAddress,
                maxFee,
            );
        }

        return metadataObservable;
    }

    /**
     * get metadata list by target id
     * @param metadataList
     * @param targetId MosaicId | NamespaceId
     */
    public static getMosaicMetadataByTargetId(metadataList: MetadataModel[], targetId: string) {
        return (metadataList && metadataList.filter((metadataModel) => metadataModel.targetId === targetId)) || [];
    }
}
