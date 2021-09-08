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
import { Signer } from '@/store/Account';

export class SignerItem {
    constructor(public parent: boolean, public signer: Signer, public level: number) {}
}

@Component({
    components: { FormRow },
})
export class SignerSelectorTs extends Vue {
    /**
     * Value set by the parent component's v-model
     * @type {string}
     */
    @Prop({
        default: '',
    })
    value: string;

    @Prop({
        default: () => null,
    })
    rootSigner: Signer;

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

    /// region computed properties getter/setter

    /**
     * Emit value change
     */
    set chosenSigner(newValue: string) {
        this.$emit('input', newValue);
    }

    /**
     * Value set by the parent component
     * @type {string}
     */
    get chosenSigner(): string {
        return this.value;
    }

    /**
     * @returns {SignerItem[]} multisig parent signers
     */
    get multisigSigners(): SignerItem[] {
        return this.getParentSignerItems(this.rootSigner, 0);
    }

    /**
     * Starts with the given signer, traverse multisig(parent) signers recursively and returns flat signer tree
     * @param {Signer} signer
     * @param {number} level
     * @returns {SignerItem[]} Signer tree as a list
     */
    public getParentSignerItems(signer: Signer, level: number): SignerItem[] {
        if (!signer?.parentSigners) {
            return [];
        }
        const signerItems: SignerItem[] = [];
        for (const parentSigner of signer.parentSigners) {
            signerItems.push(new SignerItem(parentSigner.parentSigners?.length > 0, parentSigner, level));
            signerItems.push(...this.getParentSignerItems(parentSigner, level + 1));
        }
        return signerItems;
    }
    /// end-region computed properties getter/setter
}
