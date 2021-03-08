/**
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// external dependencies
import { Crypto, Password, Account, AccountRepository, AccountInfo, AccountType as sdkAccountType } from 'symbol-sdk';

// internal dependencies
import { AccountService } from './AccountService';
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';
import { DerivationPathLevels, DerivationService } from './DerivationService';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';

export class RemoteAccountService extends AccountService {
    /**
     * Derivation service
     */
    private derivationService: DerivationService;

    /**
     * Creates an instance of RemoteAccountService.
     * @param {AccountModel} account
     * @param {ProfileModel} profile
     * @param {AccountRepository} accountRepository
     */
    public constructor(
        private readonly account: AccountModel,
        private readonly profile: ProfileModel,
        private readonly accountRepository: AccountRepository,
    ) {
        super();
        this.derivationService = new DerivationService(profile.networkType);
    }

    /**
     * Gets the first available remote account
     * @param {Password} password
     * @returns {Promise<Account>}
     */
    public async getAvailableRemoteAccount(password: Password): Promise<Account> {
        const candidates = this.getRemoteAccounts(password);
        const addresses = candidates.map(({ address }) => address);
        const accountsInfo = await this.accountRepository.getAccountsInfo(addresses).toPromise();
        return this.getFirstFreeRemoteAccount(candidates, accountsInfo);
    }

    /**
     * Gets remote account candidates from the derivation of the account seed
     * @private
     * @param {Password} password
     * @param {number} [numberOfPaths=10]
     * @returns {Account[]}
     */
    private getRemoteAccounts(password: Password, numberOfPaths = 10): Account[] {
        switch (this.account.type) {
            case AccountType.SEED:
                return this.getRemoteAccountsFromSeed(password, numberOfPaths);

            // @TODO: implement private key
            // @TODO: show error to the user
            case AccountType.KEYSTORE:
            case AccountType.OPT_IN:
            case AccountType.PRIVATE_KEY:
                throw new Error('remote account generation from Private Key is not supported');
            case AccountType.TREZOR:
                throw new Error('remote account generation from Trezor wallet is not supported');

            default:
                throw new Error('Something went wrong at getRemoteAccountPrivateKey');
        }
    }

    /**
     * Gets remote account candidates from the derivation of the account seed
     * @private
     * @param {Password} password
     * @param {number} [numberOfPaths=10]
     * @returns {Account[]}
     */
    private getRemoteAccountsFromSeed(password: Password, numberOfPaths = 10): Account[] {
        const paths = [...Array(numberOfPaths).keys()].map((i) =>
            this.derivationService.incrementPathLevel(this.account.path, DerivationPathLevels.Remote, i),
        );

        const encSeed = this.profile.seed;
        const passphrase = Crypto.decrypt(encSeed, password.value);
        const mnemonic = new MnemonicPassPhrase(passphrase);
        return this.generateAccountsFromPaths(mnemonic, this.profile.networkType, paths);
    }

    /**
     * Query the network with the remote account candidates,
     * Returns the first eligible account
     * @private
     * @param {Account[]} remoteAccounts
     * @param {AccountInfo[]} accountsInfo
     * @returns {Account}
     */
    private getFirstFreeRemoteAccount(remoteAccounts: Account[], accountsInfo: AccountInfo[]): Account {
        if (!accountsInfo.length) {
            return remoteAccounts[0];
        }

        const linkableRemoteAccounts = remoteAccounts.filter(({ address }) => {
            const matchedAccountInfo = accountsInfo.find((ai) => ai.address.plain() === address.plain());
            return matchedAccountInfo === undefined || RemoteAccountService.isLinkable(matchedAccountInfo);
        });

        if (!linkableRemoteAccounts.length) {
            throw new Error('Could not find a free remote account');
        }

        return linkableRemoteAccounts[0];
    }

    /**
     * Whether an account is linkable as a remote account
     * @static
     * @param {AccountInfo} accountInfo
     * @returns {boolean}
     */
    static isLinkable(accountInfo: AccountInfo): boolean {
        return accountInfo?.accountType === sdkAccountType.Remote_Unlinked;
    }
}
