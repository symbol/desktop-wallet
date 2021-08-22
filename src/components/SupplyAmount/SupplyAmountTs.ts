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
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { Formatters } from '@/core/utils/Formatters';
// child components
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        FormRow,
    },
})
export class SupplyAmountTs extends Vue {
    /**
     * Supply Absolute Value
     * @type {number}
     */
    @Prop({ default: 0 }) supply: number;

    /**
     * Divisibility Value
     * @type {number}
     */
    @Prop({ default: 0 }) divisibility: number;

    /**
     * Form label
     * @type {string}
     */
    @Prop({ default: 'supply' }) label: string;

    /// region computed properties getter/setter
    public get relativeValue(): string {
        return Formatters.formatNumber(this.supply / Math.pow(10, this.divisibility), this.divisibility);
    }
    /// end-region computed properties getter/setter
}
