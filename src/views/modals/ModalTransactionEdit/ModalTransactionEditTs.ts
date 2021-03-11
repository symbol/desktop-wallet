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
// internal dependencies
// child components
// @ts-ignore
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';
// @ts-ignore
import FormProfileUnlock from '@/views/forms/FormProfileUnlock/FormProfileUnlock.vue';
// @ts-ignore
import HardwareConfirmationButton from '@/components/HardwareConfirmationButton/HardwareConfirmationButton.vue';

@Component({
    components: {
        TransactionDetails,
        FormProfileUnlock,
        HardwareConfirmationButton,
    },
})
export class ModalTransactionEditTs extends Vue {
    @Prop({
        required: true,
    })
    public transaction: any;

    @Prop({
        default: false,
    })
    public visible: boolean;

    public get show(): boolean {
        return this.visible;
    }

    public set show(val) {
        if (!val) {
            this.$emit('cancel');
        }
    }
    /// end-region computed properties getter/setter

    public cancel() {
        this.$emit('cancel');
    }

    public save() {
        const transactionForm = this.$refs['transactionForm'] as any;
        transactionForm.emitToAggregate();
    }

    public onTransactionFormSave(formItems) {
        this.$emit('save', formItems);
    }
}
