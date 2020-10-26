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
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { AccountNames } from 'symbol-sdk';

@Component({
    computed: mapGetters({
        currentAccountAliases: 'account/currentAccountAliases',
    }),
})
export class AccountAliasDisplayTs extends Vue {
    @Prop({ default: null }) account: AccountModel;

    /**
     * NamespaceModel
     */
    protected currentAccountAliases: AccountNames[];

    get accountAliasNames(): string[] {
        const names = this.currentAccountAliases.find((alias) => alias.address.plain() === this.account.address)?.names;
        if (!this.currentAccountAliases || !this.account || !names) {
            return [];
        } else {
            return names.map((aliasName) => aliasName.name);
        }
    }
}
