/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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
import * as BIPPath from 'bip32-path';
// configuration
import { Transaction, SignedTransaction, Convert, CosignatureSignedTransaction, AggregateTransaction } from 'symbol-sdk';

const SUPPORT_VERSION = { LEDGER_MAJOR_VERSION: '1', LEDGER_MINOR_VERSION: '0', LEDGER_PATCH_VERSION: '0' };
const CLA_FIELD = 0xe0;

/**
 * Symbol's API
 *
 * @example
 * import { SymbolLedger } from '@/core/utils/Ledger'
 * const sym = new SymbolLedger();
 "44'/4343'/account'/change/accountIndex"
 */

export class SymbolLedger {
    transport: any;

    constructor(transport: any, scrambleKey: string) {
        this.transport = transport;
        transport.decorateAppAPIMethods(
            this,
            ['isAppSupported', 'getAccount', 'signTransaction', 'signCosignatureTransaction'],
            scrambleKey,
        );
    }
    /**
     * Return true if app version is above the supported Symbol app version
     * @return {boolean}
     */
    public async isAppSupported() {
        const appVersion = await this.getAppVersion();
        if (appVersion.majorVersion > SUPPORT_VERSION.LEDGER_MAJOR_VERSION) {
            return true;
        } else if (appVersion.majorVersion == SUPPORT_VERSION.LEDGER_MAJOR_VERSION) {
            if (appVersion.minorVersion > SUPPORT_VERSION.LEDGER_MINOR_VERSION) {
                return true;
            } else if (appVersion.minorVersion == SUPPORT_VERSION.LEDGER_MINOR_VERSION) {
                if (appVersion.patchVersion < SUPPORT_VERSION.LEDGER_PATCH_VERSION) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Get Symbol app version on Ledger device

     * @return an object contain major, minor, patch version of the Symbol app on Ledger device
     */
    private async getAppVersion() {
        // APDU fields configuration
        const apdu = {
            cla: 0xe0,
            ins: 0x06,
            p1: 0x00,
            p2: 0x00,
            data: Buffer.alloc(1, 0x00, 'hex'),
        };
        // Response from Ledger
        const response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data);
        const result = {
            majorVersion: '',
            minorVersion: '',
            patchVersion: '',
        };
        result.majorVersion = response[1];
        result.minorVersion = response[2];
        result.patchVersion = response[3];
        return result;
    }

    /**
     * get Symbol's address for a given BIP 44 path from the Ledger
     *
     * @param path a path in BIP 44 format
     * @param display optionally enable or not the display
     * @param chainCode optionally enable or not the chainCode request
     * @param isOptinSymbolWallet if Opt-in Symbol wallet uses curve Secp256K1 else uses curve Ed25519
     * @return an object with a publicKey and (optionally) chainCode
     */
    async getAccount(path: string, networkType: number, display: boolean, chainCode: boolean, isOptinLedgerWallet: boolean) {
        const GET_ACCOUNT_INS_FIELD = 0x02;

        const bipPath = BIPPath.fromString(path).toPathArray();
        const curveMask = isOptinLedgerWallet ? 0x40 : 0x80;

        // APDU fields configuration
        const apdu = {
            cla: CLA_FIELD,
            ins: GET_ACCOUNT_INS_FIELD,
            p1: display ? 0x01 : 0x00,
            p2: curveMask | (chainCode ? 0x01 : 0x00),
            data: Buffer.alloc(1 + bipPath.length * 4 + 1),
        };

        apdu.data.writeInt8(bipPath.length, 0);
        bipPath.forEach((segment, index) => {
            apdu.data.writeUInt32BE(segment, 1 + index * 4);
        });
        apdu.data.writeUInt8(networkType, 1 + bipPath.length * 4);

        // Response from Ledger
        const response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data);
        const result = {
            publicKey: '',
        };

        const publicKeyLength = response[0];
        if (publicKeyLength !== 32) {
            throw { statusCode: 27264 };
        }
        result.publicKey = response.slice(1, 1 + publicKeyLength).toString('hex');
        return result;
    }

    /**
     * sign a Symbol transaction by account on Ledger at given BIP 44 path
     *
     * @param path a path in BIP 44 format
     * @param transaction a transaction needs to be signed
     * @param networkGenerationHash the network generation hash of block 1
     * @param signerPublicKey the public key of signer
     * @param isOptinSymbolWallet if Opt-in Symbol wallet uses curve Secp256K1 else uses curve Ed25519
     * @return a signed Transaction which is signed by account at path on Ledger
     */
    public async signTransaction(
        path: string,
        transaction: any,
        networkGenerationHash: string,
        signerPublicKey: string,
        isOptinLedgerWallet: boolean,
    ) {
        const rawPayload = transaction.serialize();
        const signingBytes = networkGenerationHash + rawPayload.slice(216);
        const rawTx = Buffer.from(signingBytes, 'hex');
        const response = await this.ledgerMessageHandler(path, rawTx, false, isOptinLedgerWallet);
        // Response from Ledger
        const h = response.toString('hex');
        const signature = h.slice(0, 128);
        const payload = rawPayload.slice(0, 16) + signature + signerPublicKey + rawPayload.slice(16 + 128 + 64, rawPayload.length);
        const generationHashBytes = Array.from(Convert.hexToUint8(networkGenerationHash));
        const transactionHash = Transaction.createTransactionHash(payload, generationHashBytes);
        const signedTransaction = new SignedTransaction(
            payload,
            transactionHash,
            signerPublicKey,
            transaction.type,
            transaction.networkType,
        );
        return signedTransaction;
    }

    /**
     * sign a Symbol Cosignature transaction with a given BIP 44 path
     *
     * @param path a path in BIP 44 format
     * @param cosignatureTransaction a cosinature transaction needs to be signed
     * @param signerPublicKey the public key of signer
     * @param isOptinSymbolWallet if Opt-in Symbol wallet uses curve Secp256K1 else uses curve Ed25519
     * @return a Signed Cosignature Transaction which is signed by account at path on Ledger
     */
    public async signCosignatureTransaction(
        path: string,
        cosignatureTransaction: AggregateTransaction,
        signerPublicKey: string,
        isOptinSymbolWallet: boolean,
    ) {
        const rawPayload = cosignatureTransaction.serialize();
        const signingBytes = cosignatureTransaction.transactionInfo.hash + rawPayload.slice(216);
        const rawTx = Buffer.from(signingBytes, 'hex');
        const response = await this.ledgerMessageHandler(path, rawTx, false, isOptinSymbolWallet);
        // Response from Ledger
        const h = response.toString('hex');
        const signature = h.slice(0, 128);
        const cosignatureSignedTransaction = new CosignatureSignedTransaction(
            cosignatureTransaction.transactionInfo.hash,
            signature,
            signerPublicKey,
        );
        return cosignatureSignedTransaction;
    }

    /**
     * handle sending and receiving packages between Ledger and Wallet
     * @param path a path in BIP 44 format
     * @param rawTx a raw payload transaction hex string
     * @param chainCode optionally enable or not the chainCode request
     * @param isOptinSymbolWallet if Opt-in Symbol wallet uses curve Secp256K1 else uses curve Ed25519
     * @returns respond package from Ledger
     */
    private async ledgerMessageHandler(path: string, rawTx: Buffer, chainCode: boolean, isOptinSymbolWallet: boolean) {
        const TX_INS_FIELD = 0x04;
        const MAX_CHUNK_SIZE = 255;
        const CONTINUE_SENDING = '0x9000';

        const curveMask = isOptinSymbolWallet ? 0x40 : 0x80;
        const bipPath = BIPPath.fromString(path).toPathArray();
        const apduArray = [];
        let offset = 0;

        while (offset !== rawTx.length) {
            const maxChunkSize = offset === 0 ? MAX_CHUNK_SIZE - 1 - bipPath.length * 4 : MAX_CHUNK_SIZE;
            const chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
            // APDU fields configuration
            const apdu = {
                cla: CLA_FIELD,
                ins: TX_INS_FIELD,
                p1: offset === 0 ? (chunkSize < maxChunkSize ? 0x00 : 0x80) : chunkSize < maxChunkSize ? 0x01 : 0x81,
                p2: curveMask | (chainCode ? 0x01 : 0x00),
                data: offset === 0 ? Buffer.alloc(1 + bipPath.length * 4 + chunkSize) : Buffer.alloc(chunkSize),
            };

            if (offset === 0) {
                apdu.data.writeInt8(bipPath.length, 0);
                bipPath.forEach((segment, index) => {
                    apdu.data.writeUInt32BE(segment, 1 + index * 4);
                });
                rawTx.copy(apdu.data, 1 + bipPath.length * 4, offset, offset + chunkSize);
            } else {
                rawTx.copy(apdu.data, 0, offset, offset + chunkSize);
            }
            apduArray.push(apdu);
            offset += chunkSize;
        }
        let response = Buffer.alloc(0);
        for (const apdu of apduArray) {
            response = await this.transport.send(apdu.cla, apdu.ins, apdu.p1, apdu.p2, apdu.data);
        }

        if (response.toString() != CONTINUE_SENDING) {
            return response;
        }
    }
}
