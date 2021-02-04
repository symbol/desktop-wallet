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
import { MultisigAccountInfo, Address } from 'symbol-sdk';

// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import AddCosignatoryInput from '@/components/AddCosignatoryInput/AddCosignatoryInput.vue';

// custom types
type AddOrRemove = 'add' | 'remove';

interface Modification {
    cosignatory: Address;
    addOrRemove: AddOrRemove;
}

type Cosignatories = { address: Address }[];

@Component({
    components: {
        FormRow,
        AddCosignatoryInput,
    },
})
export class MultisigCosignatoriesDisplayTs extends Vue {
    @Prop({ default: null }) multisig: MultisigAccountInfo;
    @Prop({ default: false }) modifiable: boolean;
    @Prop({ default: {} }) cosignatoryModifications: Record<string, Modification>;
    @Prop({
        default: '',
    })
    currentAddress: string;
    /**
     * Whether the add cosignatory form input is visible
     */
    protected isAddingCosignatory = false;

    /**
     * Cosignatories to add
     * @type {Cosignatories}
     */
    protected get addModifications(): Cosignatories {
        return this.getFilteredModifications('add');
    }

    /**
     * Cosignatories to remove
     * @type {Cosignatories}
     */
    protected get removeModifications(): Cosignatories {
        return this.getFilteredModifications('remove');
    }

    /**
     * Internal helper to get filtered cosignatory modifications
     * @param {AddOrRemove} addOrRemoveFilter
     * @returns {Cosignatories}
     */
    private getFilteredModifications(addOrRemoveFilter: AddOrRemove): Cosignatories {
        return Object.values(this.cosignatoryModifications)
            .filter(({ addOrRemove }) => addOrRemove === addOrRemoveFilter)
            .map(({ cosignatory }) => ({
                address: cosignatory,
            }));
    }

    /**
     * The multisig account cosignatories after modifications
     * @type {{ publicKey: string; address: string }[]}
     */
    protected get cosignatories(): { address: Address }[] {
        if (!this.multisig) {
            return [];
        }

        return this.multisig.cosignatoryAddresses
            .filter((address) => !this.cosignatoryModifications[address.plain()])
            .map((address) => ({ address }));
    }

    /**
     * Hook called when a cosignatory is added
     * @param {PublicAccount} publicAccount
     */
    protected onAddCosignatory(cosigAddress: Address): Promise<void> {
        if (!Address.isValidRawAddress(cosigAddress.plain())) {
            this.$store.dispatch('notification/ADD_ERROR', 'warning_unknown_account');
            return;
        }
        const isCosignatory = this.cosignatories.find(({ address }) => cosigAddress.plain() === address.plain());

        if (isCosignatory || this.cosignatoryModifications[cosigAddress.plain()]) {
            this.$store.dispatch('notification/ADD_WARNING', 'warning_already_a_cosignatory');
            return;
        }

        if (cosigAddress.plain() === this.currentAddress) {
            this.$store.dispatch('notification/ADD_WARNING', 'current_cosigner_matches_current_account');
            return;
        }

        this.$emit('add', cosigAddress);
    }

    /**
     * Hook called when a cosignatory is removed
     * @param {string} publicKey
     */
    protected onRemoveCosignatory(address: Address): void {
        this.$emit('remove', address);
    }

    /**
     * Hook called when a cosignatory modification is undone
     * @param {string} thePublicKey
     */
    protected onUndoModification(theAddress: Address): void {
        this.$emit('undo', theAddress);
    }
}
