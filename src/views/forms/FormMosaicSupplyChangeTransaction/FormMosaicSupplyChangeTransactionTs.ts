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
import { MosaicId, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction, Transaction, UInt64 } from 'symbol-sdk';
import { Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import SupplyInput from '@/components/SupplyInput/SupplyInput.vue';
// @ts-ignore
import DivisibilityInput from '@/components/DivisibilityInput/DivisibilityInput.vue';
// @ts-ignore
import DurationInput from '@/components/DurationInput/DurationInput.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue';
import { Formatters } from '@/core/utils/Formatters';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        FormWrapper,
        SignerSelector,
        SupplyInput,
        DivisibilityInput,
        DurationInput,
        ModalTransactionConfirmation,
        FormRow,
        ErrorTooltip,
        MaxFeeAndSubmit,
        MosaicSelector,
    },
    computed: { ...mapGetters({ mosaics: 'mosaic/mosaics', holdMosaics: 'mosaic/holdMosaics' }) },
})
export class FormMosaicSupplyChangeTransactionTs extends FormTransactionBase {
    /**
     * Mosaic hex Id
     * @type {string}
     */
    @Prop({ default: null }) mosaicHexId: string;

    @Prop({
        default: '',
    })
    title: string;

    @Prop({
        default: false,
    })
    isAggregate: boolean;

    @Prop({
        default: false,
    })
    hideSave: boolean;

    @Prop({
        default: false,
    })
    editMode: boolean;

    @Prop({
        default: () => ({}),
    })
    value: any;
    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    protected validationRules = ValidationRuleset;

    /**
     * Mosaic supply change enum
     * @protected
     */
    protected MosaicSupplyChangeAction = MosaicSupplyChangeAction;

    /**
     * Form items
     * @protected
     * @var {Record<string, any>}
     */
    protected formItems = {
        mosaicHexId: null,
        action: null,
        delta: null,
        maxFee: this.defaultFee,
    };

    /**
     * Mosaics owned by the current account
     * @protected
     */
    private mosaics: MosaicModel[];
    private holdMosaics: MosaicModel[];

    /**
     * Current mosaic info
     * @readonly
     * @protected
     */
    protected get currentMosaicInfo(): MosaicModel {
        if (this.formItems.mosaicHexId) {
            return this.mosaics.find(({ mosaicIdHex }) => mosaicIdHex === this.formItems.mosaicHexId);
        }
    }

    /**
     * Current mosaic relative supply
     * @readonly
     * @protected
     * @type {number}
     */
    protected get currentMosaicRelativeSupply(): string | null {
        const currentMosaicInfo = this.currentMosaicInfo;
        if (!currentMosaicInfo) {
            return;
        }
        const relative = currentMosaicInfo.supply / Math.pow(10, currentMosaicInfo.divisibility);
        return isNaN(relative) ? null : Formatters.formatNumber(relative, this.currentMosaicInfo.divisibility);
    }

    /**
     * New absolute supply
     * @readonly
     * @protected
     * @type {(number | null)}
     */
    protected get newMosaicAbsoluteSupply(): number | null {
        const currentMosaicInfo = this.currentMosaicInfo;
        if (currentMosaicInfo === undefined) {
            return;
        }
        const newSupply =
            this.formItems.action === MosaicSupplyChangeAction.Increase
                ? currentMosaicInfo.supply + Number(this.formItems.delta)
                : currentMosaicInfo.supply - Number(this.formItems.delta);

        return isNaN(newSupply) ? null : newSupply;
    }

    /**
     * New relative supply
     * @readonly
     * @protected
     * @type {(number | null)}
     */
    protected get newMosaicRelativeSupply(): string | null {
        if (!this.newMosaicAbsoluteSupply) {
            return;
        }
        const relative = this.newMosaicAbsoluteSupply / Math.pow(10, this.currentMosaicInfo.divisibility);
        return isNaN(relative) ? null : Formatters.formatNumber(relative, this.currentMosaicInfo.divisibility);
    }

    /**
     * Reset the form with properties
     * @return {void}
     */
    protected resetForm(): void {
        if (this.editMode) {
            return;
        }

        // - re-populate form if transaction staged
        // if (this.stagedTransactions.length) {
        //   // @TODO: initialization from staged transactions
        //   this.isAwaitingSignature = true
        //   return
        // }

        // - set default form values
        this.formItems.mosaicHexId = this.mosaicHexId;
        this.formItems.action = MosaicSupplyChangeAction.Increase;
        this.formItems.delta = 1;

        // - maxFee must be absolute
        this.formItems.maxFee = this.defaultFee;
    }

    /**
     * Getter for SUPPLY CHANGE transactions that will be staged
     * @see {FormTransactionBase}
     * @return {Transaction[]}
     */
    protected getTransactions(): Transaction[] {
        return [
            MosaicSupplyChangeTransaction.create(
                this.createDeadline(),
                new MosaicId(this.formItems.mosaicHexId),
                this.formItems.action,
                UInt64.fromUint(this.formItems.delta),
                this.networkType,
                UInt64.fromUint(this.formItems.maxFee),
            ),
        ];
    }

    /**
     * Setter for TRANSFER transactions that will be staged
     * @see {FormTransactionBase}
     * @param {TransferTransaction[]} transactions
     * @throws {Error} If not overloaded in derivate component
     */
    protected setTransactions(transactions: Transaction[]) {
        // - this form creates 1 transaction
        const supplyChange = transactions.shift() as MosaicSupplyChangeTransaction;

        // - populate from definition
        this.formItems.mosaicHexId = supplyChange.mosaicId.toHex();
        this.formItems.action = supplyChange.action;
        this.formItems.delta = supplyChange.delta.compact();

        // - populate maxFee
        this.formItems.maxFee = supplyChange.maxFee.compact();
    }

    get ownedTargetHexIds(): string[] {
        return this.holdMosaics
            .filter((m) => m.ownerRawPlain === this.currentAccount.address && m.supplyMutable)
            .map(({ mosaicIdHex }) => mosaicIdHex);
    }

    public emitToAggregate() {
        if (this.getTransactions().length > 0) {
            this.$emit('txInput', this.formItems);
        }
    }

    mounted() {
        if (this.isAggregate && this.value) {
            Object.assign(this.formItems, this.value);
            this.formItems.action = this.value.action;
        }
    }
}
