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
import { Component, Prop, Vue } from 'vue-property-decorator';
// @ts-ignore
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue';
import { TransactionView } from '@/core/transactions/TransactionView';
import { Transaction } from 'symbol-sdk';

@Component({
    components: {
        TransactionDetailRow,
    },
})
export class TransactionDetailsHeaderTs extends Vue {
    @Prop({
        default: null,
    })
    view: TransactionView<Transaction>;
}
