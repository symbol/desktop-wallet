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
import { Store } from 'vuex'
import { TransactionRepository, IListener, SignedTransaction, Address } from 'symbol-sdk'
import { Subscription } from 'rxjs'

// internal dependencies
import { AbstractService } from './AbstractService'
import { BroadcastResult } from '@/core/transactions/BroadcastResult'

// configuration
import conf from '@/../config/app.conf.json'
const { HASH_LOCK_CONFIRMATION_TIMEOUT } = conf.constants

export class AggregateBoundedAnnounceService extends AbstractService {
  /**
   * Service name
   */
  public name: string = 'aggregateBoundedAnnounce'
  /**
   * Vuex Store
   */
  public $store: Store<any>
  /**
   * Listener subscription
   * @private
   * @type {Subscription}
   */
  private subscription: Subscription
  /**
   * Id of the timer handling the hash lock confirmation timeout
   */
  private timerId: number
  /**
   * Success state of the announce process
   */
  private success = false
  /**
   * Error message
   * @private
   */
  private error = ''

  /**
   * Creates an instance of AggregateBoundedAnnounceService.
   * @param {Store<any>} store
   * @param {SignedTransaction} signedLock
   * @param {SignedTransaction} signedPartial
   * @param {number} timeout
   */
  constructor(
    private readonly signedLock: SignedTransaction,
    private readonly signedPartial: SignedTransaction,
    private readonly transactionHttp: TransactionRepository,
    public readonly listener: IListener,
    private readonly timeout = HASH_LOCK_CONFIRMATION_TIMEOUT,
  ) {
    super()
  }

  /**
   * Starts the service
   * @param {Store<any>} store
   * @param {SignedTransaction} signedLock
   * @param {SignedTransaction} signedPartial
   * @param {number} [timeout=HASH_LOCK_CONFIRMATION_TIMEOUT] hash lock timeout in ms
   * @returns {Promise<BroadcastResult>}
   */
  public async start(): Promise<BroadcastResult> {
    try {
      // prepare scoped *confirmation listener*
      await this.listener.open()

      // announce hash lock transaction and await confirmation
      await this.transactionHttp.announce(this.signedLock).toPromise()

      // return a race between the broadcast function and the timer
      return Promise.race([this.broadcast(), this.startTimer()])
    } catch (error) {
      this.error = error
      return this.finalize()
    }
  }

  /**
   * Broadcasts the signed lock and the signed partial transactions
   * @returns {Promise<BroadcastResult>}
   */
  private broadcast(): Promise<BroadcastResult> {
    return new Promise((resolve) => {
      // - listen for hash lock confirmation
      this.subscription = this.listener
        .confirmed(Address.createFromRawAddress(this.signedLock.getSignerAddress().plain()))
        .subscribe(
          async (tx) => {
            try {
              if (tx.transactionInfo.hash !== this.signedLock.hash) return
              // - hash lock confirmed, now announce partial
              await this.transactionHttp.announceAggregateBonded(this.signedPartial).toPromise()
              this.success = true
              resolve(this.finalize())
            } catch (error) {
              this.error = error
              resolve(this.finalize())
            }
          },
          (error) => {
            this.error = error
            resolve(this.finalize())
          },
        )
    })
  }

  /**
   * Starts the timer responsible for killing the service
   * if the hashlock takes too long to confir,
   * @returns {Promise<BroadcastResult>}
   */
  private startTimer(): Promise<BroadcastResult> {
    return new Promise((resolve) => {
      // start a timer to kill the listener if the lock confirmation takes too long
      this.timerId = (setTimeout(() => {
        this.error = 'The hashlock transaction confirmation timed out'
        resolve(this.finalize())
      }, this.timeout) as unknown) as number
    })
  }

  /**
   * Finalizes the service process
   * @returns {BroadcastResult}
   */
  private finalize(): BroadcastResult {
    if (this.timerId) clearTimeout(this.timerId)
    if (this.subscription) this.subscription.unsubscribe()
    this.listener.close()
    return new BroadcastResult(this.signedPartial, this.success, this.error)
  }
}
