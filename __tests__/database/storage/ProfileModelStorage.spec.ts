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
import { ProfileModelStorage } from '@/core/database/storage/ProfileModelStorage';
import { ObjectStorageBackend } from '@/core/database/backends/ObjectStorageBackend';
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { VersionedModel } from '@/core/database/entities/VersionedModel';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { defaultTestnetNetworkConfig } from '@/config';

describe('storage/ProfileModelStorage.spec ==>', () => {
    describe('constructor() should', () => {
        test('Should upgrade testnet only on v8', () => {
            const profiles = {
                version: 7,
                data: {
                    someMainnetProfile: {
                        profileName: 'someMainnetProfile',
                        accounts: ['1', '2', '3'],
                        seed: 'SomeSeed2',
                        password: 'myPassword2',
                        hint: '',
                        networkType: NetworkType.MAIN_NET,
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                        termsAndConditionsApproved: false,
                        selectedNodeUrlToConnect: 'http://ngl-dual-001.symbolblockchain.io:3000',
                    },
                    someTestnetProfile: {
                        profileName: 'someTestnetProfile',
                        accounts: ['a', 'b', 'c'],
                        seed: 'SomeSeed',
                        password: 'myPassword',
                        hint: '',
                        networkType: NetworkType.TEST_NET,
                        generationHash: '45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD',
                        termsAndConditionsApproved: false,
                        selectedNodeUrlToConnect: 'http://api-01.us-west-1.testnet.symboldev.network:3000',
                    },
                    somePrivateNetwork: {
                        profileName: 'somePrivateNetwork',
                        accounts: ['1a', '2b', '3c'],
                        seed: 'SomeSeed3',
                        password: 'myPassword3',
                        hint: '',
                        networkType: NetworkType.PRIVATE_TEST,
                        generationHash: 'AAAADA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                        termsAndConditionsApproved: false,
                        selectedNodeUrlToConnect: 'http://private.network:3000',
                    },
                },
            };
            const delegate = new SimpleObjectStorage<VersionedModel<Record<string, ProfileModel>>>(
                'profiles',
                new ObjectStorageBackend({
                    profiles: JSON.stringify(profiles),
                }),
            );
            const storage = new ProfileModelStorage(delegate);
            const migratedData = storage.get();
            const expected = {
                someMainnetProfile: {
                    profileName: 'someMainnetProfile',
                    accounts: ['1', '2', '3'],
                    seed: 'SomeSeed2',
                    password: 'myPassword2',
                    hint: '',
                    networkType: NetworkType.MAIN_NET,
                    generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                    termsAndConditionsApproved: false,
                    selectedNodeUrlToConnect: 'http://ngl-dual-001.symbolblockchain.io:3000',
                },
                someTestnetProfile: {
                    profileName: 'someTestnetProfile',
                    accounts: ['a', 'b', 'c'],
                    seed: 'SomeSeed',
                    password: 'myPassword',
                    hint: '',
                    networkType: NetworkType.TEST_NET,
                    generationHash: '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155',
                    termsAndConditionsApproved: false,
                    selectedNodeUrlToConnect: migratedData.someTestnetProfile.selectedNodeUrlToConnect,
                },
                somePrivateNetwork: {
                    profileName: 'somePrivateNetwork',
                    accounts: ['1a', '2b', '3c'],
                    seed: 'SomeSeed3',
                    password: 'myPassword3',
                    hint: '',
                    networkType: NetworkType.PRIVATE_TEST,
                    generationHash: 'AAAADA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                    termsAndConditionsApproved: false,
                    selectedNodeUrlToConnect: 'http://private.network:3000',
                },
            };

            expect(
                defaultTestnetNetworkConfig.nodes.find((n) => n.url === migratedData.someTestnetProfile.selectedNodeUrlToConnect),
            ).toBeDefined();
            expect(migratedData).toEqual(expected);
            expect(delegate.get()).toEqual({ version: 8, data: migratedData });
        });

        test('Should not upgrade, testnet already v8', () => {
            const profiles = {
                version: 8,
                data: {
                    someMainnetProfile: {
                        profileName: 'someMainnetProfile',
                        accounts: ['1', '2', '3'],
                        seed: 'SomeSeed2',
                        password: 'myPassword2',
                        hint: '',
                        networkType: NetworkType.MAIN_NET,
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                        termsAndConditionsApproved: false,
                        selectedNodeUrlToConnect: 'http://ngl-dual-001.symbolblockchain.io:3000',
                    },
                    someTestnetProfile: {
                        profileName: 'someTestnetProfile',
                        accounts: ['a', 'b', 'c'],
                        seed: 'SomeSeed',
                        password: 'myPassword',
                        hint: '',
                        networkType: NetworkType.TEST_NET,
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                        termsAndConditionsApproved: false,
                        selectedNodeUrlToConnect: 'http://api-01.testnet.symboldev.network:3000',
                    },
                    somePrivateNetwork: {
                        profileName: 'somePrivateNetwork',
                        accounts: ['1a', '2b', '3c'],
                        seed: 'SomeSeed3',
                        password: 'myPassword3',
                        hint: '',
                        networkType: NetworkType.PRIVATE_TEST,
                        generationHash: '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155',
                        termsAndConditionsApproved: false,
                        selectedNodeUrlToConnect: 'http://private.network:3000',
                    },
                },
            };
            const delegate = new SimpleObjectStorage<VersionedModel<Record<string, ProfileModel>>>(
                'profiles',
                new ObjectStorageBackend({
                    profiles: JSON.stringify(profiles),
                }),
            );
            const storage = new ProfileModelStorage(delegate);
            const migratedData = storage.get();
            expect(migratedData).toEqual(profiles.data);
            expect(delegate.get()).toEqual(profiles);
        });
    });
});
