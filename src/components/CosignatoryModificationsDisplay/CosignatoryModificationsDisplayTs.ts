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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { NetworkType } from 'symbol-sdk';
import { ValidationProvider } from 'vee-validate';

// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';

// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import CosignatoryModifications from '@/views/forms/FormMultisigAccountModificationTransaction/FormMultisigAccountModificationTransactionTs';

@Component({
    components: {
        ValidationProvider,
        ErrorTooltip,
        FormRow,
    },
    computed: {
        ...mapGetters({
            networkType: 'network/networkType',
        }),
    },
})
export class CosignatoryModificationsDisplayTs extends Vue {
    /**
     * Cosignatory modifications
     * @type {CosignatoryModifications}
     */
    @Prop({
        default: {},
    })
    cosignatoryModifications: CosignatoryModifications;

    private networkType: NetworkType;

    get modifications(): {
        address: string;
        addOrRemove: 'add' | 'remove';
    }[] {
        return Object.values(this.cosignatoryModifications).map(({ addOrRemove, cosignatory }) => ({
            address: cosignatory.pretty(),
            addOrRemove,
        }));
    }
}
