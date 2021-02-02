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
// external dependencies
import { SimpleWallet, Account, NetworkType, Password } from 'symbol-sdk';

// internal dependencies
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';

export const account1Params = {
    accountName: 'account_name',
    privateKey: '145160ba92878447cb45d6cb147d2ade035b0b47cab1b9e1551aa5679d92b314',
    networkType: NetworkType.MIJIN_TEST,
    password: new Password('password1'),
};

export const account1 = Account.createFromPrivateKey(account1Params.privateKey, account1Params.networkType);

export const simpleWallet1 = SimpleWallet.createFromPrivateKey(
    account1Params.accountName,
    account1Params.password,
    account1Params.privateKey,
    account1Params.networkType,
);

export const WalletsModel1: AccountModel = {
    id: 'someId',
    node: '',
    profileName: 'profile_name',
    name: account1Params.accountName,
    type: AccountType.PRIVATE_KEY,
    address: simpleWallet1.address.plain(),
    publicKey: account1.publicKey,
    encryptedPrivateKey: simpleWallet1.encryptedPrivateKey,
    path: '',
    isMultisig: false,
};

export const WalletsModel2: AccountModel = {
    id: 'someId2',
    node: '',
    profileName: 'profile1',
    name: account1Params.accountName,
    type: AccountType.SEED,
    address: simpleWallet1.address.plain(),
    publicKey: account1.publicKey,
    encryptedPrivateKey: simpleWallet1.encryptedPrivateKey,
    path: "m/44'/1'/1'/0'/0'",
    isMultisig: false,
};

const TEST_ACCOUNTS = {
    cosigner1: {
        networkType: NetworkType.MIJIN_TEST,
        privateKey: '27002B109810E4C25E8E6AE964FAF129CC3BFD1A95CB99062E0205060041D0C9',
    },
    remoteTestnet: {
        networkType: NetworkType.TEST_NET,
        privateKey: '803040D4A33983C4B233C6C2054A24B9C655E8CAC6C06AECCED56B8FE424FF2B',
    },
    remoteMijin: {
        networkType: NetworkType.MIJIN_TEST,
        privateKey: '803040D4A33983C4B233C6C2054A24B9C655E8CAC6C06AECCED56B8FE424FF2B',
    },
    cosigner2: {
        networkType: NetworkType.MIJIN_TEST,
        privateKey: '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F',
    },
    multisig1: {
        networkType: NetworkType.MIJIN_TEST,
        privateKey: 'CAD57FEC0C7F2106AD8A6203DA67EE675A1A3C232C676945306448DF5B4124F8',
    },
    multisig2: {
        networkType: NetworkType.MIJIN_TEST,
        privateKey: '72B08ACF80558B285EADA206BB1226A44038C65AC4649108B2284591641657B5',
    },
};

export const getTestAccount = (name: string): Account => {
    if (!(name in TEST_ACCOUNTS)) {
        throw new Error('Test account with name: ' + name + ' could not be found in __mocks__/accounts.ts');
    }

    const spec = TEST_ACCOUNTS[name];
    return Account.createFromPrivateKey(spec.privateKey, spec.networkType);
};
