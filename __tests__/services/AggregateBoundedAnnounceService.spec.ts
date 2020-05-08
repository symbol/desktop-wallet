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
import { AggregateBoundedAnnounceService } from '@/services/AggregateBoundedAnnounceService'
import { SignedTransaction, TransactionType, NetworkType, TransactionHttp, Listener } from 'symbol-sdk'
import { BroadcastResult } from '@/core/transactions/BroadcastResult'

const mockSignedLock = new SignedTransaction(
  'payload',
  '0'.repeat(64),
  'publicKey',
  TransactionType.HASH_LOCK,
  NetworkType.MAIN_NET,
)
const mockSignedPartial = new SignedTransaction(
  'payload',
  '1'.repeat(64),
  'publicKey',
  TransactionType.AGGREGATE_BONDED,
  NetworkType.MAIN_NET,
)

describe('services/AggregateBoundedAnnounceService ==>', () => {
  describe('start() should', () => {
    test('Resolve a broadcast result when the network call fails', async (done) => {
      // prepare
      const transactionHttp = new TransactionHttp('http://localhost:3000')
      const listener = new Listener('http://localhost:3000')

      const service = new AggregateBoundedAnnounceService(
        mockSignedLock,
        mockSignedPartial,
        transactionHttp,
        listener,
        1,
      )

      const result = await service.start()
      expect(result.success).toBeFalsy()
      expect(result).toBeInstanceOf(BroadcastResult)
      done()
    })
  })
})
