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
import { TransactionType } from 'symbol-sdk';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OperationRestrictionTransactionTypeSelectorTs extends Vue {
    /**
     * Value set by the parent component's v-model
     * @type {string}
     */
    @Prop({ default: null }) value: number;

    @Prop({ default: false }) readonly disabled!: boolean;

    /// region computed properties getter/setter
    /**
     * Value set by the parent component
     * @type {number}
     */
    get chosenValue(): number {
        return this.value;
    }

    /**
     * Emit value change
     */
    set chosenValue(newValue: number) {
        this.$emit('input', newValue);
    }

    /**
     * Returns sorted TransactionType list
     */
    public get transactionTypeList() {
        // ACCOUNT_OPERATION_RESTRICTION will be excluded from the list
        // because Account Operation Restriction Transaction is not supported
        return Object.entries(TransactionType)
            .filter((e) => !(parseInt(e[0]) >= 0) && e[0] !== 'RESERVED' && e[1] !== TransactionType.ACCOUNT_OPERATION_RESTRICTION)
            .sort((e1, e2) => e1[0].localeCompare(e2[0]));
    }
}
