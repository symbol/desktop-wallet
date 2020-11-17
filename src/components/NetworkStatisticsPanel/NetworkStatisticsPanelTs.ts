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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// configuration
// child components
// @ts-ignore
// @ts-ignore
import { officialIcons } from '@/views/resources/Images';

import { AccountModel, AccountType as ProfileType } from '@/core/database/entities/AccountModel';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';

@Component({
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            networkConfiguration: 'network/networkConfiguration',
            countTransactions: 'statistics/countTransactions',
            countAccounts: 'statistics/countAccounts',
            countNodes: 'statistics/countNodes',
            currentHeight: 'network/currentHeight',
            currentPeerInfo: 'network/currentPeerInfo',
        }),
    },
})
export class NetworkStatisticsPanelTs extends Vue {
    /**
     * The icons resources.
     */
    public officialIcons = officialIcons;

    /**
     * The current account.
     */
    private currentAccount: AccountModel;

    /**
     * The network configuration.
     */
    private networkConfiguration: NetworkConfigurationModel;

    /**
     * Number of transactions on the network
     */
    public countTransactions: number;

    /**
     * Number of accounts on the network
     */
    public countAccounts: number;

    /**
     * Number of nodes on the network
     */
    public countNodes: number;

    /**
     * Current network block height
     */
    public currentHeight: number;

    /**
     * Currently connect peer information
     */
    public currentPeerInfo: NodeModel;

    /**
     * Whether harvesting wizard is currently displayed
     */
    protected isHarvestingWizardDisplayed = false;

    /**
     * The supported profile types for harvesting
     */
    protected harvestingSupportedProfileTypes: ProfileType[] = [ProfileType.SEED];

    /**
     * Whether harvesting is enabled for current account
     */
    protected isHarvestingEnabled = false;

    /**
     * Current network target block time
     */
    protected get blockGenerationTargetTime(): number {
        return this.networkConfiguration.blockGenerationTargetTime;
    }

    public created() {
        if (this.currentAccount) {
            this.isHarvestingEnabled = this.harvestingSupportedProfileTypes.includes(this.currentAccount.type);
        }
    }
}
