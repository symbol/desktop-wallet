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
import {
    NetworkType,
    Password,
    Address,
    AccountInfo,
    AccountRepository,
    PublicAccount,
    Page,
    AccountType as sdkAccountType,
    RepositoryFactory,
    NetworkCurrencies,
} from 'symbol-sdk';
import { RemoteAccountService } from '@/services/RemoteAccountService';
import { WalletsModel2 } from '@MOCKS/Accounts';
import { getTestProfile } from '@MOCKS/profiles';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

const accountInfo = { address: Address.createFromRawAddress(WalletsModel2.address) } as AccountInfo;

const accountInfos = [
    {
        address: Address.createFromRawAddress(WalletsModel2.address),
        accountType: sdkAccountType.Main,
    } as AccountInfo,
    {
        address: PublicAccount.createFromPublicKey('FA0939C5F11FC89A8EB997329C64AC785CDD23AE9D73C3E060D3B5FF0BABC2A4', NetworkType.TEST_NET)
            .address,
        accountType: sdkAccountType.Remote_Unlinked,
    } as AccountInfo,
];

const mockRepoFactory = mock<RepositoryFactory>();

const mockAccountRepository = mock<AccountRepository>();

when(mockAccountRepository.getAccountInfo(anything())).thenReturn(of(accountInfo));
when(mockAccountRepository.getAccountsInfo(anything())).thenReturn(of(accountInfos));
when(mockAccountRepository.search(anything())).thenReturn(of(new Page(accountInfos, 1, 2)));

const accountRepository = instance(mockAccountRepository);
when(mockRepoFactory.createAccountRepository()).thenReturn(accountRepository);

when(mockRepoFactory.getEpochAdjustment()).thenReturn(of(1573430400));
when(mockRepoFactory.getGenerationHash()).thenReturn(of('Some Gen Hash'));
when(mockRepoFactory.getNetworkType()).thenReturn(of(NetworkType.MIJIN_TEST));
when(mockRepoFactory.getCurrencies()).thenReturn(of(NetworkCurrencies.PUBLIC));
const repositoryFactory = instance(mockRepoFactory);

describe('services/RemoteAccountService', () => {
    describe('getAvailableRemotePublicKey()', () => {
        test('should return the first linkable public key', async (done) => {
            // prepare

            // act
            const remoteAccount = await new RemoteAccountService(
                WalletsModel2,
                getTestProfile('profile1'),
                repositoryFactory.createAccountRepository(),
            ).getAvailableRemoteAccount(new Password('password'));

            expect(remoteAccount.publicKey).toBe('C2E5342E7853CCD120136191A6CE8879CCDC42D56520A3180C025292B1AAB68A');
            done();
        });
    });
});
