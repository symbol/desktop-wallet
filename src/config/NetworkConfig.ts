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
    defaultNetworkType: number;
    explorerUrl: string;
    networkConfigurationDefaults: NetworkConfigurationDefaults;
    statisticServiceUrl: string;
}

export const defaultTestnetNetworkConfig: NetworkConfig = {
    explorerUrl: 'https://testnet.symbol.fyi/',
    faucetUrl: 'https://testnet.symbol.tools/',
    statisticServiceUrl: 'https://testnet.symbol.services',
    defaultNetworkType: 152,
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 86400,
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 30,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 315360000,
        minNamespaceDuration: 2592000,
        maxNamespaceDuration: 157680000,
        maxTransactionsPerAggregate: 100,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 8999999999000000,
        currencyMosaicId: '72C0212E67A08BCE',
        harvestingMosaicId: '72C0212E67A08BCE',
        defaultDynamicFeeMultiplier: 100,
        epochAdjustment: 1637848847,
        totalChainImportance: 7842928625000000,
        generationHash: '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4',
    },
};

export const defaultMainnetNetworkConfig: NetworkConfig = {
    explorerUrl: 'https://symbol.fyi/',
    faucetUrl: 'https://faucet.mainnet.symboldev.network/',
    statisticServiceUrl: 'https://symbol.services',
    defaultNetworkType: 104,
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 2592000,
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 30,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 315360000,
        minNamespaceDuration: 2592000,
        maxNamespaceDuration: 157680000,
        maxTransactionsPerAggregate: 100,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 8999999999000000,
        currencyMosaicId: '6BED913FA20223F8',
        harvestingMosaicId: '6BED913FA20223F8',
        defaultDynamicFeeMultiplier: 100,
        epochAdjustment: 1615853185,
        totalChainImportance: 7842928625000000,
        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
    },
};

const defaultNetworkConfig: Record<number, NetworkConfig> = {
    152: defaultTestnetNetworkConfig,
    104: defaultMainnetNetworkConfig,
};

const resolvedNetworkConfig: NetworkConfig = window['networkConfig'] || defaultNetworkConfig;

export const networkConfig = resolvedNetworkConfig;
