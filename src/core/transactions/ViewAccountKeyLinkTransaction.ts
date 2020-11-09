/**
 *
 * Copyright 2020 Grégory Saive for NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// external dependencies
import { AccountKeyLinkTransaction, LinkAction } from 'symbol-sdk';

// internal dependencies
import { TransactionView } from './TransactionView';
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem';
import i18n from '@/language';

// eslint-disable-next-line max-len
export class ViewAccountKeyLinkTransaction extends TransactionView<AccountKeyLinkTransaction> {
    /**
     * Displayed items
     */
    protected resolveDetailItems(): TransactionDetailItem[] {
        return [
            { key: 'link_action', value: this.transaction.linkAction == LinkAction.Link ? i18n.t('link') : i18n.t('unlink') },
            { key: 'linked_account_public_key', value: this.transaction.linkedPublicKey },
        ];
    }
}
