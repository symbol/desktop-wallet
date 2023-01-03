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
import SplitButton from '@/components/SplitButton/SplitButton.vue';
import SplitButtonTs from '@/components/SplitButton/SplitButtonTs';
import { getComponent } from '@MOCKS/Components';

describe('components/SplitButton', () => {
    const getSplitButtonWrapper = () =>
        getComponent(
            SplitButton,
            {},
            {},
            {},
            {
                'dropdown-menu': true,
                'i-button': true,
                dropdown: true,
                Icon: true,
                'dropdown-item': true,
            },
        );

    test('renders split button and emit an event on click', () => {
        // Arrange:
        const wrapper = getSplitButtonWrapper();

        // Act:
        wrapper.find('.split-main-button').trigger('click');

        // Assert:
        expect(wrapper.emitted('click')).toEqual([[]]);
    });

    test('renders dropdown menu items', async () => {
        // Arrange:
        const wrapper = getSplitButtonWrapper();

        const vm = wrapper.vm as SplitButtonTs;

        vm.$set(vm, 'dropdownActions', [
            {
                icon: 'test-icon',
                label: 'test',
            },
            {
                icon: 'test1-icon',
                label: 'test1',
            },
        ]);

        await vm.$nextTick();

        // Act + Assert:
        const dropdownComponent = wrapper.findAll('dropdown-item-stub');
        const dropdownComponentIcon = wrapper.findAll('icon-stub');

        expect(dropdownComponent.length).toBe(2);
        expect(dropdownComponentIcon.length).toBe(2);
        expect(dropdownComponent.at(0).text()).toBe('test');
        expect(dropdownComponentIcon.at(0).attributes().type).toBe('test-icon');
        expect(dropdownComponent.at(1).text()).toBe('test1');
        expect(dropdownComponentIcon.at(1).attributes().type).toBe('test1-icon');
    });
});
