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
import {
  RepositoryFactoryHttp,
  NodeRepository,
  NetworkType,
  NodeInfo,
  RoleType,
  NodeTime,
  NodeHealth,
  StorageInfo,
  ServerInfo,
} from 'symbol-sdk'
import { NodeService } from '@/services/NodeService'
import { toArray } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

const nodeService = new NodeService()
const realUrl = 'http://api-01.us-west-1.symboldev.network:3000'
const fakeNodeInfo = new NodeInfo(
  'Some Public Key',
  'Some Gen Hash',
  1234,
  NetworkType.TEST_NET,
  4567,
  [RoleType.ApiNode],
  'Some Host',
  'Some Friendly Name',
)
const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
  createNodeRepository(): NodeRepository {
    return new (class NodeRepositoryForTest implements NodeRepository {
      getNodeInfo(): Observable<NodeInfo> {
        return of(fakeNodeInfo)
      }
      getNodePeers(): Observable<NodeInfo[]> {
        return of([fakeNodeInfo])
      }
      getNodeTime(): Observable<NodeTime> {
        return of(new NodeTime())
      }
      getNodeHealth(): Observable<NodeHealth> {
        return of(new NodeHealth(undefined, undefined))
      }
      getStorageInfo(): Observable<StorageInfo> {
        return of(new StorageInfo(0, 0, 0))
      }
      getServerInfo(): Observable<ServerInfo> {
        return of(new ServerInfo('1.0.0', '1.0.0'))
      }
    })()
  }
})('http://localhost:3000', {
  networkType: NetworkType.TEST_NET,
  generationHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
})
repositoryFactory.getNetworkType = jest.fn(() => of(NetworkType.MIJIN_TEST))

describe.skip('services/NodeService', () => {
  test('getNodes', async () => {
    const peers = await nodeService.getNodes(repositoryFactory, realUrl).pipe(toArray()).toPromise()
    console.log(JSON.stringify(peers, null, 2))
  })
})
