/*
 * (C) Symbol Contributors 2021
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
import { appConfig } from '@/config';
import { NodeModelStorage } from '@/core/database/storage/NodeModelStorage';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { NodeWatchService, NodeApiNodeInfo } from '@/services/NodeWatchService';

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
        const statisticsNodes = !isOffline ? await this.getNodesFromNodeWatchService(profile.networkType) : [];
        const nodeRepository = repositoryFactory.createNodeRepository();
        const nodeWsUrl =
            storedNodes.find((n) => n.url === repositoryFactoryUrl)?.wsUrl ||
            statisticsNodes.find((n) => n.url === repositoryFactoryUrl)?.wsUrl;
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
                        nodeWsUrl,
                    ),
                ),
                ObservableHelpers.defaultLast(this.createNodeModel(repositoryFactoryUrl, profile.networkType)),
                map((currentNode) => _.uniqBy([currentNode, ...storedNodes], 'url')),
                tap((p) => this.saveNodes(profile, p)),
            )
            .toPromise()
            .then((val) => (statisticsNodes && statisticsNodes.length ? _.uniqBy(val.concat([...statisticsNodes]), 'url') : val));
    }

    public async getNodesFromNodeWatchService(
        networkType: NetworkType,
        limit = 30,
        sslOnly = true,
        isOffline?: boolean,
    ): Promise<NodeModel[]> {
        if (!isOffline && navigator.onLine) {
            try {
                const nodeWatchService = new NodeWatchService(networkType);
                let nodeInfos = await nodeWatchService.getNodes(sslOnly, limit, 'random');

                if (!nodeInfos) {
                    return undefined;
                }
                nodeInfos = nodeInfos.filter((n) => n.endpoint !== '' && n.isSslEnabled && n.isHealthy);

                return nodeInfos.map((n) =>
                    this.createNodeModel(n.endpoint, networkType, n.friendlyName, true, n.mainPublicKey, n.nodePublicKey, n.wsUrl),
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
            if (nodeInfo) {
                return this.createNodeModel(
                    nodeInfo.endpoint,
                    networkType,
                    nodeInfo.friendlyName,
                    true,
                    nodeInfo.mainPublicKey,
                    nodeInfo.nodePublicKey,
                    nodeInfo.wsUrl,
                );
            }
        } catch (error) {
            console.log(error);
            // proceed to return
        }
        return undefined;
    }

    public async getNodeFromNodeWatchServiceByMainPublicKey(
        networkType: NetworkType,
        publicKey: string,
        isOffline?: boolean,
    ): Promise<NodeModel> {
        if (!isOffline && navigator.onLine && publicKey) {
            const nodeWatchService = new NodeWatchService(networkType);

            return this.getNodeModelByMethod(
                networkType,
                async (pKey) => {
                    return await nodeWatchService.getNodeByMainPublicKey(pKey);
                },
                publicKey,
            );
        }
        return undefined;
    }

    public async getNodeFromNodeWatchServiceByNodePublicKey(
        networkType: NetworkType,
        nodePublicKey: string,
        isOffline?: boolean,
    ): Promise<NodeModel> {
        if (!isOffline && navigator.onLine && nodePublicKey) {
            const nodeWatchService = new NodeWatchService(networkType);

            return this.getNodeModelByMethod(
                networkType,
                async (npKey) => {
                    return await nodeWatchService.getNodeByNodePublicKey(npKey);
                },
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
        mainPublicKey?: string,
        nodePublicKey?: string,
        wsUrl?: string,
    ): NodeModel {
        return new NodeModel(url, friendlyName, isDefault, networkType, mainPublicKey, nodePublicKey, wsUrl);
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

    /**
     * Creates offline mock node model for offline transaction
     * @param {networkType} NetworkType
     */
    public createOfflineNodeModel(networkType: NetworkType): NodeModel {
        return this.createNodeModel(appConfig.offlineNodeModelUrl, networkType, 'offlineNodeMock', undefined, undefined, undefined);
    }
}
