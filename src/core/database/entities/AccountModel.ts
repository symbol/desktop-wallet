/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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

import { Address, PublicAccount } from 'symbol-sdk';

export class AccountType {
    public static readonly SEED: number = 1;
    public static readonly PRIVATE_KEY = 2;
    public static readonly KEYSTORE = 3;
    public static readonly TREZOR = 4;
    public static readonly LEDGER = 5;
    public static readonly OPT_IN = 6;
    public static readonly LEDGER_OPT_IN = 7;

    public static fromDescriptor(descriptor: string) {
        switch (descriptor) {
            default:
            case 'Ks':
                return AccountType.KEYSTORE;
            case 'Pk':
                return AccountType.PRIVATE_KEY;
            case 'Seed':
                return AccountType.SEED;
            case 'Trezor':
                return AccountType.TREZOR;
            case 'Ledger':
                return AccountType.LEDGER;
            case 'OptIn':
                return AccountType.OPT_IN;
            case 'Ledger-OptIn':
                return AccountType.LEDGER_OPT_IN;
        }
    }
}

/**
 * Stored POJO that holds user provided account information.
 *
 * The object is serialized and deserialized to/from JSON. no method or complex attributes can be fined.
 */
export class AccountModel {
    public readonly id: string;
    public readonly name: string;
    public readonly profileName: string;
    public readonly node: string;
    public readonly type: number;
    public readonly address: string;
    public readonly publicKey: string;
    public readonly encryptedPrivateKey: string;
    public readonly path: string;
    public readonly isMultisig: boolean;
    public readonly encRemoteAccountPrivateKey?: string;

    /**
     * Permits to return specific field's mapped object instances
     * @return any
     */
    public static getObjects(model: AccountModel): { address: Address; publicAccount: PublicAccount } {
        const address = Address.createFromRawAddress(model.address);
        const publicAccount = PublicAccount.createFromPublicKey(model.publicKey, address.networkType);
        return { address, publicAccount };
    }
}
