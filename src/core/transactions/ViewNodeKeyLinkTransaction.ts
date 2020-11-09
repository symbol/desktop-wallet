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
import { LinkAction, NodeKeyLinkTransaction } from 'symbol-sdk';
import { TransactionView } from './TransactionView';
import i18n from '@/language';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';

export class ViewNodeKeyLinkTransaction extends TransactionView<NodeKeyLinkTransaction> {
    /**
     * Displayed items
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        return [
            { key: 'link_action', value: this.transaction.linkAction == LinkAction.Link ? i18n.t('link') : i18n.t('unlink') },
            { key: 'linked_node_public_key', value: this.transaction.linkedPublicKey },
        ];
    }
}
