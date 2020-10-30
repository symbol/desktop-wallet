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

// internal dependencies
import { AssetTableService, TableField } from './AssetTableService';
import { MetadataModel } from '@/core/database/entities/MetadataModel';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';

export class MetadataTableService extends AssetTableService {
    constructor(
        currentHeight: number,
        private readonly metadatas: MetadataModel[],
        private readonly networkConfiguration: NetworkConfigurationModel,
    ) {
        super(currentHeight);
    }

    /**
     * Return table fields to be displayed in a table header
     * @returns {TableField[]}
     */
    public getTableFields(): TableField[] {
        return [
            { name: 'targetAddress', label: 'table_header_target_address' },
            { name: 'targetID', label: 'table_header_target_id' },
            { name: 'targetType', label: 'table_header_target_type' },
            { name: 'scopedMetadataKey', label: 'table_header_scoped_key' },
            { name: 'status', label: 'table_header_status' },
            { name: 'changeTimes', label: 'table_header_change_times' },
        ];
    }

    public getTableRows(): any[] {
        const metadatas: MetadataModel[] = this.metadatas;

        return metadatas.map((metadataModel) => {
            return {
                hexId: metadataModel.metadataId,
                scopedMetadataKey: metadataModel.scopedMetadataKey,
                targetAddress: metadataModel.targetAddress,
                targetId: metadataModel.targetId,
                value: metadataModel.value,
            };
        });
    }
}
