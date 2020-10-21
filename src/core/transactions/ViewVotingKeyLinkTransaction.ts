/*
 * Copyright 2020-present NEM (https://nem.io)
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
import { VotingKeyLinkTransaction, Address, LinkAction } from 'symbol-sdk';
import { TransactionView } from './TransactionView';
import i18n from '@/language';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';

export class ViewVotingKeyLinkTransaction extends TransactionView<VotingKeyLinkTransaction> {
    /**
     * Displayed items
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        return [
            {
                key: 'linked_account_address',
                value: Address.createFromPublicKey(this.transaction.linkedPublicKey, this.transaction.networkType).plain(),
            },
            { key: 'link_action', value: this.transaction.linkAction == LinkAction.Link ? i18n.t('link') : i18n.t('unlink') },
            { key: 'linked_public_key', value: this.transaction.linkedPublicKey },
            { key: 'start_finalization_epoch', value: this.transaction.startEpoch },
            { key: 'end_finalization_epoch', value: this.transaction.endEpoch },
        ];
    }
}
