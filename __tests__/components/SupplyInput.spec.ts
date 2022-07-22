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
import SupplyInput from '@/components/SupplyInput/SupplyInput.vue';
import { SupplyInputTs } from '@/components/SupplyInput/SupplyInputTs';
import { getComponent } from '@MOCKS/Components';

describe('components/SupplyInput', () => {
    const getSupplyInputWrapper = () => {
        return getComponent(
            SupplyInput,
            {},
            {},
            {
                value: 10,
            },
            {},
        );
    };

    test('renders supply input', () => {
        // Arrange:
        const wrapper = getSupplyInputWrapper();
        const vm = wrapper.vm as SupplyInputTs;

        // Act + Assert:
        expect(vm.chosenValue).toBe(10);
    });

    test('emit value for supply input', () => {
        // Arrange:
        const wrapper = getSupplyInputWrapper();
        const vm = wrapper.vm as SupplyInputTs;

        // Act:
        vm.chosenValue = 1;

        // Assert:
        expect(wrapper.emitted('input')).toEqual([[1]]);
    });
});
