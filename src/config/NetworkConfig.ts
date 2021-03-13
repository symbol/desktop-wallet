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

export interface NodeConfig {
    roles: number;
    friendlyName: string;
    url: string;
}

export interface NetworkConfigurationDefaults {
    maxTransactionsPerAggregate: number;
    maxMosaicDuration: number;
    lockedFundsPerAggregate: string;
    maxNamespaceDuration: number;
    maxCosignatoriesPerAccount: number;
    maxMosaicAtomicUnits: number;
    blockGenerationTargetTime: number;
    currencyMosaicId: string;
    namespaceGracePeriodDuration: number;
    harvestingMosaicId: string;
    minNamespaceDuration: number;
    maxCosignedAccountsPerAccount: number;
    maxNamespaceDepth: number;
    defaultDynamicFeeMultiplier: number;
    maxMosaicDivisibility: number;
    maxMessageSize: number;
    epochAdjustment: number;
    totalChainImportance: number;
    generationHash: string;
}

export interface NetworkConfig {
    faucetUrl: string;
    nodes: NodeConfig[];
    defaultNetworkType: number;
    explorerUrl: string;
    networkConfigurationDefaults: NetworkConfigurationDefaults;
}

const defaultTestnetNetworkConfig: NetworkConfig = {
    explorerUrl: 'http://explorer.testnet.symboldev.network/',
    faucetUrl: 'http://faucet.testnet.symboldev.network/',
    defaultNetworkType: 152,
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 2592000,
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 30,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 315360000,
        minNamespaceDuration: 2592000,
        maxNamespaceDuration: 5256000,
        maxTransactionsPerAggregate: 100,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 9000000000000000,
        currencyMosaicId: '2CF403E85507F39E',
        harvestingMosaicId: '2CF403E85507F39E',
        defaultDynamicFeeMultiplier: 1000,
        epochAdjustment: 1573430400,
        totalChainImportance: undefined,
        generationHash: '45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD',
    },
    nodes: [
        { friendlyName: 'API North East 1', roles: 2, url: 'http://api-01.ap-northeast-1.testnet.symboldev.network:3000' },
        { friendlyName: 'API South West 1', roles: 2, url: 'http://api-01.ap-southeast-1.testnet.symboldev.network:3000' },
        { friendlyName: 'API EU Central 1', roles: 2, url: 'http://api-01.eu-central-1.testnet.symboldev.network:3000' },
        { friendlyName: 'API EU West 1', roles: 2, url: 'http://api-01.eu-west-1.testnet.symboldev.network:3000' },
        { friendlyName: 'API US West 1', roles: 2, url: 'http://api-01.us-west-1.testnet.symboldev.network:3000' },
    ],
};

const defaultMainnetNetworkConfig: NetworkConfig = {
    explorerUrl: 'http://explorer.mainnet.symboldev.network/',
    faucetUrl: 'http://faucet.mainnet.symboldev.network/',
    defaultNetworkType: 104,
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 2592000,
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 30,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 21024000,
        minNamespaceDuration: 86400,
        maxNamespaceDuration: 2102400,
        maxTransactionsPerAggregate: 1000,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 9000000000000000,
        currencyMosaicId: '3F67F648FD5DCCCE',
        harvestingMosaicId: '3F67F648FD5DCCCE',
        defaultDynamicFeeMultiplier: 1000,
        epochAdjustment: 1615540625,
        totalChainImportance: undefined,
        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
    },
    nodes: [{ friendlyName: 'Experimental Main', roles: 2, url: 'http://api.experimental.symboldev.network:3000' }],
};

const defaultNetworkConfig: Record<number, NetworkConfig> = {
    152: defaultTestnetNetworkConfig,
    104: defaultMainnetNetworkConfig,
};

const resolvedNetworkConfig: NetworkConfig = window['networkConfig'] || defaultNetworkConfig;
console.log('networkConfig resolved!', resolvedNetworkConfig);
export const networkConfig = resolvedNetworkConfig;
