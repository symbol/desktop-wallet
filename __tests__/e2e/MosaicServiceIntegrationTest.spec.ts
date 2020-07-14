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
import { Address, RepositoryFactoryHttp, MosaicRepository, Page, TransactionSearchCriteria, NamespaceRepository, MosaicInfo, MosaicId, UInt64, NetworkType, MosaicFlags, AccountRepository, AccountInfo } from 'symbol-sdk'
import { MosaicService } from '@/services/MosaicService'
import networkConfig from '../../config/network.conf.json'
import { Observable, of } from 'rxjs'
import { WalletsModel2 } from '@MOCKS/Accounts'

const address1 = Address.createFromRawAddress('TAD5BAHLOIXCRRB6GU2H72HPXMBBVAEUQRYPHBY')
const address2 = Address.createFromRawAddress('TAWJ2M7BGKWGBPOUGD5NDKHYDDQ7OQD26HJMMQQ')
const address3 = Address.createFromRawAddress('TDARSPFSZVLYGBOHGOVWIKAZ4FGGDPGZ3DSS7CQ')
const address4 = Address.createFromRawAddress('TCEPWMC37ZGXOGOXQOAGDYPI7YH65HLXIMLKNOQ')
const address5 = Address.createFromRawAddress('TAUDGSA7IEFH6MRGXO26SUU3W5ICF7OLLI3O7CY')

const mosaicService = new MosaicService()
const realUrl = 'http://api-01.us-west-1.symboldev.network:3000'

const fakeMosaicInfo = new MosaicInfo(
  '59FDA0733F17CF0001772CBC',
  new MosaicId([3646934825, 3576016193]),
  new UInt64([3403414400, 2095475]),
  new UInt64([1, 0]),
  Address.createFromPublicKey(
    'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
    NetworkType.MIJIN_TEST,
  ),
  1,
  new MosaicFlags(7),
  3,
  UInt64.fromNumericString('1000'),
);
const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
  createMosaicRepository(): MosaicRepository {
    return new (class MosaicRepositoryForTest implements MosaicRepository {
      getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> { return of(fakeMosaicInfo) }
      getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]> { return of([fakeMosaicInfo]) }
      search(criteria: TransactionSearchCriteria): Observable<Page<MosaicInfo>> { return of(new Page([fakeMosaicInfo], 1, 1, 1, 1)) }
    })()
  }
  createAccountRepository(): AccountRepository {
    return new (class AccountRepositoryForTest implements AccountRepository {
      getAccountInfo(address: Address): Observable<AccountInfo> {
        return of({address: Address.createFromRawAddress(WalletsModel2.address)} as AccountInfo)
      }

      getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
        return of([{address: Address.createFromRawAddress(WalletsModel2.address)} as AccountInfo])
      }
    })()
  }
})('http://localhost:3000', {
  networkType: NetworkType.TEST_NET,
  generationHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
})
repositoryFactory.getNetworkType = jest.fn(() => of(NetworkType.MIJIN_TEST))
repositoryFactory.getGenerationHash = jest.fn(() => of('Some Gen Hash'))

describe.skip('services/MosaicService', () => {
  test('getMosaics all addresses', async () => {
    const generationHash = await repositoryFactory.getGenerationHash().toPromise()
    const { networkCurrency } = await mosaicService
      .getNetworkCurrencies(repositoryFactory, generationHash, networkConfig.networkConfigurationDefaults)
      .toPromise()
    const addresses: Address[] = [address1, address2, address3, address4, address5]
    const accountInfos = await repositoryFactory.createAccountRepository().getAccountsInfo(addresses).toPromise()
    const result = await mosaicService
      .getMosaics(repositoryFactory, generationHash, networkCurrency, accountInfos)
      .toPromise()
    console.log(JSON.stringify(result, null, 2))
  })

  test('getMosaics account 1 addresses', async () => {
    const generationHash = await repositoryFactory.getGenerationHash().toPromise()
    const { networkCurrency } = await mosaicService
      .getNetworkCurrencies(repositoryFactory, generationHash, networkConfig.networkConfigurationDefaults)
      .toPromise()
    const addresses: Address[] = [address1]
    const accountInfos = await repositoryFactory.createAccountRepository().getAccountsInfo(addresses).toPromise()
    const result = await mosaicService
      .getMosaics(repositoryFactory, generationHash, networkCurrency, accountInfos)
      .toPromise()
    console.log(JSON.stringify(result, null, 2))
  })

  test('getMosaics account 3 addresses', async () => {
    const generationHash = await repositoryFactory.getGenerationHash().toPromise()
    const { networkCurrency } = await mosaicService
      .getNetworkCurrencies(repositoryFactory, generationHash, networkConfig.networkConfigurationDefaults)
      .toPromise()
    const addresses: Address[] = [address3]
    const accountInfos = await repositoryFactory.createAccountRepository().getAccountsInfo(addresses).toPromise()
    const result = await mosaicService
      .getMosaics(repositoryFactory, generationHash, networkCurrency, accountInfos)
      .toPromise()
    console.log(JSON.stringify(result, null, 2))
  })
})
