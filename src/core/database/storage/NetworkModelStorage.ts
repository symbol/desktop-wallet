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
import { NetworkType, NodeInfo, TransactionFees, RoleType } from 'symbol-sdk';
import { VersionedNetworkBasedObjectStorage } from '@/core/database/backends/VersionedNetworkBasedObjectStorage';
import { NetworkModel } from '@/core/database/entities/NetworkModel';
import { networkConfig } from '@/config';

export class NetworkModelStorage extends VersionedNetworkBasedObjectStorage<NetworkModel> {
    /**
     * Singleton instance as we want to run the migration just once
     */
    public static INSTANCE = new NetworkModelStorage();

    private constructor() {
        super('networkCache', [
            {
                description: 'Update networkCache to 0.9.5.1 network',
                migrate: () => undefined,
            },
            {
                description: 'Update networkCache for 0.9.6.3 network (generation hash)',
                migrate: (from: any) => {
                    const modified: any = from;

                    // add new network
                    modified['1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B'] = new NetworkModel(
                        'http://api-01.eu-central-1.096x.symboldev.network:3000',
                        NetworkType.TEST_NET,
                        '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B',
                        networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults,
                        new TransactionFees(3, 0, 1000, 0, 100),
                        new NodeInfo(
                            '0286F8813497D18B334E09BB48F213C90025D19D4CC7CC54ED6061F8FDA92A72',
                            '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B',
                            7900,
                            NetworkType.TEST_NET,
                            0,
                            [RoleType.ApiNode],
                            '',
                            'api-01-eu-central-1',
                        ),
                    );

                    return modified;
                },
            },
            {
                description: 'Update networkCache for 0.10.x network (generation hash)',
                migrate: (from: any) => {
                    const modified: any = from;

                    // add new network
                    modified['6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD'] = new NetworkModel(
                        'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000/',
                        NetworkType.TEST_NET,
                        '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD',
                        networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults,
                        new TransactionFees(3, 0, 1000, 0, 100),
                        new NodeInfo(
                            '70E06C112848A652D635755B7530D3096A978321D09B8D8DC17505CAE09565C5',
                            '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD',
                            7900,
                            NetworkType.TEST_NET,
                            0,
                            [RoleType.ApiNode],
                            '',
                            'api-01-ap-northeast-1',
                        ),
                    );

                    return modified;
                },
            },
            {
                description: 'Update networkCache for default node url change',
                migrate: (from: any) => {
                    const modified: any = from;
                    const url = modified['6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD'].data.url;
                    console.log('here is the url:' + url);

                    if (url?.startsWith('http://api-01.us-east-1.0.10.0.x.symboldev.network:3000')) {
                        // update URL and nodeInfo
                        modified['6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD'] = new NetworkModel(
                            'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000',
                            NetworkType.TEST_NET,
                            '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD',
                            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults,
                            new TransactionFees(3, 0, 1000, 0, 100),
                            new NodeInfo(
                                'F5A8DA4CB59AA234A0A1CB62AEEC508AD9A3D4EBD5946BE2BCCCCAB111AF199C',
                                '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD',
                                7900,
                                NetworkType.TEST_NET,
                                0,
                                [RoleType.PeerNode, RoleType.ApiNode, RoleType.VotingNode],
                                '',
                                'api-01-us-west-1',
                                'F9E8648B88F2119328E75A0F1F8B4A7F83ED586DEC9DD2F5CD5D9D96BE48F0BE',
                            ),
                        );
                    }

                    return modified;
                },
            },
            {
                description: 'Reset accounts for 0.10.0.5 network (non backwards compatible)',
                migrate: () => undefined,
            },
            {
                description: 'Reset accounts for 0.10.0.6 network (non backwards compatible)',
                migrate: () => undefined,
            },
            {
                description: 'Reset accounts for 1.0.0.0 network (non backwards compatible)',
                migrate: () => undefined,
            },
            {
                description: 'Reset for Symbol mainet launch.',
                migrate: () => undefined,
            },
        ]);
    }
}
