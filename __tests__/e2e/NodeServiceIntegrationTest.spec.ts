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
import { NetworkType, NodeInfo, NodeRepository, RepositoryFactory, RoleType } from 'symbol-sdk';
import { NodeService } from '@/services/NodeService';
import { toArray } from 'rxjs/operators';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

const nodeService = new NodeService();
const realUrl = 'http://api-01.us-west-1.symboldev.network:3000';
const fakeNodeInfo = new NodeInfo(
    'Some Public Key',
    'Some Gen Hash',
    1234,
    NetworkType.TEST_NET,
    4567,
    [RoleType.ApiNode],
    'Some Host',
    'Some Friendly Name',
);

const mockRepoFactory = mock<RepositoryFactory>();

const mockNodeRepository = mock<NodeRepository>();
when(mockNodeRepository.getNodePeers()).thenReturn(of([fakeNodeInfo]));
when(mockNodeRepository.getNodeInfo()).thenReturn(of(fakeNodeInfo));

const nodeRepository = instance(mockNodeRepository);

when(mockRepoFactory.createNodeRepository()).thenReturn(nodeRepository);
when(mockRepoFactory.getEpochAdjustment()).thenReturn(of(1573430400));
when(mockRepoFactory.getNetworkType()).thenReturn(of(NetworkType.MIJIN_TEST));
const repositoryFactory = instance(mockRepoFactory);

describe('services/NodeService', () => {
    test('getNodes', async () => {
        const peers = await nodeService.getNodes(repositoryFactory, realUrl, NetworkType.TEST_NET).pipe(toArray()).toPromise();
        console.log(JSON.stringify(peers, null, 2));
    });
});
