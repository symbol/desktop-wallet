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
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { mapGetters } from 'vuex';
import { networkConfig } from '@/config';
import { NetworkType } from 'symbol-sdk';

@Component({
    computed: {
        ...mapGetters({
            faucetBaseUrl: 'app/faucetUrl',
            networkType: 'network/networkType',
        }),
    },
})
export class AccountLinksTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;
    @Prop({ default: '' }) title: string;
    @Prop({ default: '' }) link: string;
    @Prop({ default: '' }) icon: string;

    public faucetBaseUrl: string;
    private networkType: NetworkType;
    /// region computed properties getter/setter
    /// end-region computed properties getter/setter

    public get explorerUrl() {
        return networkConfig[this.networkType].explorerUrl.replace(/\/+$/, '') + '/accounts/' + this.account.address;
    }

    public get faucetUrl() {
        return this.faucetBaseUrl + '?recipient=' + this.account.address;
    }
}
