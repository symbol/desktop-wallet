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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ValidationProvider } from 'vee-validate';

// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';

// child components
// @ts-ignore
import ModalFormAccountNameUpdate from '@/views/modals/ModalFormAccountNameUpdate/ModalFormAccountNameUpdate.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue';

@Component({
    components: {
        ModalFormAccountNameUpdate,
        ValidationProvider,
        ErrorTooltip,
        FormLabel,
    },
})
export class AccountNameDisplayTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;

    @Prop({
        default: false,
    })
    editable: boolean;

    /**
     * Whether name is currently being edited
     * @var {boolean}
     */
    public isEditingName: boolean = false;

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /// region computed properties getter/setter
    public get hasNameFormModal(): boolean {
        return this.editable && this.isEditingName;
    }

    public set hasNameFormModal(f: boolean) {
        this.isEditingName = f;
    }
    /// end-region computed properties getter/setter
}
