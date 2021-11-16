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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
// child components
// @ts-ignore
import FormTransferTransaction from '@/views/forms/FormTransferTransaction/FormTransferTransaction.vue';
import { Address } from 'symbol-sdk';
import { AddressValidator } from '@/core/validation/validators';

@Component({
    components: {
        FormTransferTransaction,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
        }),
    },
})
export class DashboardTransferPageTs extends Vue {
    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    public currentAccount: AccountModel;

    @Prop({ default: '' }) public recipientAddress: string;

    public get recipient(): Address {
        if (AddressValidator.validate(this.recipientAddress)) {
            return Address.createFromRawAddress(this.recipientAddress);
        }
    }
}
