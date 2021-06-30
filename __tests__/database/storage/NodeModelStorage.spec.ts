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
import { ProfileModel } from '@/core/database/entities/ProfileModel';

const fakeProfile: ProfileModel = {
    profileName: 'fakeName',
    generationHash: 'fakeGenHash',
    hint: 'fakeHint',
    networkType: NetworkType.TEST_NET,
    password: 'fakePassword',
    seed: 'fakeSeed',
    accounts: [],
    termsAndConditionsApproved: true,
    selectedNodeUrlToConnect: 'fakeNode',
};

const fakeNode: NodeModel = {
    url: 'fakeNodeUrl',
    friendlyName: 'fakeNode',
    isDefault: false,
    networkType: NetworkType.TEST_NET,
};

describe('storage/ProfileModelStorage.spec ==>', () => {
    describe('constructor() should', () => {
        test('Should save nodes by profile name', () => {
            const nodes = {
                version: 10,
                data: {
                    [fakeProfile.profileName]: [fakeNode],
                },
            };
            const delegate = new SimpleObjectStorage<VersionedModel<Record<string, NodeModel[]>>>(
                'node',
                new ObjectStorageBackend({
                    node: JSON.stringify(nodes),
                }),
            );
            const storage = new NodeModelStorage(delegate);
            const storedData = storage.get();
            expect(storedData).toEqual({
                [fakeProfile.profileName]: [fakeNode],
            });
        });
    });
});
