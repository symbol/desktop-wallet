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
import { NetworkType, Account, Password, Crypto } from 'symbol-sdk';
import { AccountService } from '@/services/AccountService';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';
import { account1Params, WalletsModel1 } from '@MOCKS/Accounts';

// Sample mnemonic passphrase
const mnemonic = new MnemonicPassPhrase(
    'limit sing post cross matrix pizza topple rack cigar skirt girl hurt outer humble fancy elegant bunker pipe ensure grain regret bulk renew trim',
);

// Standard account paths
const standardPaths_Main = {
    1: "m/44'/4343'/0'/0'/0'",
    2: "m/44'/4343'/1'/0'/0'",
    3: "m/44'/4343'/2'/0'/0'",
};

const standardPaths_Test = {
    1: "m/44'/1'/0'/0'/0'",
    2: "m/44'/1'/1'/0'/0'",
    3: "m/44'/1'/2'/0'/0'",
};

// Expected private keys from derivation of mnemonic with standard account paths
const expectedPrivateKeys_Main = {
    1: '017210E314BE6543480C2BB176F7047D6EEB04C2CEBEE5A80C44970858434E98',
    2: '82B4F074F64E35D889E5754A6063DAB8F0F2B23A91039E79EBBBA47C18BA304B',
    3: '2C4795674D21D3BEED4229FBD76FF6F41D8BF11F1F5A880EF8132160DC787BEC',
};

const expectedPrivateKeys_Test = {
    1: '6974CFCA898ADB4F2E798D5C60D193E1410C765ABBD0347BC2C1C4AD8B56D142',
    2: 'E63C57B2036B7851AD6C3C368824536EC73A709A57BBC577E66759A566968D58',
    3: 'F6852C448484B5B76BDD4B48BF712FD554F2EB4CACC401C572798A9C2EE53BC7',
};

// Accounts from private keys
const expectedAccounts_Main = Object.values(expectedPrivateKeys_Main).map((key) => Account.createFromPrivateKey(key, NetworkType.MAIN_NET));
const expectedAccounts_Test = Object.values(expectedPrivateKeys_Test).map((key) => Account.createFromPrivateKey(key, NetworkType.TEST_NET));
// max 2+2 generations
const generatedAccounts = new AccountService().generateAccountsFromMnemonic(mnemonic, NetworkType.MAIN_NET, 2);
const generatedAddresses = new AccountService().getAddressesFromMnemonic(mnemonic, NetworkType.MAIN_NET, 2);

const generatedAccounts_test = new AccountService().generateAccountsFromMnemonic(mnemonic, NetworkType.TEST_NET, 2);
const generatedAddresses_test = new AccountService().getAddressesFromMnemonic(mnemonic, NetworkType.TEST_NET, 2);

describe('services/AccountService_Main', () => {
    describe('generateAccountsFromMnemonic() should', () => {
        test('generate correct child account given mnemonic', () => {
            expect(generatedAccounts).toBeDefined();
            expect(generatedAccounts.length).toBe(2);
            expect(generatedAccounts[0].privateKey).toBe(expectedAccounts_Main[0].privateKey);
            expect(generatedAccounts[0].publicKey).toBe(expectedAccounts_Main[0].publicKey);
            expect(generatedAccounts[0].address.plain()).toBe(expectedAccounts_Main[0].address.plain());
        });

        test('generate multiple correct children accounts given mnemonic and count', () => {
            expect(generatedAccounts).toBeDefined();
            expect(generatedAccounts.length).toBe(2);
            expect(generatedAccounts[0].privateKey).toBe(expectedAccounts_Main[0].privateKey);
            expect(generatedAccounts[1].privateKey).toBe(expectedAccounts_Main[1].privateKey);
        });
    });

    describe('generateAccountsFromPaths() should', () => {
        test('generate correct account given mnemonic and paths', () => {
            const accounts = new AccountService().generateAccountsFromPaths(
                mnemonic,
                NetworkType.MAIN_NET,
                Object.values(standardPaths_Main).slice(0, 1),
            );

            expect(accounts).toBeDefined();
            expect(accounts.length).toBe(1);
            expect(accounts[0].privateKey).toBe(expectedAccounts_Main[0].privateKey);
            expect(accounts[0].publicKey).toBe(expectedAccounts_Main[0].publicKey);
            expect(accounts[0].address.plain()).toBe(expectedAccounts_Main[0].address.plain());
        });
    });

    describe('getAddressesFromMnemonic() should', () => {
        test('generate correct address given mnemonic', () => {
            expect(generatedAddresses).toBeDefined();
            expect(generatedAddresses.length).toBe(2);
            expect(generatedAddresses[0].plain()).toBe(expectedAccounts_Main[0].address.plain());
        });

        test('generate multiple correct addresses given mnemonic and count', () => {
            expect(generatedAddresses).toBeDefined();
            expect(generatedAddresses.length).toBe(2);
            expect(generatedAddresses[0].plain()).toBe(expectedAccounts_Main[0].address.plain());
            expect(generatedAddresses[1].plain()).toBe(expectedAccounts_Main[1].address.plain());
        });
    });

    describe('getAccountByPath() should', () => {
        test('generate correct account given mnemonic and path', () => {
            const account_3 = new AccountService().getAccountByPath(mnemonic, NetworkType.MAIN_NET, standardPaths_Main[3]);

            expect(account_3.privateKey).toBe(expectedAccounts_Main[2].privateKey);
        });
    });

    describe('updateWalletPassword', () => {
        test('should update an account password', () => {
            // initialize account service
            const service = new AccountService();

            // get initial encrypted private key values
            const initialEncPrivate = WalletsModel1.encryptedPrivateKey;

            // update the model
            const updatedWallet = service.updateWalletPassword(WalletsModel1, account1Params.password, new Password('password2'));

            // decrypt the new model's private key
            const newEncPrivate = updatedWallet.encryptedPrivateKey;
            const privateKey = Crypto.decrypt(newEncPrivate, 'password2');

            // assert the encrypted private key changed
            expect(newEncPrivate).not.toBe(initialEncPrivate);

            // assert the plain private key did not change
            expect(privateKey).toBe(account1Params.privateKey);
        });

        test('should throw if provided with an incorrect password', () => {
            const service = new AccountService();
            expect(() => {
                service.updateWalletPassword(WalletsModel1, new Password('wrong_password'), new Password('password2'));
            }).toThrow();
        });
    });
});

