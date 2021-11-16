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
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Address, NetworkType, PublicAccount, RepositoryFactory } from 'symbol-sdk';
// internal dependencies
import { AddressValidator, PublicKeyValidator } from '@/core/validation/validators';
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue';
import { FilterHelpers } from '@/core/utils/FilterHelpers';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        FormRow,
        ButtonAdd,
    },
    computed: {
        ...mapGetters({
            repositoryFactory: 'network/repositoryFactory',
            networkType: 'network/networkType',
        }),
    },
})
export class AddCosignatoryInputTs extends Vue {
    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /**
     * Current peer
     * @private
     * @type {string}
     */
    private repositoryFactory: RepositoryFactory;

    /**
     * Current network type
     * @private
     * @type {NetworkType}
     */
    private networkType: NetworkType;

    /**
     * Cosignatory input (address or public key)
     * @protected
     * @type {string}
     */
    public cosignatory: string = '';

    /**
     * Handles the form submission
     * @protected
     * @return {void}
     */
    protected onAddCosignatory(): void {
        if (AddressValidator.validate(this.cosignatory)) {
            this.addCosignerFromAddress();
            this.cosignatory = '';
            return;
        } else if (PublicKeyValidator.validate(this.cosignatory, this.networkType)) {
            this.addCosignerFromPublicKey();
            this.cosignatory = '';
            return;
        } else {
            this.$store.dispatch('notification/ADD_ERROR', 'address_not_valid');
            return;
        }
    }

    /**
     * Emits onAddCosignatory event when cosignatory is input as a public key
     * @private
     * @return {void}
     */
    private addCosignerFromPublicKey(): void {
        if (!this.cosignatory) {
            return;
        }
        const publicAccount = PublicAccount.createFromPublicKey(this.cosignatory, this.networkType);
        this.$emit('added', publicAccount.address);
    }

    /**
     * Emits onAddCosignatory event when cosignatory is input as an address
     * @private
     * @return {void}
     */
    private async addCosignerFromAddress() {
        this.$emit('added', Address.createFromRawAddress(this.cosignatory));
    }
    /**
     * filter tags
     */
    public stripTagsCosignatory() {
        this.cosignatory = FilterHelpers.stripFilter(this.cosignatory);
    }
}
