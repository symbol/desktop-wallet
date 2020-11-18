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
}

export interface NetworkConfig {
    defaultNodeUrl: string;
    faucetUrl: string;
    nodes: NodeConfig[];
    defaultNetworkType: number;
    explorerUrl: string;
    networkConfigurationDefaults: NetworkConfigurationDefaults;
}

const defaultNetworkConfig: NetworkConfig = {
    explorerUrl: 'http://explorer-0.10.0.x-01.symboldev.network/',
    faucetUrl: 'http://faucet-0.10.0.x-01.symboldev.network/',
    defaultNetworkType: 152,
    defaultNodeUrl: 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000',
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 2592000,
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 15,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 21024000,
        minNamespaceDuration: 172800,
        maxNamespaceDuration: 2102400,
        maxTransactionsPerAggregate: 1000,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 9000000000000000,
        currencyMosaicId: '5F160D7851F3CB30',
        harvestingMosaicId: '5F160D7851F3CB30',
        defaultDynamicFeeMultiplier: 1000,
        epochAdjustment: 1573430400,
    },
    nodes: [
        { friendlyName: 'API EU Central 1', roles: 2, url: 'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000' },
        { friendlyName: 'API EU West 1', roles: 2, url: 'http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000' },
        { friendlyName: 'API US East 1', roles: 2, url: 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000' },
        { friendlyName: 'API US West 1', roles: 2, url: 'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000' },
        { friendlyName: 'API US West 2', roles: 2, url: 'http://api-01.us-west-2.0.10.0.x.symboldev.network:3000' },
        {
            friendlyName: 'API AP South East 1',
            roles: 2,
            url: 'http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000',
        },
        {
            friendlyName: 'API AP North East 1',
            roles: 2,
            url: 'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000',
        },
    ],
};

const resolvedNetworkConfig: NetworkConfig = window['networkConfig'] || defaultNetworkConfig;
console.log('networkConfig resolved!', resolvedNetworkConfig);
export const networkConfig = resolvedNetworkConfig;
