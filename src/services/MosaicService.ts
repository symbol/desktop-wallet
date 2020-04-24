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
// external dependencies
import _ from 'lodash'
import {AccountInfo, Address, MosaicId, MosaicInfo, MosaicNames, NamespaceId, RepositoryFactory, UInt64} from 'symbol-sdk'
import {combineLatest, Observable, of, forkJoin} from 'rxjs'
import {flatMap, map, tap, toArray} from 'rxjs/operators'

// internal dependencies
import {fromIterable} from 'rxjs/internal-compatibility'
import {MosaicConfigurationModel} from '@/core/database/entities/MosaicConfigurationModel'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {NetworkModel} from '@/core/database/entities/NetworkModel'
import {ObservableHelpers} from '@/core/utils/ObservableHelpers'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'
import {TimeHelpers} from '@/core/utils/TimeHelpers'

// custom types
export type ExpirationStatus = 'unlimited' | 'expired' | string | number

// TODO. Can this interface be removed?
export interface AttachedMosaic {
  id: MosaicId | NamespaceId
  mosaicHex: string
  /**
   * Relative amount
   */
  amount: number
}


interface MosaicBalance {
  mosaicId: MosaicId
  amount: UInt64
  address: Address
}

/**
 * The service in charge of loading and caching anything related to Mosaics from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 *
 * The service also holds configuration about the current mosaics, for example which mosaic
 * balances are currently hidden.
 */
export class MosaicService {

  /**
   * Store that caches the mosaic information of the current accounts when returned from rest.
   */
  private readonly mosaicDataStorage = new SimpleObjectStorage<MosaicModel[]>('mosaicData')

  /**
   * The storage to keep user configuration around mosaics.  For example, the balance hidden
   * feature.
   */
  private readonly mosaicConfigurationsStorage = new SimpleObjectStorage<Record<string, MosaicConfigurationModel>>(
    'mosaicConfiguration')

  /**
   * Store that caches the information around the network currency.
   */
  private readonly networkCurrencyStorage = new SimpleObjectStorage<NetworkCurrencyModel[]>(
    'networkCurrencyStorage')

  /**
   * Gets currency mosaicId and harvesting mosaicId from the stored network configuration
   * @returns {MosaicId[]}
   */
  private getNetworkCurrenciesIds(): MosaicId[] {
    const {networkConfiguration} = new SimpleObjectStorage<NetworkModel>('network').get()
    const {currencyMosaicId, harvestingMosaicId} = networkConfiguration
    return [new MosaicId(currencyMosaicId), new MosaicId(harvestingMosaicId)]
  }

  /**
   * This method loads and caches the mosaic information for the given accounts.
   * The returned Observable will announce the cached information first, then the rest returned
   * information (if possible).
   *
   * @param repositoryFactory
   * @param networkCurrencies
   * @param accountsInfo
   */
  public getMosaics(repositoryFactory: RepositoryFactory, networkCurrencies: NetworkCurrencyModel[],
    accountsInfo: AccountInfo[]): Observable<MosaicModel[]> {
    const mosaicDataList = this.loadMosaicData()
    const resolvedBalancesObservable = this.resolveBalances(repositoryFactory, accountsInfo)
    const accountAddresses = accountsInfo.map(a => a.address)
    const mosaicsFromAccountsObservable = repositoryFactory.createMosaicRepository()
      .getMosaicsFromAccounts(accountAddresses)

    return combineLatest([ resolvedBalancesObservable, mosaicsFromAccountsObservable ])
      .pipe(flatMap(([ balances, owedMosaics ]) => {
        const mosaicIds = _.uniqBy([ ...balances.map(m => m.mosaicId), ...owedMosaics.map(o => o.id) ], m => m.toHex())
        const nameObservables = repositoryFactory.createNamespaceRepository().getMosaicsNames(mosaicIds)
        const mosaicInfoObservable = repositoryFactory.createMosaicRepository().getMosaics(mosaicIds)
        return combineLatest([ nameObservables, mosaicInfoObservable ]).pipe(map(([ names, mosaicInfos ]) => {
          return this.toMosaicDtos(balances, mosaicInfos, names, networkCurrencies, accountAddresses)
        }))
      })).pipe(tap((d) => this.saveMosaicData(d)),
        ObservableHelpers.defaultFirst(mosaicDataList))
  }

