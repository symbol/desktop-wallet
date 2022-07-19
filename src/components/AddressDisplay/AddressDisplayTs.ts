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
import { Address, NamespaceId, NetworkType } from 'symbol-sdk';
import { networkConfig } from '@/config';

@Component({
    computed: {
        ...mapGetters({
            networkType: 'network/networkType',
        }),
    },
})
export class AddressDisplayTs extends Vue {
    @Prop({
        default: null,
    })
    address: Address | NamespaceId | string;

    @Prop({
        default: false,
    })
    showAddress: boolean;

    @Prop({
        default: false,
    })
    allowExplorerLink: boolean;

    isAddressBlocked: boolean = false;

    /**
     * Action descriptor
     * @var {string}
     */
    public descriptor: string = '';

    /**
     * Raw address
     * @var {string}
     */
    public rawAddress: string = '';

    /**
     * Network Type
     * @var {NetworkType}
     */
    public networkType: NetworkType;

    /**
     * Hook called when the component is mounted
     * @return {void}
     */
    public created() {
        // - load transaction details
        this.loadDetails();
    }

    /**
     * Load transaction details
     * @return {Promise<void>}
     */
    protected async loadDetails(): Promise<void> {
        this.descriptor = '';
        if (!this.address) {
            return;
        }
        // in case of normal transfer, display pretty address
        if (this.address instanceof Address || typeof this.address === 'string') {
            this.rawAddress = this.address instanceof Address ? this.address.plain() : this.address;
            const contact = await this.$store.dispatch('addressBook/RESOLVE_ADDRESS', this.rawAddress);
            this.descriptor = contact && contact.name ? contact.name : this.rawAddress;
            this.isAddressBlocked = contact ? contact.isBlackListed : false;
        } else {
            // instanceof this.address is NamespaceId
            const namespaceName = await this.$store.dispatch('namespace/RESOLVE_NAME', this.address);
            const linkedAddress = await this.$store.dispatch('namespace/GET_LINKED_ADDRESS', this.address);
            this.descriptor = linkedAddress && this.showAddress ? `${namespaceName} (${linkedAddress.plain()})` : namespaceName;
            this.rawAddress = linkedAddress && linkedAddress.plain();
        }
    }

    public get explorerUrl(): string {
        if (!this.rawAddress) {
            return '';
        }

        return networkConfig[this.networkType].explorerUrl.replace(/\/+$/, '') + '/accounts/' + this.rawAddress;
    }
}
