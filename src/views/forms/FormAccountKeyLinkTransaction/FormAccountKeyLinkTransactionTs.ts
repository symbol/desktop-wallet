/**
 * Copyright 2020 NEM (https://nem.io)
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
import { UInt64, LinkAction, AccountKeyLinkTransaction } from 'symbol-sdk';
import { Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { Formatters } from '@/core/utils/Formatters';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';

// child components
import { ValidationObserver } from 'vee-validate';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';

const defaultFormItems = {
    signerAddress: '',
    linkAction: LinkAction.Link,
    maxFee: 0,
};

@Component({
    components: {
        FormWrapper,
        FormRow,
        ValidationObserver,
        MaxFeeAndSubmit,
    },
    computed: mapGetters({
        currentAccountAccountInfo: 'account/currentAccountAccountInfo',
        currentPeer: 'network/currentPeer',
    }),
})
export class FormAccountKeyLinkTransactionTs extends FormTransactionBase {
    @Prop({ required: true }) remoteAccountPublicKey: string;

    /**
     * Formatters helpers
     */
    public formatters = Formatters;

    /**
     * Form items
     */
    public formItems = { ...defaultFormItems };

    /**
     * Reset the form with properties
     */
    protected resetForm() {
        this.formItems = {
            ...defaultFormItems,
            signerAddress: this.selectedSigner ? this.selectedSigner.address.plain() : this.currentAccount.address,
        };
    }

    /**
     * Getter for transactions that will be staged
     * @see {FormTransactionBase}
     * @return {AccountKeyLinkTransaction[]}
     */
    protected getTransactions(): AccountKeyLinkTransaction[] {
        const maxFee = UInt64.fromUint(this.formItems.maxFee);
        return [
            AccountKeyLinkTransaction.create(
                this.createDeadline(),
                this.remoteAccountPublicKey,
                this.formItems.linkAction,
                this.networkType,
                maxFee,
            ),
        ];
    }

    /**
     * Setter for Alias transactions that will be staged
     * @see {FormTransactionBase}
     * @param {AliasTransaction[]} transactions
     * @throws {Error} If not overloaded in derivate component
     */
    protected setTransactions(transactions: AccountKeyLinkTransaction[]) {
        // - this form creates only 1 transaction
        const transaction = transactions.shift();
        if (!transaction) {
            return;
        }

        // - populate for items if transaction is an address alias
        if (transaction instanceof AccountKeyLinkTransaction) {
            this.remoteAccountPublicKey = transaction.linkedPublicKey;
            this.formItems.linkAction = transaction.linkAction;
        }

        // - populate maxFee
        this.formItems.maxFee = transaction.maxFee.compact();
    }

    /**
     * Hook called when the component is mounted
     */
    public async created() {
        this.$emit('toggleNext', false);
    }
}
