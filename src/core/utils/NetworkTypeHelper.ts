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
/// region custom types
import { defaultGenerationHashes } from '@/config';
import { NetworkType } from 'symbol-sdk';

type NetworkNodeEntry = { value: NetworkType; label: string };
type NetworkGenerationHashEntry = { value: string; label: string };

export class NetworkTypeHelper {
    /**
     * Network types with their names
     */
    public static networkTypeList: NetworkNodeEntry[] = [
        { value: NetworkType.MAIN_NET, label: 'Symbol Mainnet' },
        { value: NetworkType.TEST_NET, label: 'Symbol Testnet' },
    ];
    public static generationHashList: NetworkGenerationHashEntry[] = [
        { value: defaultGenerationHashes.MAIN_NET, label: 'Symbol Mainnet' },
        { value: defaultGenerationHashes.TEST_NET, label: 'Symbol Testnet' },
    ];
    /**
     * Getter for network type label
     * @param {NetworkType} networkType
     * @return {string}
     */
    public static getNetworkTypeLabel(networkType: NetworkType): string {
        const findType = NetworkTypeHelper.networkTypeList.find((n) => n.value === networkType);
        if (findType === undefined) {
            return '';
        }
        return findType.label;
    }
    public static getGenerationHashLabel(generationHash: string): string {
        const findType = NetworkTypeHelper.generationHashList.find((n) => n.value === generationHash);
        if (findType === undefined) {
            return '';
        }
        return findType.label;
    }
}
