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

import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {combineLatest, Observable, of} from 'rxjs'
import * as _ from 'lodash'
import {AccountInfo, MosaicAliasTransaction, MosaicDefinitionTransaction, MosaicId, MosaicInfo, MosaicNames, NamespaceId, NamespaceRegistrationTransaction, NamespaceRegistrationType, QueryParams, RepositoryFactory, TransactionType, UInt64} from 'symbol-sdk'
import {flatMap, map, tap, toArray} from 'rxjs/operators'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {ObservableHelpers} from '@/core/utils/ObservableHelpers'
import {fromIterable} from 'rxjs/internal-compatibility'
import {MosaicConfigurationModel} from '@/core/database/entities/MosaicConfigurationModel'

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
   * Store that caches the information around the network currency. The network currency is
   * currently calculated from the block 1 transactions.
   *
   * In the near future, rest will return the information without loading block 1.
   */
  private readonly networkCurrencyStorage = new SimpleObjectStorage<NetworkCurrencyModel[]>(
    'networkCurrencyStorage')


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
    const mosaicIdOrAliases = _.flatten(accountsInfo.map(a => a.mosaics.map(m => m.id))
      .concat(networkCurrencies.map(n => new MosaicId(n.mosaicIdHex))))
    return this.resolveMosaicIds(repositoryFactory, mosaicIdOrAliases).pipe(flatMap(mosaicIds => {
      const nameObservables = repositoryFactory.createNamespaceRepository()
        .getMosaicsNames(mosaicIds)
      const mosaicInfoObservable = repositoryFactory.createMosaicRepository().getMosaics(mosaicIds)
      return combineLatest([ nameObservables, mosaicInfoObservable ]).pipe(map(p => {
        const names = p[0]
        const mosaicInfos = p[1]
        return this.toMosaicDtos(accountsInfo, mosaicInfos, names, networkCurrencies)
      }))
    }),
    ).pipe(tap((d) => this.saveMosaicData(d)),
      ObservableHelpers.defaultFirst(mosaicDataList))
  }

  /**
   *
   * Utility method that returns the mosaic expiration status
   * @param mosaicInfo the mosaic info
   * @param currentHeight
   */
  public static getExpiration(mosaicInfo: MosaicModel, currentHeight: number): ExpirationStatus {
    const duration = mosaicInfo.duration
    const startHeight = mosaicInfo.height

    // unlimited duration mosaics are flagged as duration == 0
    if (duration === 0) return 'unlimited'

    // get current height
    // calculate expiration
    const expiresIn = startHeight + duration - (currentHeight || 0)
    if (expiresIn <= 0) return 'expired'
    // number of blocks remaining
    return TimeHelpers.durationToRelativeTime(expiresIn)
  }


  private toMosaicDtos(accountDtos: AccountInfo[], mosaicDtos: MosaicInfo[],
    mosaicNames: MosaicNames[],
    networkCurrencies: NetworkCurrencyModel[]): MosaicModel[] {
    return _.flatten(accountDtos.map(accountDto => {
      return accountDto.mosaics.map(accountMosaicDto => {
        const name = _.first(
          mosaicNames.filter(n => n.mosaicId.toHex() == accountMosaicDto.id.toHex())
            .flatMap(n => n.names).map(n => n.name))
        const mosaicDto = mosaicDtos.find(n => n.id.toHex() === accountMosaicDto.id.toHex())
        const isCurrencyMosaic = !!networkCurrencies.find(
          n => n.mosaicIdHex == accountMosaicDto.id.toHex())
        return new MosaicModel(accountDto.address.plain(), mosaicDto.owner.address.plain(), name,
          isCurrencyMosaic,
          accountMosaicDto.amount.compact(), mosaicDto)
      })
    }))
  }


  private resolveMosaicIds(repositoryFactory: RepositoryFactory,
    ids: (NamespaceId | MosaicId)[]): Observable<MosaicId[]> {
    const namespaceRepository = repositoryFactory.createNamespaceRepository()
    return fromIterable(ids).pipe(flatMap(id => {
      if (id instanceof MosaicId) {
        return of(id as MosaicId)
      } else {
        return namespaceRepository.getLinkedMosaicId(id as NamespaceId)
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
  public getNetworkCurrencies(repositoryFactory: RepositoryFactory): Observable<NetworkCurrencyModel[]> {
    const storedNetworkCurrencies = this.networkCurrencyStorage.get()
    const blockHttp = repositoryFactory.createBlockRepository()
    // TODO move this to a service in the SDK.
    return blockHttp.getBlockTransactions(UInt64.fromUint(1), new QueryParams({pageSize: 100}))
      .pipe(flatMap(transactions => {
        const mosaicTransactions = transactions.filter(
          t => t.type == TransactionType.MOSAIC_DEFINITION).map(t => t as MosaicDefinitionTransaction)
        const aliasTransactions = transactions.filter(t => t.type == TransactionType.MOSAIC_ALIAS)
          .map(t => t as MosaicAliasTransaction)
        const namespaceRegistrations = transactions.filter(
          t => t.type == TransactionType.NAMESPACE_REGISTRATION)
          .map(t => t as NamespaceRegistrationTransaction)
        const networkCurrencies = mosaicTransactions.map(mosaicTransaction => {
          const mosaicAliasTransactions = aliasTransactions.filter(
            a => a.mosaicId.toHex() == mosaicTransaction.mosaicId.toHex())
          return mosaicAliasTransactions.map(mosaicAliasTransaction => this.getNetworkCurrency(
            mosaicTransaction, mosaicAliasTransaction,
            namespaceRegistrations)).filter(c => c)
        })
        return networkCurrencies
      })).pipe(tap(d => this.networkCurrencyStorage.set(d)),
        ObservableHelpers.defaultFirst(storedNetworkCurrencies))
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
   * This method tries to {@link NetworkCurrencyModel} from the original {@link
    * MosaicDefinitionTransaction} and {@link MosaicAliasTransaction}.
   *
   * @param mosaicTransaction the original mosiac transaction
   * @param mosaicAliasTransaction the original mosaic alias transaction used to know the
   * mosaic/currency namespace
   * @param namespaceRegistrations the list of namespace registration used to resolve the
   * mosaic/currency full name
   * @return the {@link NetworkCurrencyModel} if it can be resolved.
   */
  private getNetworkCurrency(mosaicTransaction: MosaicDefinitionTransaction,
    mosaicAliasTransaction: MosaicAliasTransaction,
    namespaceRegistrations: NamespaceRegistrationTransaction[]): NetworkCurrencyModel | undefined {

    const mosaicId = mosaicAliasTransaction.mosaicId
    const namespaceName = this.getNamespaceFullName(namespaceRegistrations,
      mosaicAliasTransaction.namespaceId)
    if (!namespaceName) {
      return undefined
    }
    const namespaceId = new NamespaceId(namespaceName)
    const ticker = namespaceId && namespaceId.fullName && namespaceId.fullName.split('.').pop()
      .toUpperCase() || undefined
    return new NetworkCurrencyModel(mosaicId.toHex(), namespaceId.toHex(), namespaceId.fullName,
      mosaicTransaction.divisibility, mosaicTransaction.flags.transferable,
      mosaicTransaction.flags.supplyMutable, mosaicTransaction.flags.restrictable, ticker)
  }

  // }
  /**
   * This method resolves the full name of a leaf namespace if possible. It used the completed
   * {@link NamespaceRegistrationTransaction} and creates the full name recursively from button
   * (leaf) up (root)
   *
   * @param transactions the {@link NamespaceRegistrationTransaction} list
   * @param namespaceId the leaf namespace.
   * @return the full name of the namespace if all the parents namespace can be resolved.
   */
  private getNamespaceFullName(transactions: NamespaceRegistrationTransaction[],
    namespaceId: NamespaceId): string | undefined {
    if (namespaceId.fullName) {
      return namespaceId.fullName
    }
    const namespaceRegistrationTransaction = transactions.find(
      tx => tx.namespaceId.toHex() === namespaceId.toHex())
    if (!namespaceRegistrationTransaction) {
      return undefined
    }
    if (namespaceRegistrationTransaction.registrationType == NamespaceRegistrationType.RootNamespace) {
      return namespaceRegistrationTransaction.namespaceName
    } else {
      const parentNamespaceNameOptional = this.getNamespaceFullName(transactions,
        namespaceRegistrationTransaction.parentId)
      if (!parentNamespaceNameOptional) {
        return undefined
      } else {
        return `${parentNamespaceNameOptional}.${namespaceRegistrationTransaction.namespaceName}`
      }
    }
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
