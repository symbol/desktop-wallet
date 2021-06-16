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

import i18n from '@/language';
import { TransactionDetailItem } from './TransactionDetailItem';
import { ViewTransferTransaction } from './ViewTransferTransaction';

export class ViewHarvestingTransaction extends ViewTransferTransaction {
    /**
     * Displayed items
     * @type {({ key: string, value: string | boolean, | Mosaic }[])}
     * @see {TransactionView}
     */
    resolveHeaderItems(): TransactionDetailItem[] {
        const headerItems = super.resolveHeaderItems();
        headerItems.shift();
        headerItems.unshift({
            key: 'transaction_type',
            value: i18n.t('transaction_descriptor_harvesting'),
        });
        return headerItems;
    }
}
