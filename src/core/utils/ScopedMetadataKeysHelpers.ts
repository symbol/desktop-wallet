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
import { StorageHelpers } from './StorageHelpers';

export const SCOPED_METADATA_STORE_KEY: string = 'SCOPED_METADATA_STORE_KEY';
export const MAX_STORE_LENGTH = 5;

export class ScopedMetadataKeysHelpers {
    /**
     * Stored Metadata key array
     * @returns {string[]}
     */
    public static loadScopedMetadataKeys(): string[] {
        let keys = [];
        try {
            keys = JSON.parse(StorageHelpers.sessionRead(SCOPED_METADATA_STORE_KEY) || '[]');
        } catch (e) {
            console.log(e);
        }

        return keys;
    }

    public static storeKey = (key) => {
        let keys = ScopedMetadataKeysHelpers.loadScopedMetadataKeys();
        if (keys.length >= MAX_STORE_LENGTH) {
            keys.pop();
        } else if (keys.includes(key)) {
            keys = keys.filter((item) => item !== key);
            keys.unshift(key);
        } else {
            keys.unshift(key);
        }

        StorageHelpers.sessionSave(SCOPED_METADATA_STORE_KEY, JSON.stringify(keys));
    };
}
