/*
 * (C) Symbol Contributors 2021
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
import { Address, PersistentHarvestingDelegationMessage, Transaction, TransactionType, TransferTransaction } from 'symbol-sdk';
// @ts-ignore
import AddressDisplay from '@/components/AddressDisplay/AddressDisplay.vue';
import { mapGetters } from 'vuex';
import i18n from '@/language';

@Component({
    components: {
        AddressDisplay,
    },
    computed: {
        ...mapGetters({
            address: 'account/currentAccountAddress',
        }),
    },
})
export class ActionDisplayTs extends Vue {
    /**
     * Transaction
     * @type {Transaction}
     */
    @Prop({ default: null }) transaction: Transaction;

    /**
     * Whether the transaction is the Opt-in Payment
     * @type {boolean}
     */
    @Prop({ default: false }) isOptinPayoutTransaction: boolean;

    /**
     * Transaction type from SDK
     * @type {TransactionType}
     */
    public transactionType = TransactionType;
    /**
     * @protected
     * @type {boolean}
     */
    protected address: Address;

    /**
     * Returns transaction type label
     */
    public get transactionDescription() {
        if (this.transaction instanceof TransferTransaction && this.transaction.message instanceof PersistentHarvestingDelegationMessage) {
            return i18n.t('transaction_descriptor_harvesting');
        }

        return i18n.t(`transaction_descriptor_${this.transaction.type}${this.isOptinPayoutTransaction ? '_optin' : ''}`);
    }
}
