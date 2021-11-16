/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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

const requestNodes = async (networkType, searchCriteria?: { nodeFilter: string; limit: number }): Promise<[]> => {
    const url =
        networkConfig[networkType].statisticServiceUrl + 'nodes?filter=' + searchCriteria.nodeFilter + '&limit=' + searchCriteria.limit;
    return new Promise((resolve) => {
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData);
            })
            .catch((e) => {
                console.log(e);
                resolve(undefined);
            });
    });
};
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
            nodeFilter: 'suggested',
            limit: 30,
        };
        if (!isOffline && navigator.onLine) {
            const data = await requestNodes(networkType, nodeSearchCriteria);
            if (!data) {
                return undefined;
            }
            return data.map((n) => {
                //@ts-ignore
                const url = n.apiStatus?.restGatewayUrl;
                // @ts-ignore
                const friendlyName = n.friendlyName;
                // @ts-ignore
                const publicKey = n.publicKey;
                // @ts-ignore
                const nodePublicKey = n.apiStatus?.nodePublicKey;
                // @ts-ignore
                return this.createNodeModel(url, networkType, friendlyName, true, publicKey, nodePublicKey);
            });
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
    ): NodeModel {
        return new NodeModel(url, friendlyName, isDefault, networkType, publicKey, nodePublicKey);
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
}
