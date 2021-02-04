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

import { VersionedObjectStorage } from '@/core/database/backends/VersionedObjectStorage';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { HarvestingService } from '@/services/HarvestingService';
import { Address } from 'symbol-sdk';

export class AccountModelStorage extends VersionedObjectStorage<Record<string, AccountModel>> {
    /**
     * Singleton instance as we want to run the migration just once
     */
    public static INSTANCE = new AccountModelStorage();

    private constructor() {
        super('accounts', [
            {
                description: 'Update accounts to hold encRemoteAccountPrivateKey',
                migrate: (from: any) => {
                    // update all accounts
                    const accounts = Object.keys(from);

                    const modified: any = from;
                    accounts.map((name: string) => {
                        modified[name] = {
                            ...modified[name],
                            encRemoteAccountPrivateKey: '',
                        };
                    });

                    return modified;
                },
            },
            {
                description: 'Update accounts for 0.9.6.3 network (address changes)',
                migrate: (from: any) => {
                    // update all pre-0.9.6.x profiles
                    const profiles = Object.keys(from);

                    const modified: any = from;
                    profiles.map((name: string) => {
                        modified[name] = {
                            ...modified[name],
                            // re-generating address from public key (0.9.6.x changes in addresses format)
                            address: Address.createFromPublicKey(modified[name].publicKey, modified[name].networkType).plain(),
                        };
                    });

                    return modified;
                },
            },
            {
                description: 'Reset accounts for 0.9.6.3 network (non backwards compatible)',
                migrate: () => undefined,
            },
            {
                description: 'Update accounts to move harvesting fields to HarvestingModelStorage',
                migrate: (from: any) => {
                    const harvestingService = new HarvestingService();

                    // update all accounts
                    const accounts = Object.keys(from);

                    const modified: any = from;
                    accounts.map((name: string) => {
                        const {
                            address,
                            isPersistentDelReqSent,
                            selectedHarvestingNode,
                            encRemotePrivateKey,
                            encVrfPrivateKey,
                            ...nonHarvesting
                        } = modified[name];

                        try {
                            harvestingService.saveHarvestingModel({
                                accountAddress: address,
                                isPersistentDelReqSent,
                                selectedHarvestingNode,
                                encRemotePrivateKey,
                                encVrfPrivateKey,
                                ...nonHarvesting,
                            });
                            modified[name] = { address, encRemotePrivateKey, encVrfPrivateKey, ...nonHarvesting };
                        } catch (error) {
                            console.log(error);
                        }
                    });

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
        ]);
    }
}
