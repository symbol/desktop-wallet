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
import { NetworkType } from 'symbol-sdk';
import { ProfileModel } from '@/core/database/entities/ProfileModel';

const TEST_PROFILES = {
    profile1: {
        generationHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
        profileName: 'profile1',
        hint: 'password is Password1',
        networkType: NetworkType.TEST_NET,
        password:
            '61A73C554FD0A2024EB3BFFB06A597EF5095764AB049D8440C683F0CCD4E77D5A737FA90358664006CFA13C3B839028E63FC82F77E652730524C111EFAC95073',
        accounts: "['WalletsModel1']",
        seed:
            '4fcd1e1b896551f68c3d5314be1f8d2fad48d7b492e65ecf4ac1ac2dfc9749a08CyBF9Q5APg07qXEMWQzQIcN+/KBekkw0T2hBPfdAd5VxXkdzWikv46dIaYxyHCn9hdr839ITfgIWYnAiE54jRWfFKkDvyEZL4pchX6mAqCcc0Ew9VGFfHjKStHWFeBezrhp/MlNeSw/EbxiCFo5C2pmeSuGz5NABUXT+BoDi62gB8r6gyF9hjB8J7Lz6D4SBf6J4cvj9krCXzkkWX1jqg==',
        termsAndConditionsApproved: true,
        selectedNodeUrlToConnect: 'http://localhost:3000',
    },
    profile_testnet: {
        generationHash: '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155',
        profileName: 'profile_testnet',
        hint: 'password is Password1',
        networkType: NetworkType.TEST_NET,
        password:
            '61A73C554FD0A2024EB3BFFB06A597EF5095764AB049D8440C683F0CCD4E77D5A737FA90358664006CFA13C3B839028E63FC82F77E652730524C111EFAC95073',
        accounts: "['WalletsModel2']",
        seed:
            '4fcd1e1b896551f68c3d5314be1f8d2fad48d7b492e65ecf4ac1ac2dfc9749a08CyBF9Q5APg07qXEMWQzQIcN+/KBekkw0T2hBPfdAd5VxXkdzWikv46dIaYxyHCn9hdr839ITfgIWYnAiE54jRWfFKkDvyEZL4pchX6mAqCcc0Ew9VGFfHjKStHWFeBezrhp/MlNeSw/EbxiCFo5C2pmeSuGz5NABUXT+BoDi62gB8r6gyF9hjB8J7Lz6D4SBf6J4cvj9krCXzkkWX1jqg==',
        termsAndConditionsApproved: true,
        selectedNodeUrlToConnect: 'http://localhost:3000',
    },
    profile_mainnet: {
        generationHash: '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155',
        profileName: 'profile_testnet',
        hint: 'password is Password1',
        networkType: NetworkType.MAIN_NET,
        password:
            '61A73C554FD0A2024EB3BFFB06A597EF5095764AB049D8440C683F0CCD4E77D5A737FA90358664006CFA13C3B839028E63FC82F77E652730524C111EFAC95073',
        accounts: "['WalletsModel2']",
        seed:
            '4fcd1e1b896551f68c3d5314be1f8d2fad48d7b492e65ecf4ac1ac2dfc9749a08CyBF9Q5APg07qXEMWQzQIcN+/KBekkw0T2hBPfdAd5VxXkdzWikv46dIaYxyHCn9hdr839ITfgIWYnAiE54jRWfFKkDvyEZL4pchX6mAqCcc0Ew9VGFfHjKStHWFeBezrhp/MlNeSw/EbxiCFo5C2pmeSuGz5NABUXT+BoDi62gB8r6gyF9hjB8J7Lz6D4SBf6J4cvj9krCXzkkWX1jqg==',
        termsAndConditionsApproved: true,
        selectedNodeUrlToConnect: 'http://localhost:3000',
    },
};

export const getTestProfile = (name: string): ProfileModel => {
    if (!(name in TEST_PROFILES)) {
        throw new Error('Test account with name: ' + name + ' could not be found in __mocks__/accounts.ts');
    }

    return TEST_PROFILES[name];
};
