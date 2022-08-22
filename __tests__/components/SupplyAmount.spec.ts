/*
 * (C) Symbol Contributors 2022
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
import SupplyAmount from '@/components/SupplyAmount/SupplyAmount.vue';
import { SupplyAmountTs } from '@/components/SupplyAmount/SupplyAmountTs';
import { getComponent } from '@MOCKS/Components';

describe('components/SupplyAmount', () => {
    test('renders supply amount', () => {
        // Arrange:
        const wrapper = getComponent(
            SupplyAmount,
            {},
            {},
            {
                supply: 1000,
                divisibility: 6,
            },
            {},
        );
        const vm = wrapper.vm as SupplyAmountTs;

        // Act + Assert:
        expect(vm.relativeValue).toBe('0.001');
    });
});
