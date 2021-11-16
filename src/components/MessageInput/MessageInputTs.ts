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
import { Component, Prop, Vue } from 'vue-property-decorator';
// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// child components
// @ts-ignore
import { ValidationProvider } from 'vee-validate';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';

@Component({
    components: {
        ValidationProvider,
        ErrorTooltip,
        FormRow,
    },
})
export class MessageInputTs extends Vue {
    @Prop({
        default: '',
    })
    value: string;

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /// region computed properties getter/setter
    get plain(): string {
        return this.value;
    }

    set plain(msg: string) {
        this.$emit('input', msg);
    }
    /// end-region computed properties getter/setter
}
