/*
 * Copyright 2020 NEM Foundation (https://nem.io)
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
  RepositoryFactoryHttp,
  Address,
  AccountInfo,
  UInt64,
  AccountType,
  SupplementalPublicKeys,
  AccountRepository,
} from 'symbol-sdk'
import { RemoteAccountService } from '@/services/RemoteAccountService'
import { WalletsModel2 } from '@MOCKS/Accounts'
import { getTestProfile } from '@MOCKS/profiles'
import { Observable, of } from 'rxjs'

describe('services/RemoteAccountService', () => {
  describe('getAvailableRemotePublicKey()', () => {
    test('should return the first linkable public key', async (done) => {
      // prepare
      const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
        createAccountRepository(): AccountRepository {
          return new (class AccountRepositoryForTest implements AccountRepository {
            getAccountInfo(address: Address): Observable<AccountInfo> {
              return of({ address: Address.createFromRawAddress(WalletsModel2.address) } as AccountInfo)
            }

            getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
              return of([{ address: Address.createFromRawAddress(WalletsModel2.address) } as AccountInfo])
            }
          })()
        }
      })('http://localhost:3000', {
        networkType: NetworkType.TEST_NET,
        generationHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
      })
      repositoryFactory.getNetworkType = jest.fn(() => of(NetworkType.MIJIN_TEST))

      // act
      const remoteAccount = await new RemoteAccountService(
        WalletsModel2,
        getTestProfile('profile1'),
        repositoryFactory.createAccountRepository(),
      ).getAvailableRemoteAccount(new Password('password'))

      expect(remoteAccount.publicKey).toBe('BB6FF99C52B3C9D880D5E59C10AD696D90CF84A8E825CCA16F584A8BCE4D17E6')
      done()
    })

    test('should return the second public key if the first one is not availalbe', async (done) => {
      // prepare
      const fakeLinkedAccount = new AccountInfo(
        Address.createFromPublicKey(
          'BB6FF99C52B3C9D880D5E59C10AD696D90CF84A8E825CCA16F584A8BCE4D17E6',
          NetworkType.MIJIN_TEST,
        ),
        UInt64.fromUint(0),
        'BB6FF99C52B3C9D880D5E59C10AD696D90CF84A8E825CCA16F584A8BCE4D17E6',
        UInt64.fromUint(0),
        AccountType.Remote,
        new SupplementalPublicKeys(),
        [],
        [],
        UInt64.fromUint(0),
        UInt64.fromUint(0),
      )

      const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
        createAccountRepository(): AccountRepository {
          return new (class AccountRepositoryForTest implements AccountRepository {
            getAccountInfo(address: Address): Observable<AccountInfo> {
              return of({ address: fakeLinkedAccount.address } as AccountInfo)
            }

            getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
              return of([fakeLinkedAccount])
            }
          })()
        }
      })('http://localhost:3000', {
        networkType: NetworkType.TEST_NET,
        generationHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
      })
      repositoryFactory.getNetworkType = jest.fn(() => of(NetworkType.MIJIN_TEST))

      // act
      const remoteAccount = await new RemoteAccountService(
        WalletsModel2,
        getTestProfile('profile1'),
        repositoryFactory.createAccountRepository(),
      ).getAvailableRemoteAccount(new Password('password'))

      expect(remoteAccount.publicKey).toBe('FA0939C5F11FC89A8EB997329C64AC785CDD23AE9D73C3E060D3B5FF0BABC2A4')
      done()
    })
  })
})