  private getName(mosaicNames: MosaicNames[], accountMosaicDto: MosaicId): string {
    return _.first(
      mosaicNames.filter(n => n.mosaicId.equals(accountMosaicDto))
        .filter(n => n.names.length).map(n => n.names[0].name))
  }


  private toMosaicDtos(balances: MosaicBalance[],
    mosaicDtos: MosaicInfo[],
    mosaicNames: MosaicNames[],
    networkCurrencies: NetworkCurrencyModel[],
    accountAddresses: Address[]): MosaicModel[] {

    return _.flatten(accountAddresses.map((address) => {
      return mosaicDtos.map(mosaicDto => {
        const name = this.getName(mosaicNames, mosaicDto.id)
        const isCurrencyMosaic = !!networkCurrencies.find(n => n.mosaicIdHex == mosaicDto.id.toHex())
        const balance = balances.find(
          balance => balance.mosaicId.equals(mosaicDto.id) && balance.address.equals(address))
        return new MosaicModel(address.plain(), mosaicDto.owner.address.plain(), name, isCurrencyMosaic,
          balance && balance.amount.compact() || 0, mosaicDto)
      })
    }))
  }

  private resolveBalances(repositoryFactory: RepositoryFactory,
    accountsInfo: AccountInfo[]): Observable<MosaicBalance[]> {
    const mosaicIdOrAliases = _.flatten(accountsInfo.map(a => a.mosaics.map(m => m.id)))
    const mosaicIdOrAliasesUnique = _.uniqBy(mosaicIdOrAliases, m => m.toHex())
    return this.resolveMosaicIds(repositoryFactory, mosaicIdOrAliasesUnique).pipe(
      map(resolveMosaicIds => {
        return _.flatten(accountsInfo.map(a => {
          return a.mosaics.map(m => {
            return {
              address: a.address,
              amount: m.amount,
              mosaicId: resolveMosaicIds.find(pair => pair.from.equals(m.id)).to,
            }
          })
        }))
      }),
    )
  }


  private resolveMosaicIds(repositoryFactory: RepositoryFactory,
    ids: (NamespaceId | MosaicId)[]): Observable<{ from: (NamespaceId | MosaicId), to: MosaicId }[]> {
    const namespaceRepository = repositoryFactory.createNamespaceRepository()
    return fromIterable(ids).pipe(flatMap(id => {
      if (id instanceof MosaicId) {
        return of({from: id, to: id as MosaicId})
      } else {
        const linkedMosaicIdObservable = namespaceRepository.getLinkedMosaicId(id as NamespaceId)
        return linkedMosaicIdObservable.pipe(map((to) => {
          return {from: id, to: to}
        }))
      }
    })).pipe(toArray())
  }


  /**
   * This method returns the list of {@link NetworkCurrencyModel} found in block 1.
   *
   * The intent of this method is to resolve the configured main (like cat.currency or symbol.xym)
   * and harvest currencies (cat.harvest). More currencies may be defined in the block one.
   *
   * @param repositoryFactory tge repository factory used to load the block 1 transactions
   * @return the list of {@link NetworkCurrencyModel} found in block 1.
   */
  // TODO move this to a service in the SDK.
  public getNetworkCurrencies(repositoryFactory: RepositoryFactory): Observable<NetworkCurrencyModel[]> {
    const storedNetworkCurrencies = this.networkCurrencyStorage.get()
    const mosaicHttp = repositoryFactory.createMosaicRepository()
    const namespaceHttp = repositoryFactory.createNamespaceRepository()

    // get network currencies ids from stored network configuration
    const [currencyMosaicId, harvestingMosaicId] = this.getNetworkCurrenciesIds()

    // filter out harvesting currency if it is the same as the network currency
    const mosaicIds = currencyMosaicId.equals(harvestingMosaicId)
      ? [currencyMosaicId] : [currencyMosaicId, harvestingMosaicId]

    // get mosaicInfo and mosaic names from the network,
    // build network currency models
    return forkJoin({
      mosaicsInfo: mosaicHttp.getMosaics(mosaicIds).toPromise(),
      mosaicNames: namespaceHttp.getMosaicsNames(mosaicIds).toPromise(),
    }).pipe(
      map(({mosaicsInfo, mosaicNames}) => mosaicsInfo.map(mosaicInfo => {
        const thisMosaicNames = mosaicNames.find(mn => mn.mosaicId.equals(mosaicInfo.id))
        if (!thisMosaicNames) {throw new Error('thisMosaicNames not found at getNetworkCurrencies')}
        return this.getNetworkCurrency(mosaicInfo, thisMosaicNames)
      })
      ),
      tap(d => this.networkCurrencyStorage.set(d)),
      ObservableHelpers.defaultFirst(storedNetworkCurrencies)
    )
  }

