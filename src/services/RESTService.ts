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
import { Address, Listener, TransactionStatusError } from 'symbol-sdk';
import { Subscription } from 'rxjs';
// internal dependencies
import { AddressValidator } from '@/core/validation/validators';
import { NotificationType } from '@/core/utils/NotificationType';
import { TransactionGroupState } from '@/store/Transaction';
import { CommonHelpers } from '@/core/utils/CommonHelpers';
import { MediaService } from '@/services/MediaService';

/**
 * This Service is more like a static helper now. All the methods are statics. Rename and move.
 */
export class RESTService {
    /**
     * Subscribe to transactions websocket channels
     * @param {Context} dispatch context the context
     * @param {listener} listener the listener.
     * @param {Address} address the listened account.
     */
    public static async subscribeTransactionChannels(
        context: { dispatch: any; commit: any },
        listener: Listener,
        addressStr: string,
        isMultisig: boolean,
    ): Promise<{ listener: Listener; subscriptions: Subscription[] }> {
        if (!AddressValidator.validate(addressStr)) {
            throw new Error('Invalid address for subscribing to websocket connections');
        }

        context.dispatch('diagnostic/ADD_DEBUG', `Opening REST websocket channel connections with ${addressStr}`, {
            root: true,
        });

        // open websocket connection
        const address = Address.createFromRawAddress(addressStr);
        if (listener) {
            if (!listener.isOpen()) {
                await listener.open(async (event: { client: string; code: any; reason: any }) => {
                    if (event && event.code !== 1005) {
                        await CommonHelpers.retryNTimes(listener, 3, 5000);
                    } else {
                        context.dispatch('notification/ADD_WARNING', NotificationType.WS_CONNECTION_FAILED, { root: true });
                    }
                });
            }

            // error listener
            const status = listener
                .status(address)
                .subscribe((error: TransactionStatusError) => context.dispatch('notification/ADD_ERROR', error.code, { root: true }));

            // unconfirmed listeners
            const unconfirmedAdded = listener.unconfirmedAdded(address, undefined, isMultisig).subscribe(
                (transaction) => {
                    context.dispatch(
                        'transaction/ADD_TRANSACTION',
                        { group: TransactionGroupState.unconfirmed, transaction },
                        { root: true },
                    );
                    context.dispatch('notification/ADD_SUCCESS', NotificationType.NEW_UNCONFIRMED_TRANSACTION, { root: true });
                    MediaService.playUnconfirmedTransactionSound();
                },
                (err) => context.dispatch('diagnostic/ADD_ERROR', err, { root: true }),
            );

            const unconfirmedRemoved = listener.unconfirmedRemoved(address, undefined, isMultisig).subscribe(
                (transactionHash) =>
                    context.dispatch(
                        'transaction/REMOVE_TRANSACTION',
                        { group: TransactionGroupState.unconfirmed, transactionHash },
                        { root: true },
                    ),
                (err) => context.dispatch('diagnostic/ADD_ERROR', err, { root: true }),
            );

            // partial listeners
            const cosignatureAdded = listener.cosignatureAdded(address, isMultisig).subscribe(
                (cosignature) => {
                    context.dispatch('transaction/ADD_COSIGNATURE', cosignature, {
                        root: true,
                    });
                    context.dispatch('notification/ADD_SUCCESS', NotificationType.COSIGNATURE_ADDED, { root: true });
                    MediaService.playUnconfirmedTransactionSound();
                },
                (err) => context.dispatch('diagnostic/ADD_ERROR', err, { root: true }),
            );

            const partialAdded = listener.aggregateBondedAdded(address, undefined, isMultisig).subscribe(
                (transaction) => {
                    context.dispatch('transaction/ADD_TRANSACTION', { group: TransactionGroupState.partial, transaction }, { root: true });
                    context.dispatch('notification/ADD_SUCCESS', NotificationType.NEW_AGGREGATE_BONDED, { root: true });
                    MediaService.playUnconfirmedTransactionSound();
                },
                (err) => context.dispatch('diagnostic/ADD_ERROR', err, { root: true }),
            );

            const partialRemoved = listener.aggregateBondedRemoved(address, undefined, isMultisig).subscribe(
                (transactionHash) =>
                    context.dispatch(
                        'transaction/REMOVE_TRANSACTION',
                        { group: TransactionGroupState.partial, transactionHash },
                        { root: true },
                    ),
                (err) => context.dispatch('diagnostic/ADD_ERROR', err, { root: true }),
            );

            // confirmed listener
            const confirmed = listener.confirmed(address, undefined, isMultisig).subscribe(
                (transaction) => {
                    context.dispatch(
                        'transaction/ADD_TRANSACTION',
                        { group: TransactionGroupState.confirmed, transaction },
                        { root: true },
                    );
                    context.dispatch('transaction/ON_NEW_TRANSACTION', transaction, {
                        root: true,
                    });
                    context.dispatch('notification/ADD_SUCCESS', NotificationType.NEW_CONFIRMED_TRANSACTION, { root: true });
                    MediaService.playConfirmedTransactionSound();
                },
                (err) => context.dispatch('diagnostic/ADD_ERROR', err, { root: true }),
            );

            return {
                listener,
                subscriptions: [status, unconfirmedAdded, unconfirmedRemoved, cosignatureAdded, partialAdded, partialRemoved, confirmed],
            };
        } else {
            return;
        }
    }
}
