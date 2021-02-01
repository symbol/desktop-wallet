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

import { Formatters } from '@/core/utils/Formatters';
import { Convert, Metadata, MetadataType } from 'symbol-sdk';

/**
 * Stored POJO that holds mosaic information.
 *
 * The stored data is cached from rest.
 *
 * The object is serialized and deserialized to/from JSON. no method or complex attributes can be fined.
 *
 */
export class MetadataModel {
    public readonly metadataId: string;
    public readonly sourceAddress: string;
    public readonly targetAddress: string;
    public readonly scopedMetadataKey: string;
    public readonly metadataType: MetadataType;
    public readonly value: string;
    public readonly targetId?: string | undefined;

    constructor(metadata: Metadata) {
        this.metadataId = metadata.id;
        this.sourceAddress = metadata.metadataEntry.sourceAddress.plain();
        this.metadataType = metadata.metadataEntry.metadataType;
        this.scopedMetadataKey = metadata.metadataEntry.scopedMetadataKey.toHex();
        this.targetAddress = metadata.metadataEntry.targetAddress.plain();
        this.targetId = metadata.metadataEntry.targetId?.toHex();
        this.value = metadata.metadataEntry.value;
        if (Convert.isHexString(metadata.metadataEntry.value)) {
            this.value = Formatters.hexToUtf8(metadata.metadataEntry.value);
        } else {
            this.value = metadata.metadataEntry.value;
        }
    }
}
