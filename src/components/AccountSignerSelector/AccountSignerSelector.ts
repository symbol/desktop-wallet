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
import { Component, Prop, Vue } from 'vue-property-decorator';
// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { mapGetters } from 'vuex';
import { AccountService } from '@/services/AccountService';

@Component({
    components: { FormRow },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            accountModels: 'account/knownAccounts',
        }),
    },
})
export class AccountSignerSelectorTs extends Vue {
    accountModels: AccountModel[];

    @Prop({
        default: 'sender',
    })
    label: string;

    @Prop({
        default: false,
    })
    noLabel: boolean;

    @Prop({
        default: false,
    })
    disabled: boolean;

    /**
     * Currently active account
     */
    public currentAccount: AccountModel;

    /// region computed properties getter/setter
    /**
     * Value set by the parent component
     * @type {string}
     */
    get chosenAccount(): string {
        return this.currentAccount.id;
    }
    set chosenAccount(id: string) {
        this.onChangeCurrentAccount(id);
    }

    /**
     * Hook called when a current account is selected.
     * @param id
     */
    public async onChangeCurrentAccount(id: string) {
        if (!id || !id.length) {
            return;
        }

        const account = new AccountService().getAccount(id);
        if (!account) {
            return;
        }

        if (!this.currentAccount || account.id !== this.currentAccount.id) {
            await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account);
        }
    }

    /// end-region computed properties getter/setter
}
