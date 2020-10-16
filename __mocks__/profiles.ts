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
import { NetworkType } from 'symbol-sdk';
import { ProfileModel } from '@/core/database/entities/ProfileModel';

const TEST_PROFILES = {
    profile1: {
        generationHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
        profileName: 'profile1',
        hint: 'password is password',
        networkType: NetworkType.MIJIN_TEST,
        password: '0b831096cf25adbd7324ad2dbb3d99a829b40b53c6f76dd50fb2ef56fceded2f2kixTXdr/q/ci5PPwWVCiA==',
        accounts: "['WalletsModel2']",
        seed:
            '4fcd1e1b896551f68c3d5314be1f8d2fad48d7b492e65ecf4ac1ac2dfc9749a08CyBF9Q5APg07qXEMWQzQIcN+/KBekkw0T2hBPfdAd5VxXkdzWikv46dIaYxyHCn9hdr839ITfgIWYnAiE54jRWfFKkDvyEZL4pchX6mAqCcc0Ew9VGFfHjKStHWFeBezrhp/MlNeSw/EbxiCFo5C2pmeSuGz5NABUXT+BoDi62gB8r6gyF9hjB8J7Lz6D4SBf6J4cvj9krCXzkkWX1jqg==',
    },
};

export const getTestProfile = (name: string): ProfileModel => {
    if (!(name in TEST_PROFILES)) {
        throw new Error('Test account with name: ' + name + ' could not be found in __mocks__/accounts.ts');
    }

    return TEST_PROFILES[name];
};
