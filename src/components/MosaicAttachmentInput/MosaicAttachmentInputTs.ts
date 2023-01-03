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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ValidationObserver } from 'vee-validate';
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue';
import AmountInput from '@/components/AmountInput/AmountInput.vue';
import ButtonRemove from '@/components/ButtonRemove/ButtonRemove.vue';
import FormRow from '@/components/FormRow/FormRow.vue';
import { Formatters } from '@/core/utils/Formatters';

@Component({
    components: {
        ValidationObserver,
        MosaicSelector,
        AmountInput,
        ButtonRemove,
        FormRow,
    },
})
export class MosaicAttachmentInputTs extends Vue {
    /**
     * Initial value set by the parent
     * @type {{mosaicHex: string, amount: string}}
     */
    @Prop({
        default: { mosaicHex: '', amount: '0' },
        required: true,
    })
    mosaicAttachment: { mosaicHex: string; amount: string };

    /**
     * Unique Id assigned to this component
     * @type {number}
     */
    @Prop({ default: 0, required: true }) uid: number;

    /**
     * Hex ids of mosaics to show in options
     * @type {string[]}
     */
    @Prop({ default: () => [] }) mosaicHexIds: string[];

    /**
     * Whether to show absolute amounts or not
     */
    @Prop({ default: false }) absolute: boolean;

    /**
     * the item index in the Array
     */
    @Prop({ default: true }) isShowDelete: boolean;

    /**
     * True if the user is in offline mode
     */
    @Prop({ default: false }) isOffline: boolean;

    /**
     * whether to show the label accord to isFirstItem
     */
    @Prop({ default: true }) isFirstItem: boolean;
    @Prop({ default: 0 }) selectedFeeValue: number;
    @Prop({ default: false }) isAggregate: boolean;

    /**
     * Updated value to sync with the parent formItems
     * @protected
     * @type {{mosaicHex: string, amount: number}}
     */
    protected get chosenValue(): { mosaicHex: string; amount: string } {
        if (!this.mosaicAttachment) {
            return {
                mosaicHex: '',
                amount: '0',
            };
        }

        if (!this.mosaicAttachment.amount) {
            return {
                ...this.mosaicAttachment,
                amount: '0',
            };
        }

        if (!navigator.languages) {
            return this.mosaicAttachment;
        }

        const decimalSeparator = Formatters.getDecimalSeparator(navigator.languages[0]);
        let formattedAmount = this.mosaicAttachment.amount;

        if (decimalSeparator !== ',') {
            formattedAmount = this.mosaicAttachment.amount.replace(',', '');
        }

        return {
            ...this.mosaicAttachment,
            amount: formattedAmount,
        };
    }

    /**
     * Handle mosaic changes from mosaic selection fields
     * @param {string} hex
     */
    public onChangeMosaic(hex: string): void {
        Vue.set(this.chosenValue, 'mosaicHex', hex);
        Vue.nextTick().then(() => this.emitChange());
    }

    /**
     * Handle amount changes from mosaic selection fields
     * @param {number} amount
     */
    public onChangeAmount(amount: number): void {
        Vue.set(this.chosenValue, 'amount', amount);
        Vue.nextTick().then(() => this.emitChange());
    }

    /**
     * Emits input change to the parent
     * @private
     * @return {void}
     */
    private emitChange(): void {
        this.$emit('input-changed', {
            mosaicAttachment: this.chosenValue,
            inputIndex: this.uid,
        });
    }

    /**
     * Form items
     * @var {any}
     */
    public formItems = {
        selectedMosaicHex: '',
        relativeAmount: this.chosenValue.amount,
    };

    get relativeAmount(): string {
        return this.formItems.relativeAmount;
    }

    set relativeAmount(amount: string) {
        this.formItems.relativeAmount = amount;
    }
    /// end-region computed properties getter/setter

    mounted() {
        this.emitChange();
    }

    @Watch('mosaicAttachment')
    public onMosaicAttachmentChange() {
        this.relativeAmount = this.chosenValue.amount;
    }
}
