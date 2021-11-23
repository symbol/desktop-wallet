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

import { NetworkType, NodeInfo, RepositoryFactory } from 'symbol-sdk';
import { ObservableHelpers } from '@/core/utils/ObservableHelpers';
import { map, tap } from 'rxjs/operators';
import { NodeModel } from '@/core/database/entities/NodeModel';
import * as _ from 'lodash';
import { networkConfig } from '@/config';
import { NodeModelStorage } from '@/core/database/storage/NodeModelStorage';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import fetch from 'node-fetch';
import { Configuration, NodeApi, NodeListFilter, NodeInfo as NodeApiNodeInfo } from 'symbol-statistics-service-typescript-fetch-client';

/**
 * The service in charge of loading and caching anything related to Node and Peers from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */
export class NodeService {
    /**
     * The peer information local cache.
     */
    private readonly storage = NodeModelStorage.INSTANCE;

    public getKnownNodesOnly(profile: ProfileModel): NodeModel[] {
        const profileNode = this.loadNodes(profile);
        return _.uniqBy(profileNode, 'url').filter((n) => n.networkType === profile.networkType);
    }

    public async getNodes(
        profile: ProfileModel,
        repositoryFactory: RepositoryFactory,
        repositoryFactoryUrl: string,
        isOffline?: boolean,
    ): Promise<NodeModel[]> {
        const storedNodes = this.getKnownNodesOnly(profile);
        const statisticsNodes = !isOffline ? await this.getNodesFromStatisticService(profile.networkType) : [];
        const nodeRepository = repositoryFactory.createNodeRepository();
        return nodeRepository
            .getNodeInfo()
            .pipe(
                map((dto: NodeInfo) =>
                    this.createNodeModel(
                        repositoryFactoryUrl,
                        profile.networkType,
                        dto.friendlyName,
                        undefined,
                        dto.publicKey,
                        dto.nodePublicKey,
                    ),
                ),
                ObservableHelpers.defaultLast(this.createNodeModel(repositoryFactoryUrl, profile.networkType)),
                map((currentNode) => _.uniqBy([currentNode, ...storedNodes], 'url')),
                tap((p) => this.saveNodes(profile, p)),
            )
            .toPromise()
            .then((val) => (statisticsNodes && statisticsNodes.length ? _.uniqBy(val.concat([...statisticsNodes]), 'url') : val));
    }

    public async getNodesFromStatisticService(networkType: NetworkType, isOffline?: boolean): Promise<NodeModel[]> {
        const nodeSearchCriteria = {
            nodeFilter: NodeListFilter.Suggested,
            limit: 30,
            ssl: true,
        };
        if (!isOffline && navigator.onLine) {
            try {
                const nodeInfos = await this.createStatisticServiceRestClient(networkConfig[networkType].statisticServiceUrl).getNodes(
                    nodeSearchCriteria.nodeFilter,
                    nodeSearchCriteria.limit,
                    nodeSearchCriteria.ssl,
                );
                if (!nodeInfos) {
                    return undefined;
                }
                return nodeInfos.map((n) =>
                    this.createNodeModel(
                        n.apiStatus?.restGatewayUrl,
                        networkType,
                        n.friendlyName,
                        true,
                        n.publicKey,
                        n.apiStatus?.nodePublicKey,
                        n.apiStatus.webSocket.url,
                    ),
                );
            } catch (error) {
                // proceed to return
            }
        }
        return undefined;
    }

    private async getNodeModelByMethod(
        networkType: NetworkType,
        nodeGetter: (param: string) => Promise<NodeApiNodeInfo>,
        paramValue: string,
    ): Promise<NodeModel> {
        try {
            const nodeInfo = await nodeGetter(paramValue);
            if (!nodeInfo) {
                return undefined;
            }
            return this.createNodeModel(
                nodeInfo.apiStatus?.restGatewayUrl,
                networkType,
                nodeInfo.friendlyName,
                true,
                nodeInfo.publicKey,
                nodeInfo.apiStatus?.nodePublicKey,
                nodeInfo.apiStatus?.webSocket?.url,
            );
        } catch (error) {
            // proceed to return
        }
        return undefined;
    }

    public async getNodeFromStatisticServiceByPublicKey(
        networkType: NetworkType,
        publicKey: string,
        isOffline?: boolean,
    ): Promise<NodeModel> {
        if (!isOffline && navigator.onLine) {
            return this.getNodeModelByMethod(
                networkType,
                this.createStatisticServiceRestClient(networkConfig[networkType].statisticServiceUrl).getNode,
                publicKey,
            );
        }
        return undefined;
    }

    public async getNodeFromStatisticServiceByNodePublicKey(
        networkType: NetworkType,
        nodePublicKey: string,
        isOffline?: boolean,
    ): Promise<NodeModel> {
        if (!isOffline && navigator.onLine) {
            return this.getNodeModelByMethod(
                networkType,
                this.createStatisticServiceRestClient(networkConfig[networkType].statisticServiceUrl).getNodeByNodePublicKey,
                nodePublicKey,
            );
        }
        return undefined;
    }

    private createNodeModel(
        url: string,
        networkType: NetworkType,
        friendlyName: string | undefined = undefined,
        isDefault: boolean | undefined = undefined,
        publicKey?: string,
        nodePublicKey?: string,
        wsUrl?: string,
    ): NodeModel {
        return new NodeModel(url, friendlyName, isDefault, networkType, publicKey, nodePublicKey, wsUrl);
    }

    public loadNodes(profile: ProfileModel): NodeModel[] {
        const allProfileNodes = this.storage.get() || {};
        return allProfileNodes[profile.profileName] || [];
    }

    public saveNodes(profile: ProfileModel, nodes: NodeModel[]) {
        const allProfileNodes = this.storage.get() || {};
        allProfileNodes[profile.profileName] = nodes;
        this.storage.set(allProfileNodes);
    }

    public reset() {
        this.storage.remove();
    }

    public createStatisticServiceRestClient(statisticsServiceUrl: string): NodeApi {
        return new NodeApi(
            new Configuration({
                fetchApi: fetch as any,
                basePath: statisticsServiceUrl,
            }),
        );
    }
}
