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
import RestrictionTypeInput from '@/components/RestrictionTypeInput/RestrictionTypeInput.vue';
import { getComponent } from '@MOCKS/Components';

describe('components/RestrictionTypeInput', () => {
    const getRestrictionTypeInputWrapper = () =>
        getComponent(
            RestrictionTypeInput,
            {},
            {},
            {},
            {
                Icon: true,
                Tooltip: true,
            },
        );

    describe('Selector', () => {
        test('renders restriction type selector options', () => {
            // Arrange:
            const wrapper = getRestrictionTypeInputWrapper();

            // Act:
            const options = wrapper.findAll('option');

            // Assert:
            expect(options.length).toBe(2);
            expect(options.at(0).text()).toBe('Block');
            expect(options.at(1).text()).toBe('Allow');
        });
    });

    describe('onBlockTypeChange', () => {
        test('emits input value when block type change', () => {
            // Arrange:
            const wrapper = getRestrictionTypeInputWrapper();

            // Act:
            // @ts-ignore
            wrapper.vm.onBlockTypeChange('block');

            // Assert:
            expect(wrapper.emitted('input')).toEqual([['block']]);
        });
    });
});
