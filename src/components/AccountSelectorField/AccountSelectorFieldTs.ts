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
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { AccountService } from '@/services/AccountService';
import { CommonHelpers } from '@/core/utils/CommonHelpers';

@Component({
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            knownAccounts: 'account/knownAccounts',
        }),
    },
})
export class AccountSelectorFieldTs extends Vue {
    @Prop({
        default: null,
    })
    value: string;

    @Prop({
        default: false,
    })
    defaultFormStyle: boolean;

    @Prop({
        default: false,
    })
    enableMinWidth: boolean;

    @Prop({
        default: true,
    })
    showIcon: boolean;

    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    public currentAccount: AccountModel;

    /**
     * Known accounts
     */
    public knownAccounts: AccountModel[];

    /**
     * Accounts repository
     * @var {AccountService}
     */
    public readonly accountService: AccountService = new AccountService();
    public readonly commonHelpers = CommonHelpers;
    /// region computed properties getter/setter
    public get currentAccountIdentifier(): string {
        if (this.value) {
            return this.value;
        }

        if (this.currentAccount) {
            return this.currentAccount.id;
        }

        // fallback value
        return '';
    }

    public set currentAccountIdentifier(id: string) {
        if (!id || !id.length) {
            return;
        }

        this.$emit('input', id);
    }

    public get currentAccounts(): AccountModel[] {
        return this.knownAccounts;
    }

    /// end-region computed properties getter/setter
}
