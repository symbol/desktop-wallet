/*
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

import { networkConfig } from '@/config';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { NetworkModel } from '@/core/database/entities/NetworkModel';
import { NetworkModelStorage } from '@/core/database/storage/NetworkModelStorage';
import { NetworkConfigurationHelpers } from '@/core/utils/NetworkConfigurationHelpers';
import { ObservableHelpers } from '@/core/utils/ObservableHelpers';
import { URLHelpers } from '@/core/utils/URLHelpers';
import { combineLatest, defer, EMPTY, from, Observable } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { NetworkConfiguration, NetworkType, RepositoryFactory, RepositoryFactoryHttp } from 'symbol-sdk';
import { OfflineRepositoryFactory } from '@/services/offline/OfflineRepositoryFactory';

/**
 * The service in charge of loading and caching anything related to Network from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */
export class NetworkService {
    /**
     * The network information local cache.
     */
    private readonly storage = NetworkModelStorage.INSTANCE;

    /**
     * The best default Url. It uses the stored configuration if possible.
     */
    public getDefaultUrl(): string {
        const storedNetworkModel = this.storage.getLatest();
        return URLHelpers.formatUrl(storedNetworkModel && storedNetworkModel.url).url;
    }

    /**
     * This method get the network data from the provided URL. If the server in the candidateUrl is down,
     * the next available url will be used.
     *
     * @param nodeUrl
     * @param defaultNetworkType
     * @param isOffline
     */
    public getNetworkModel(
        nodeUrl: string,
        defaultNetworkType: NetworkType = NetworkType.TEST_NET,
        isOffline = false,
    ): Observable<{
        networkModel: NetworkModel;
        repositoryFactory: RepositoryFactory;
    }> {
        return from(this.createRepositoryFactory(nodeUrl, isOffline, defaultNetworkType)).pipe(
            flatMap(({ url, repositoryFactory }) => {
                return repositoryFactory.getGenerationHash().pipe(
                    flatMap((generationHash) => {
                        const networkRepository = repositoryFactory.createNetworkRepository();
                        const nodeRepository = repositoryFactory.createNodeRepository();
                        const networkTypeObservable = repositoryFactory
                            .getNetworkType()
                            .pipe(ObservableHelpers.defaultLast(defaultNetworkType));
                        const generationHashObservable = repositoryFactory.getGenerationHash();

                        const networkPropertiesObservable = networkRepository
                            .getNetworkProperties()
                            .pipe(map((d) => this.toNetworkConfigurationModel(d, defaultNetworkType)));
                        const nodeInfoObservable = nodeRepository.getNodeInfo();

                        const transactionFeesObservable = repositoryFactory.createNetworkRepository().getTransactionFees();

                        return combineLatest([
                            networkTypeObservable,
                            generationHashObservable,
                            networkPropertiesObservable,
                            nodeInfoObservable,
                            transactionFeesObservable,
                        ]).pipe(
                            map(([networkType, generationHash, networkProperties, nodeInfo, transactionFees]) => {
                                return {
                                    networkModel: new NetworkModel(
                                        url,
                                        networkType,
                                        generationHash,
                                        networkProperties,
                                        transactionFees,
                                        nodeInfo,
                                    ),
                                    repositoryFactory,
                                };
                            }),
                            tap((p) => this.storage.set(generationHash, p.networkModel)),
                        );
                    }),
                );
            }),
        );
    }

    private createRepositoryFactory(
        url: string,
        isOffline = false,
        networkType = NetworkType.TEST_NET,
    ): Observable<{ url: string; repositoryFactory: RepositoryFactory }> {
        // console.log(`Testing ${url}`);
        const repositoryFactory = NetworkService.createRepositoryFactory(url, isOffline, networkType);
        return defer(() => {
            return repositoryFactory.getGenerationHash();
        }).pipe(
            map(() => {
                // console.log(`Peer ${url} seems OK`);
                return { url, repositoryFactory };
            }),
            catchError((e) => {
                console.log(`Peer ${url} seems down. Ignoring. Error: ${e.message}`, e);
                return EMPTY;
            }),
        );
    }

    private toNetworkConfigurationModel(dto: NetworkConfiguration, networkType: NetworkType): NetworkConfigurationModel {
        const fileDefaults: NetworkConfigurationModel = networkConfig[networkType].networkConfigurationDefaults;
        const fromDto: NetworkConfigurationModel = {
            epochAdjustment: NetworkConfigurationHelpers.epochAdjustment(dto),
            maxMosaicDivisibility: NetworkConfigurationHelpers.maxMosaicDivisibility(dto),
            namespaceGracePeriodDuration: NetworkConfigurationHelpers.namespaceGracePeriodDuration(dto),
            lockedFundsPerAggregate: NetworkConfigurationHelpers.lockedFundsPerAggregate(dto),
            maxCosignatoriesPerAccount: NetworkConfigurationHelpers.maxCosignatoriesPerAccount(dto),
            blockGenerationTargetTime: NetworkConfigurationHelpers.blockGenerationTargetTime(dto),
            maxNamespaceDepth: NetworkConfigurationHelpers.maxNamespaceDepth(dto),
            maxMosaicDuration: NetworkConfigurationHelpers.maxMosaicDuration(dto),
            minNamespaceDuration: NetworkConfigurationHelpers.minNamespaceDuration(dto),
            maxNamespaceDuration: NetworkConfigurationHelpers.maxNamespaceDuration(dto),
            maxTransactionsPerAggregate: NetworkConfigurationHelpers.maxTransactionsPerAggregate(dto),
            maxCosignedAccountsPerAccount: NetworkConfigurationHelpers.maxCosignedAccountsPerAccount(dto),
            maxMessageSize: NetworkConfigurationHelpers.maxMessageSize(dto),
            maxMosaicAtomicUnits: NetworkConfigurationHelpers.maxMosaicAtomicUnits(dto),
            currencyMosaicId: NetworkConfigurationHelpers.currencyMosaicId(dto),
            harvestingMosaicId: NetworkConfigurationHelpers.harvestingMosaicId(dto),
            defaultDynamicFeeMultiplier: NetworkConfigurationHelpers.defaultDynamicFeeMultiplier(dto),
            totalChainImportance: NetworkConfigurationHelpers.totalChainImportance(dto),
        };
        return { ...fileDefaults, ...fromDto };
    }

    public reset(generationHash: string) {
        this.storage.remove(generationHash);
    }

    /**
     * It creates the RepositoryFactory used to build the http repository/clients and listeners.
     * @param url the url.
     */
    public static createRepositoryFactory(url: string, isOffline: boolean = false, networkType = NetworkType.TEST_NET): RepositoryFactory {
        return isOffline
            ? new OfflineRepositoryFactory(networkType)
            : new RepositoryFactoryHttp(url, {
                  websocketUrl: URLHelpers.httpToWsUrl(url) + '/ws',
                  websocketInjected: WebSocket,
              });
    }
}
