/*
 * Copyright 2020 NEM Foundation (https://nem.io)
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

import { NetworkType } from 'symbol-sdk';
import { ObjectStorageBackend } from '@/core/database/backends/ObjectStorageBackend';
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { VersionedModel } from '@/core/database/entities/VersionedModel';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { NodeModelStorage } from '@/core/database/storage/NodeModelStorage';

describe('storage/ProfileModelStorage.spec ==>', () => {
    describe('constructor() should', () => {
        test('Should upgrade testnet only on v8', () => {
            const nodes = {
                version: 8,
                data: [
                    {
                        url: 'http://someMainnet.symbolblockchain.io:3000',
                        friendlyName: 'ngl-someMainnet-403',
                        isDefault: true,
                        networkType: NetworkType.MAIN_NET,
                        publicKey: 'EF1209DC3C42B6450BEF658D404252DF2E26784CECD35FAEB19D929AE030A198',
                        nodePublicKey: 'B87704DB1310FC59C91A1858DBDCFC67289363C18A67E10AFC2DCD26458B5D47',
                    },
                    {
                        url: 'http://someOldtestet.symbolblockchain.io:3000',
                        friendlyName: 'ngl-someOldtestet-001',
                        isDefault: true,
                        networkType: NetworkType.TEST_NET,
                    },
                    {
                        url: 'http://someOldtestet2.symbolblockchain.io:3000',
                        friendlyName: 'ngl-someOldtestet2-002',
                        isDefault: true,
                        networkType: NetworkType.TEST_NET,
                    },
                    {
                        url: 'http://somePrivate.symbolblockchain.io:3000',
                        friendlyName: 'ngl-somePrivate-002',
                        isDefault: true,
                        networkType: NetworkType.PRIVATE_TEST,
                    },
                ],
            };
            const delegate = new SimpleObjectStorage<VersionedModel<NodeModel[]>>(
                'node',
                new ObjectStorageBackend({
                    node: JSON.stringify(nodes),
                }),
            );
            const storage = new NodeModelStorage(delegate);
            const migratedData = storage.get();
            const expected = [
                {
                    url: 'http://someMainnet.symbolblockchain.io:3000',
                    friendlyName: 'ngl-someMainnet-403',
                    isDefault: true,
                    networkType: NetworkType.MAIN_NET,
                    publicKey: 'EF1209DC3C42B6450BEF658D404252DF2E26784CECD35FAEB19D929AE030A198',
                    nodePublicKey: 'B87704DB1310FC59C91A1858DBDCFC67289363C18A67E10AFC2DCD26458B5D47',
                },
                {
                    url: 'http://somePrivate.symbolblockchain.io:3000',
                    friendlyName: 'ngl-somePrivate-002',
                    isDefault: true,
                    networkType: NetworkType.PRIVATE_TEST,
                },
            ];
            expect(migratedData).toEqual(expected);
            expect(delegate.get()).toEqual({ version: 9, data: migratedData });
        });
    });
});
