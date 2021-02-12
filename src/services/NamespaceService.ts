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

import { NamespaceModel } from '@/core/database/entities/NamespaceModel';
import { Address, NamespaceName, RepositoryFactory } from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { TimeHelpers } from '@/core/utils/TimeHelpers';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { NamespaceModelStorage } from '@/core/database/storage/NamespaceModelStorage';

/**
 * The service in charge of loading and caching anything related to Namepsaces from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */
export class NamespaceService {
    /**
     * The namespace information local cache.
     */
    private readonly namespaceModelStorage = NamespaceModelStorage.INSTANCE;

    /**
     * This method loads and caches the namespace information for the given accounts.
     * The returned Observable will announce the cached information first, then the rest returned
     * information (if possible).
     *
     * @param repositoryFactory the repository factory
     * @param generationHash the current network generation hash.
     * @param addresses the current addresses.
     */
    public getNamespaces(
        repositoryFactory: RepositoryFactory,
        address: Address,
        { pageSize, pageNumber }: { pageSize: number; pageNumber: number } = {
            pageSize: 20,
            pageNumber: 1,
        },
    ): Observable<{ models: NamespaceModel[]; pageInfo: { pageNumber: number; isLastPage: boolean } }> {
        if (!address) {
            return of({ models: [], pageInfo: { pageNumber: 1, isLastPage: true } });
        }

        const namespaceRepository = repositoryFactory.createNamespaceRepository();

        return namespaceRepository.search({ ownerAddress: address, pageSize, pageNumber }).pipe(
            flatMap((namespaceInfos) => {
                return namespaceRepository
                    .getNamespacesNames(namespaceInfos.data.map((info) => info.id))
                    .pipe(
                        map((names) => {
                            return namespaceInfos.data.map((namespaceInfo) => {
                                const reference = _.first(names.filter((n) => n.namespaceId.toHex() === namespaceInfo.id.toHex()));
                                return new NamespaceModel(namespaceInfo, NamespaceService.getFullNameFromNamespaceNames(reference, names));
                            });
                        }),
                    )
                    .pipe(
                        map((models) => {
                            return {
                                models,
                                pageInfo: {
                                    pageNumber: namespaceInfos.pageNumber,
                                    isLastPage: namespaceInfos.isLastPage,
                                },
                            };
                        }),
                    );
            }),
        );
    }

    public static getExpiration(
        networkConfiguration: NetworkConfigurationModel,
        currentHeight: number,
        endHeight: number,
    ): { expiration: string; expired: boolean } {
        const blockGenerationTargetTime = networkConfiguration.blockGenerationTargetTime;
        const namespaceGracePeriodBlocks = Math.floor(networkConfiguration.namespaceGracePeriodDuration / blockGenerationTargetTime);
        const expired = currentHeight > endHeight - namespaceGracePeriodBlocks;
        const expiredIn = endHeight - namespaceGracePeriodBlocks - currentHeight;
        const deletedIn = endHeight - currentHeight;
        const expiration = expired
            ? TimeHelpers.durationToRelativeTime(expiredIn, blockGenerationTargetTime)
            : TimeHelpers.durationToRelativeTime(deletedIn, blockGenerationTargetTime);
        return { expired, expiration };
    }

    /**
     * Constructs a namespace fullName from namespace names
     * @static
     * @param {NamespaceName} reference
     * @param {NamespaceName[]} namespaceNames
     * @returns the full namespace name.
     */
    public static getFullNameFromNamespaceNames(reference: NamespaceName, namespaceNames: NamespaceName[]): string {
        if (!reference) {
            return '';
        }
        if (!reference.parentId) {
            return reference.name;
        }

        const parent = namespaceNames.find((namespaceName) => namespaceName.namespaceId.toHex() === reference.parentId.toHex());
        if (parent === undefined) {
            return reference.name;
        }
        const parentName = NamespaceService.getFullNameFromNamespaceNames(parent, namespaceNames);
        return `${parentName}.${reference.name}`;
    }
}