  private loadMosaicData(): MosaicModel[] {
    return this.mosaicDataStorage.get()
  }

  private saveMosaicData(mosaics: MosaicModel[]) {
    this.mosaicDataStorage.set(mosaics)
  }

  public reset() {
    this.mosaicDataStorage.remove()
    this.networkCurrencyStorage.remove()
  }

  /**
   * Creates a network currency model given mosaic info and mosaic names
   * @param {MosaicInfo} mosaicInfo
   * @param {MosaicNames} mosaicName
   * @returns {(NetworkCurrencyModel | undefined)}
   */
  private getNetworkCurrency(
    mosaicInfo: MosaicInfo,
    mosaicName: MosaicNames,
  ): NetworkCurrencyModel | undefined {
    const mosaicId = mosaicInfo.id

    const namespaceName = this.getName([mosaicName], mosaicId)
    if (!namespaceName) {throw new Error('could not get namespaceName at getNetworkCurrency')}

    const namespaceId = new NamespaceId(namespaceName)

    const ticker = namespaceId && namespaceId.fullName
      && namespaceId.fullName.split('.').pop().toUpperCase() || undefined

    return new NetworkCurrencyModel(
      mosaicId.toHex(),
      namespaceId.toHex(),
      namespaceId.fullName,
      mosaicInfo.divisibility,
      mosaicInfo.flags.transferable,
      mosaicInfo.flags.supplyMutable,
      mosaicInfo.flags.restrictable,
      ticker,
    )
  }

  /**
   *
   * Utility method that returns the mosaic expiration status
   * @param mosaicInfo the mosaic info
   * @param currentHeight
   * @param blockGenerationTargetTime
   */
  public static getExpiration(mosaicInfo: MosaicModel, currentHeight: number,
    blockGenerationTargetTime: number): ExpirationStatus {
    const duration = mosaicInfo.duration
    const startHeight = mosaicInfo.height

    // unlimited duration mosaics are flagged as duration == 0
    if (duration === 0) return 'unlimited'

    // get current height
    // calculate expiration
    const expiresIn = startHeight + duration - (currentHeight || 0)
    if (expiresIn <= 0) return 'expired'
    // number of blocks remaining
    return TimeHelpers.durationToRelativeTime(expiresIn, blockGenerationTargetTime)
  }

  public getMosaicConfigurations(): Record<string, MosaicConfigurationModel> {
    return this.mosaicConfigurationsStorage.get() || {}
  }

  public getMosaicConfiguration(mosaicId: MosaicId): MosaicConfigurationModel {
    return this.getMosaicConfigurations()[mosaicId.toHex()] || new MosaicConfigurationModel()
  }

  public changeMosaicConfiguration(mosaicId: MosaicId,
    newConfigs: any): Record<string, MosaicConfigurationModel> {
    const mosaicConfigurationsStorage = this.getMosaicConfigurations()
    mosaicConfigurationsStorage[mosaicId.toHex()] = {
      ...this.getMosaicConfiguration(mosaicId), ...newConfigs,
    }
    this.mosaicConfigurationsStorage.set(mosaicConfigurationsStorage)
    return mosaicConfigurationsStorage
  }
}
