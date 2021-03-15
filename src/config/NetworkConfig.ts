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
    explorerUrl: 'http://explorer.symbolblockchain.io/',
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
        currencyMosaicId: '4F8E3FB75C77C83E',
        harvestingMosaicId: '4F8E3FB75C77C83E',
        defaultDynamicFeeMultiplier: 1000,
        epochAdjustment: 1615540625,
        totalChainImportance: undefined,
        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
    },
    nodes: [
        { friendlyName: 'ngl-dual-001', roles: 2, url: 'http://ngl-dual-001.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-002', roles: 2, url: 'http://ngl-dual-002.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-003', roles: 2, url: 'http://ngl-dual-003.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-004', roles: 2, url: 'http://ngl-dual-004.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-005', roles: 2, url: 'http://ngl-dual-005.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-101', roles: 2, url: 'http://ngl-dual-101.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-102', roles: 2, url: 'http://ngl-dual-102.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-103', roles: 2, url: 'http://ngl-dual-103.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-104', roles: 2, url: 'http://ngl-dual-104.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-105', roles: 2, url: 'http://ngl-dual-105.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-201', roles: 2, url: 'http://ngl-dual-201.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-202', roles: 2, url: 'http://ngl-dual-202.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-203', roles: 2, url: 'http://ngl-dual-203.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-204', roles: 2, url: 'http://ngl-dual-204.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-205', roles: 2, url: 'http://ngl-dual-205.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-301', roles: 2, url: 'http://ngl-dual-301.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-302', roles: 2, url: 'http://ngl-dual-302.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-303', roles: 2, url: 'http://ngl-dual-303.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-304', roles: 2, url: 'http://ngl-dual-304.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-305', roles: 2, url: 'http://ngl-dual-305.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-401', roles: 2, url: 'http://ngl-dual-401.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-402', roles: 2, url: 'http://ngl-dual-402.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-403', roles: 2, url: 'http://ngl-dual-403.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-404', roles: 2, url: 'http://ngl-dual-404.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-405', roles: 2, url: 'http://ngl-dual-405.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-501', roles: 2, url: 'http://ngl-dual-501.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-502', roles: 2, url: 'http://ngl-dual-502.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-503', roles: 2, url: 'http://ngl-dual-503.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-504', roles: 2, url: 'http://ngl-dual-504.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-505', roles: 2, url: 'http://ngl-dual-505.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-601', roles: 2, url: 'http://ngl-dual-601.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-602', roles: 2, url: 'http://ngl-dual-602.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-603', roles: 2, url: 'http://ngl-dual-603.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-604', roles: 2, url: 'http://ngl-dual-604.symbolblockchain.io:3000' },
        { friendlyName: 'ngl-dual-605', roles: 2, url: 'http://ngl-dual-605.symbolblockchain.io:3000' },
    ],
};

const defaultNetworkConfig: Record<number, NetworkConfig> = {
    152: defaultTestnetNetworkConfig,
    104: defaultMainnetNetworkConfig,
};

const resolvedNetworkConfig: NetworkConfig = window['networkConfig'] || defaultNetworkConfig;
console.log('networkConfig resolved!', resolvedNetworkConfig);
export const networkConfig = resolvedNetworkConfig;
