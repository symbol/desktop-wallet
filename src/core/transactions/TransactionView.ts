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
import { Store } from 'vuex';
import { AggregateTransactionInfo, Transaction, TransactionInfo } from 'symbol-sdk';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';
import i18n from '@/language';
import { TransactionStatus } from '@/core/transactions/TransactionStatus';
import { NetworkConfigurationModel } from '../database/entities/NetworkConfigurationModel';

export abstract class TransactionView<T extends Transaction> {
    /**
     * Vuex store instance
     * @var {Store<any>}
     */
    protected readonly $store: Store<any>;

    /**
     * The transaction header info
     * @var {TransactionInfo}
     */
    public readonly info: TransactionInfo | AggregateTransactionInfo | undefined;

    /**
     * The transaction body
     * @var {Transaction}
     */
    public readonly transaction: T;

    /**
     * The header items for the view.
     */
    public readonly headerItems: TransactionDetailItem[];

    /**
     * The the details items for the view.
     */
    public readonly detailItems: TransactionDetailItem[];

    /**
     * Catapult-server nemesis block generation epoch adjustment
     */
    public readonly epochAdjustment: number;

    /**
     * Construct a transaction view around \a store
     * @param {Store<any>} store
     */
    public constructor(store: Store<any>, transaction: T) {
        this.$store = store;
        this.epochAdjustment = (this.$store.getters['network/networkConfiguration'] as NetworkConfigurationModel).epochAdjustment;
        this.transaction = transaction;
        this.info = transaction.transactionInfo || undefined;
        this.headerItems = this.resolveHeaderItems();
        this.detailItems = this.resolveDetailItems();
    }

    /**
     * Is the transaction incoming?
     */
    public get isIncoming(): boolean {
        return false;
    }

    /**
     * Returns the status of the transaction
     * @param transaction the transaction.
     */
    public static getTransactionStatus(transaction: Transaction): TransactionStatus {
        if (transaction.isConfirmed()) {
            return TransactionStatus.confirmed;
        } else {
            return TransactionView.isPartial(transaction) ? TransactionStatus.partial : TransactionStatus.unconfirmed;
        }
    }

    /**
     * @description: transaction.transactionInfo.merkleComponentHash==='00000...' -> status of this transaction is Partial
     * @param {Transaction}
     * @return: boolean
     */

    public static isPartial(transaction: Transaction): boolean {
        return (
            transaction.transactionInfo &&
            transaction.transactionInfo.merkleComponentHash &&
            parseInt(transaction.transactionInfo.merkleComponentHash) === 0
        );
    }
    /**
     * It returns a list that that it easy to render when displaying TransactionDetailRow components.
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        return [];
    }
    /**
     * Displayed items
     * @see {Store.Mosaic}
     * @type {({ key: string, value: string | boolean, | Mosaic }[])}
     */
    protected resolveHeaderItems(): TransactionDetailItem[] {
        return [
            {
                key: 'transaction_type',
                value: `${i18n.t(`transaction_descriptor_${this.transaction.type}`)}`,
            },
            {
                key: 'status',
                value: i18n.t(`transaction_status_${TransactionView.getTransactionStatus(this.transaction)}`),
            },
            {
                key: 'hash',
                value: (this.info && this.info.hash) || undefined,
            },
            this.getFeeDetailItem(),
            {
                key: 'block_height',
                value: this.info && this.info.height && this.info.height.compact() ? this.info.height.compact().toString() : undefined,
            },
            {
                key: 'deadline',
                value: `${this.transaction.deadline
                    .toLocalDateTime(this.epochAdjustment)
                    .toLocalDate()} ${this.transaction.deadline.toLocalDateTime(this.epochAdjustment).toLocalTime()}`,
            },
            {
                key: 'signature',
                value: this.transaction.signature,
            },
            {
                key: 'signer_public_key',
                value: (this.transaction.signer && this.transaction.signer.publicKey) || undefined,
            },
        ].filter((pair) => pair.value);
    }

    protected getFeeDetailItem(): TransactionDetailItem {
        if (this.transaction.isConfirmed()) {
            return {
                key: 'paid_fee',
                value: this.transaction,
                isPaidFee: true,
            };
        } else {
            return {
                key: 'max_fee',
                value: {
                    amount: this.transaction.maxFee.compact() || 0,
                    color: 'red',
                },
                isMosaic: true,
            };
        }
    }
}
