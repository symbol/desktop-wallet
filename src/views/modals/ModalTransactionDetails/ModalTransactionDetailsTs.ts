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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { NetworkType, Transaction, TransactionType } from 'symbol-sdk';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { AccountModel } from '@/core/database/entities/AccountModel';
// child components
// @ts-ignore
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';
// @ts-ignore
import TransactionOptinPayoutDetails from '@/components/TransactionDetails/TransactionOptinPayoutDetails.vue';

@Component({
    components: {
        TransactionDetails,
        TransactionOptinPayoutDetails,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            currentProfile: 'profile/currentProfile',
            networkType: 'network/networkType',
        }),
    },
})
export class ModalTransactionDetailsTs extends Vue {
    @Prop({
        default: false,
    })
    visible: boolean;

    @Prop({
        default: null,
    })
    transaction: Transaction;

    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    protected currentAccount: AccountModel;

    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    /**
     * Network type
     * @see {Store.Network}
     * @var {NetworkType}
     */
    public networkType: NetworkType;

    /// region computed properties

    /**
     * Visibility state
     * @type {boolean}
     */
    public get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     */
    public set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    /**
     * Returns whether aggregate bonded transaction is announced by NGL Finance bot
     */
    public get isOptinTransaction(): boolean {
        // Check wether the 'transaction' prop is provided.
        if (!this.transaction) {
            return false;
        }

        // Check wether the 'transaction' is type of Aggregate Bonded.
        if (this.transaction.type !== TransactionType.AGGREGATE_BONDED) {
            return false;
        }

        // Check wether the signer of the Aggregate Bonded is the NGL Finance bot.
        const networktype = this.currentProfile.networkType === NetworkType.MAIN_NET ? 'mainnet' : 'testnet';
        const keysFinance = process.env.KEYS_FINANCE[networktype];
        const announcerPublicKey = this.transaction.signer.publicKey;
        const isAnnouncerNGLFinance = keysFinance.find(
            (financePublicKey) => financePublicKey.toUpperCase() === announcerPublicKey.toUpperCase(),
        );

        return !!isAnnouncerNGLFinance;
    }
    /// end-region computed properties
}
