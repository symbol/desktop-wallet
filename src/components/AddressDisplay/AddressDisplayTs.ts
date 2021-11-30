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
import { Address, NamespaceId } from 'symbol-sdk';

@Component
export class AddressDisplayTs extends Vue {
    @Prop({
        default: null,
    })
    address: Address | NamespaceId;
    @Prop({
        default: false,
    })
    showAddress: boolean;
    /**
     * Action descriptor
     * @var {string}
     */
    public descriptor: string = '';

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
        if (this.address instanceof Address) {
            const contact = await this.$store.dispatch('addressBook/RESOLVE_ADDRESS', this.address.plain());
            this.descriptor = contact ? contact.name : this.address.pretty();
        } else if (this.address instanceof NamespaceId) {
            this.descriptor = this.address.toHex();
            const namespaceName = await this.$store.dispatch('namespace/RESOLVE_NAME', this.address);
            const linkedAddress = await this.$store.dispatch('namespace/GET_LINKED_ADDRESS', this.address);
            this.descriptor = linkedAddress && this.showAddress ? `${namespaceName} (${linkedAddress.pretty()})` : namespaceName;
        }
    }
}
