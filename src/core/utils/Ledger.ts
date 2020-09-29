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
// internal dependencies
import app from '@/main'
import * as BIPPath from 'bip32-path'
// configuration
import { Transaction, SignedTransaction, Convert, CosignatureSignedTransaction, AggregateTransaction } from 'symbol-sdk'

const MAX_CHUNK_SIZE = 255

/**
 * SYMBOL API
 *
 * @example
 * import { SymbolLedger } from '@/core/utils/Ledger'
 * const sym = new SymbolLedger(transport);
      "44'/4343'/account'/change/accountIndex"
 */

export class SymbolLedger {
  transport: any

  constructor(transport: any, scrambleKey: string) {
    this.transport = transport
    transport.decorateAppAPIMethods(this, ['getAddress', 'signTransaction', 'getAppConfiguration'], scrambleKey)
  }

  /**
   * get Symbol's address for a given BIP 44 path from the Ledger
   *
   * @param path a path in BIP 44 format
   * @param display optionally enable or not the display
   * @param chainCode optionally enable or not the chainCode request
   * @param ed25519
   * @return an object with a publicKey, address and (optionally) chainCode
   * @example
   * const result = await Ledger.getAccount(bip44path);
   * const { publicKey, bip44path } = result;
   */
  async getAccount(path: string, display: boolean) {
    const chainCode = false
    const ed25519 = true

    const bipPath = BIPPath.fromString(path).toPathArray()
    const curveMask = ed25519 ? 0x80 : 0x40

    // APDU
    const cla = 0xe0
    const ins = 0x02
    const p1 = display ? 0x01 : 0x00
    const p2 = curveMask | (chainCode ? 0x01 : 0x00)
    const data = Buffer.alloc(1 + bipPath.length * 4)

    data.writeInt8(bipPath.length, 0)
    bipPath.forEach((segment, index) => {
      data.writeUInt32BE(segment, 1 + index * 4)
    })

    // Response from Ledger
    const response = await this.transport.send(cla, ins, p1, p2, data)
    const result = {
      publicKey: '',
      path: '',
    }

    const publicKeyLength = response[0]
    result.publicKey = response.slice(1, 1 + publicKeyLength).toString('hex')
    result.path = path
    return result
  }

  /**
   * sign a Symbol transaction by account on Ledger at given BIP 44 path
   *
   * @param path a path in BIP 44 format
   * @param transferTransaction a transfer transaction needs to be signed
   * @param networkGenerationHash the network generation hash of block 1
   * @param signer the public key of signer
   * @return a signed Transaction which is signed by account at path on Ledger
   */
  async signTransaction(path: string, transferTransaction: any, networkGenerationHash: string, signer: string) {
    const rawPayload = transferTransaction.serialize()
    const signingBytes = networkGenerationHash + rawPayload.slice(216)
    const rawTx = Buffer.from(signingBytes, 'hex')

    let response
    await this.generateDataUnit(path, rawTx)
      .then((res) => {
        response = res
      })
      .catch((err) => {
        console.log(err)
        app.$Notice.error({
          title: 'Transaction canceled.' + '',
        })
      })

    // Response from Ledger
    const h = response.toString('hex')
    const signature = h.slice(0, 128)
    const payload = rawPayload.slice(0, 16) + signature + signer + rawPayload.slice(16 + 128 + 64, rawPayload.length)
    const generationHashBytes = Array.from(Convert.hexToUint8(networkGenerationHash))
    const transactionHash = Transaction.createTransactionHash(payload, generationHashBytes)
    const signedTransaction = new SignedTransaction(
      payload,
      transactionHash,
      signer,
      transferTransaction.type,
      transferTransaction.networkType,
    )
    return signedTransaction
  }

  /**
   * sign a Symbol Cosignature transaction with a given BIP 44 path
   *
   * @param path a path in BIP 44 format
   * @param transferTransaction a transfer transaction needs to be signed
   * @param networkGenerationHash the network generation hash of block 1
   * @return a Signed Cosignature Transaction
   */
  async signCosignatureTransaction(path: string, cosignatureTransaction: AggregateTransaction, signer: string) {
    const rawPayload = cosignatureTransaction.serialize()
    const signingBytes = cosignatureTransaction.transactionInfo.hash + rawPayload.slice(216)
    const rawTx = Buffer.from(signingBytes, 'hex')

    let response
    await this.generateDataUnit(path, rawTx)
      .then((res) => {
        response = res
      })
      .catch((err) => console.log(err))

    // Response from Ledger
    const h = response.toString('hex')
    const signature = h.slice(0, 128)
    const cosignatureSignedTransaction = new CosignatureSignedTransaction(
      cosignatureTransaction.transactionInfo.hash,
      signature,
      signer,
    )
    return cosignatureSignedTransaction
  }
  /**
   * handle sending and receiving packages between Ledger and Wallet
   * @param path a path in BIP 44 format
   * @param rawTx a raw payload transaction hex string
   * @returns respond package from Ledger
   */
  async generateDataUnit(path: string, rawTx: Buffer) {
    let offset = 0
    const curveMask = 0x81
    const bipPath = BIPPath.fromString(path).toPathArray()
    const apdus = []

    while (offset !== rawTx.length) {
      const maxChunkSize = offset === 0 ? MAX_CHUNK_SIZE - 1 - bipPath.length * 4 : MAX_CHUNK_SIZE
      const chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize
      const apdu = {
        cla: 0xe0,
        ins: 0x04,
        p1: offset === 0 ? (chunkSize < maxChunkSize ? 0x00 : 0x80) : chunkSize < maxChunkSize ? 0x01 : 0x81,
        p2: curveMask,
        data: offset === 0 ? Buffer.alloc(1 + bipPath.length * 4 + chunkSize) : Buffer.alloc(chunkSize),
      }

      if (offset === 0) {
        apdu.data.writeInt8(bipPath.length, 0)
        bipPath.forEach((segment, index) => {
          apdu.data.writeUInt32BE(segment, 1 + index * 4)
        })
        rawTx.copy(apdu.data, 1 + bipPath.length * 4, offset, offset + chunkSize)
      } else {
        rawTx.copy(apdu.data, 0, offset, offset + chunkSize)
      }

      apdus.push(apdu)
      offset += chunkSize
    }
    let response = Buffer.alloc(0)
    for (const apdu of apdus) {
      response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data)
    }

    if (response.toString() != '0x9000') {
      return response
    }
  }
}
