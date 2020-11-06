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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue';
// @ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';

@Component({
    components: {
        ErrorTooltip,
        FormLabel,
        ButtonCopyToClipboard,
        ValidationObserver,
        ValidationProvider,
    },
})
export class FormInputEditableTs extends Vue {
    @Prop()
    model: any;

    @Prop()
    label: string;

    @Prop()
    value: string;

    @Prop({ default: 'required' })
    rules: string;

    newValue: string;

    @Prop()
    onEdit: (v: string) => {};

    editing: boolean = false;

    /**
     * Type the ValidationObserver refs
     * @type {{
     *     observer: InstanceType<typeof ValidationObserver>
     *   }}
     */
    public $refs!: {
        observer: InstanceType<typeof ValidationObserver>;
    };

    public startEditing() {
        this.newValue = '' + (this.value ? this.value : '');
        this.editing = true;
    }

    public finishEdition() {
        this.editing = false;
        this.value = '' + this.newValue;
        this.onEdit(this.value);
    }
    @Watch('model', { immediate: true })
    public cancelEdition() {
        this.editing = false;
    }

    /// end-region computed properties getter/setter
}
