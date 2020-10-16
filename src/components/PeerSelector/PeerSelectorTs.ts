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
import { NetworkType, RepositoryFactory } from 'symbol-sdk';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { NetworkTypeHelper } from '@/core/utils/NetworkTypeHelper';
import * as _ from 'lodash';
//@ts-ignore
import ModalNetworkNotMatchingProfile from '@/views/modals/ModalNetworkNotMatchingProfile/ModalNetworkNotMatchingProfile.vue';

@Component({
    components: { ModalNetworkNotMatchingProfile },
    computed: {
        ...mapGetters({
            currentPeerInfo: 'network/currentPeerInfo',
            isConnected: 'network/isConnected',
            networkType: 'network/networkType',
            repositoryFactory: 'network/repositoryFactory',
            generationHash: 'network/generationHash',
            knowNodes: 'network/knowNodes',
            networkIsNotMatchingProfile: 'network/networkIsNotMatchingProfile',
        }),
    },
})
export class PeerSelectorTs extends Vue {
    @Prop({ default: false }) isEmbedded: boolean;
    /**
     * Currently active endpoint
     * @see {Store.Network}
     * @var {Object}
     */
    public currentPeerInfo: NodeModel;
    public networkIsNotMatchingProfile: boolean;
    /**
     * Whether the connection is up
     * @see {Store.Network}
     * @var {boolean}
     */
    public isConnected: boolean;

    /**
     * Current networkType
     * @see {Store.Network}
     * @var {NetworkType}
     */
    public networkType: NetworkType;

    /**
     * Current generationHash
     * @see {Store.Network}
     * @var {string}
     */
    public generationHash: string;

    /**
     * Known peers
     * @see {Store.Network}
     * @var {string[]}
     */
    public knowNodes: NodeModel[];

    public repositoryFactory: RepositoryFactory;

    public poptipVisible: boolean = false;

    /// region computed properties getter/setter
    get peersList(): NodeModel[] {
        return _.sortBy(
            this.knowNodes,
            (a) => a.isDefault !== true,
            (a) => a.url,
        );
    }

    get networkTypeText(): string {
        if (!this.isConnected) {
            return this.$t('invalid_node').toString();
        }
        return !!this.networkType ? NetworkTypeHelper.getNetworkTypeLabel(this.networkType) : this.$t('loading').toString();
    }

    /// end-region computed properties getter/setter

    /**
     * Switch the currently active peer
     * @param peer
     */
    public switchPeer(url: string) {
        this.$store.dispatch('network/SET_CURRENT_PEER', url);
    }
    onPopTipShow() {
        this.$forceUpdate();
    }
    goSettings() {
        this.poptipVisible = false;
        this.$store.commit('profile/toggleSettings');
    }
    onCloseNetworkModal() {
        this.$store.dispatch('network/SET_NETWORK_IS_NOT_MATCHING_PROFILE', false);
    }
}
