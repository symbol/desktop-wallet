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
import RestrictionDirectionInput from '@/components/RestrictionDirectionInput/RestrictionDirectionInput.vue';
import { getComponent } from '@MOCKS/Components';

describe('components/RestrictionDirectionInput', () => {
    const getRestrictionDirectionInputWrapper = () =>
        getComponent(
            RestrictionDirectionInput,
            {},
            {},
            {},
            {
                Icon: true,
                Tooltip: true,
            },
        );

    describe('Selector', () => {
        test('renders restriction direction selector options', () => {
            // Arrange:
            const wrapper = getRestrictionDirectionInputWrapper();

            // Act:
            const options = wrapper.findAll('option');

            // Assert:
            expect(options.length).toBe(2);
            expect(options.at(0).text()).toBe('Incoming');
            expect(options.at(1).text()).toBe('Outgoing');
        });
    });

    describe('onDirectionChange', () => {
        test('emits input value when direction change', () => {
            // Arrange:
            const wrapper = getRestrictionDirectionInputWrapper();

            // Act:
            // @ts-ignore
            wrapper.vm.onDirectionChange('incoming');

            // Assert:
            expect(wrapper.emitted('input')).toEqual([['incoming']]);
        });
    });
});
