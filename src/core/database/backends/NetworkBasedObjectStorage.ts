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
import {NetworkBasedModel} from '@/core/database/entities/NetworkBasedModel'

/**
 * A storage save the data per generation hash
 */
export class NetworkBasedObjectStorage<E> {

  private readonly storage: SimpleObjectStorage<Record<string, NetworkBasedModel<E>>>

  public constructor(storageKey: string) {
    this.storage = new SimpleObjectStorage<Record<string, NetworkBasedModel<E>>>(storageKey)
  }

  /**
   * it gets the stored value for the specific generation hash.
   *
   * @param generationHash the generation hash
   * @return the stored value for the provided network hash or undefined
   */
  public get(generationHash: string): E | undefined {
    const map = this.storage.get() || {}
    return map[generationHash] && map[generationHash].data || undefined
  }

  /**
   * It gets the latest stored entry according to the timestamp.
   * @return the entry if available.
   */
  public getLatest(): E | undefined {
    const map = this.storage.get() || {}
    const latest = Object.values(map).reduce(function (prev, current) {
      return (prev && prev.timestamp > current.timestamp) ? prev : current
    }, undefined)
    return latest && latest.data || undefined
  }

  /**
   * Stores the value for the provided generation hash.
   *
   * @param generationHash the generation hash
   * @param value to be stored
   */
  public set(generationHash: string, value: E): void {
    const map = this.storage.get() || {}
    map[generationHash] = new NetworkBasedModel(generationHash, value)
    this.storage.set(map)
  }

  /**
   * Deletes the stored value for the given generation hash
   * @param generationHash the generation hash.
   */
  public remove(generationHash: string): void {
    const map = this.storage.get() || {}
    delete map[generationHash]
    this.storage.set(map)
  }

}
