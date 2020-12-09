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

@Component
export default class ModalConfirmTs extends Vue {
    @Prop({
        default: false,
    })
    value: boolean;

    @Prop({ default: 'confirmation_title' }) readonly title!: string;

    @Prop({ default: 'confirmation_message' }) readonly message!: string;

    /**
     * Visibility state
     * @type {boolean}
     */
    get show(): boolean {
        return this.value;
    }

    /**
     * Emits close event
     */
    set show(val) {
        if (!val) {
            this.$emit('close');
        }
        this.$emit('input', val);
    }

    public confirm() {
        this.$emit('confirmed');
    }

    public cancel() {
        this.$emit('cancelled');
    }

    /**
     * Hook called when child component FormSubAccountCreation emits
     * the 'submit' event.
     */
    public onSubmit() {
        this.show = false;
    }
}