describe('services/AccountService_Test', () => {
    describe('generateAccountsFromMnemonic() should', () => {
        test('generate correct child account given mnemonic', () => {
            expect(generatedAccounts_test).toBeDefined();
            expect(generatedAccounts_test.length).toBe(2);
            expect(generatedAccounts_test[0].privateKey).toBe(expectedAccounts_Test[0].privateKey);
            expect(generatedAccounts_test[0].publicKey).toBe(expectedAccounts_Test[0].publicKey);
            expect(generatedAccounts_test[0].address.plain()).toBe(expectedAccounts_Test[0].address.plain());
        });

        test('generate multiple correct children accounts given mnemonic and count', () => {
            expect(generatedAccounts_test).toBeDefined();
            expect(generatedAccounts_test.length).toBe(2);
            expect(generatedAccounts_test[0].privateKey).toBe(expectedAccounts_Test[0].privateKey);
            expect(generatedAccounts_test[1].privateKey).toBe(expectedAccounts_Test[1].privateKey);
        });
    });

    describe('generateAccountsFromPaths() should', () => {
        test('generate correct account given mnemonic and paths', () => {
            const accounts = new AccountService().generateAccountsFromPaths(
                mnemonic,
                NetworkType.TEST_NET,
                Object.values(standardPaths_Test).slice(0, 1),
            );

            expect(accounts).toBeDefined();
            expect(accounts.length).toBe(1);
            expect(accounts[0].privateKey).toBe(expectedAccounts_Test[0].privateKey);
            expect(accounts[0].publicKey).toBe(expectedAccounts_Test[0].publicKey);
            expect(accounts[0].address.plain()).toBe(expectedAccounts_Test[0].address.plain());
        });
    });

    describe('getAddressesFromMnemonic() should', () => {
        test('generate correct address given mnemonic', () => {
            expect(generatedAddresses_test).toBeDefined();
            expect(generatedAddresses_test.length).toBe(2);
            expect(generatedAddresses_test[0].plain()).toBe(expectedAccounts_Test[0].address.plain());
        });

        test('generate multiple correct addresses given mnemonic and count', () => {
            expect(generatedAddresses_test).toBeDefined();
            expect(generatedAddresses_test.length).toBe(2);
            expect(generatedAddresses_test[0].plain()).toBe(expectedAccounts_Test[0].address.plain());
            expect(generatedAddresses_test[1].plain()).toBe(expectedAccounts_Test[1].address.plain());
        });
    });

    describe('getAccountByPath() should', () => {
        test('generate correct account given mnemonic and path', () => {
            const account_3 = new AccountService().getAccountByPath(mnemonic, NetworkType.TEST_NET, standardPaths_Test[3]);

            expect(account_3.privateKey).toBe(expectedAccounts_Test[2].privateKey);
        });
    });

    describe('updateWalletPassword', () => {
        test('should update an account password', () => {
            // initialize account service
            const service = new AccountService();

            // get initial encrypted private key values
            const initialEncPrivate = WalletsModel1.encryptedPrivateKey;

            // update the model
            const updatedWallet = service.updateWalletPassword(WalletsModel1, account1Params.password, new Password('password2'));

            // decrypt the new model's private key
            const newEncPrivate = updatedWallet.encryptedPrivateKey;
            const privateKey = Crypto.decrypt(newEncPrivate, 'password2');

            // assert the encrypted private key changed
            expect(newEncPrivate).not.toBe(initialEncPrivate);

            // assert the plain private key did not change
            expect(privateKey).toBe(account1Params.privateKey);
        });

        test('should throw if provided with an incorrect password', () => {
            const service = new AccountService();
            expect(() => {
                service.updateWalletPassword(WalletsModel1, new Password('wrong_password'), new Password('password2'));
            }).toThrow();
        });
    });
});
