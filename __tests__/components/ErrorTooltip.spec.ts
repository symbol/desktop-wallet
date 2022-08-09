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
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
import { ErrorTooltipTs } from '@/components/ErrorTooltip/ErrorTooltipTs';
import { getComponent } from '@MOCKS/Components';

describe('components/ErrorTooltip', () => {
    const getErrorTooltipWrapper = (errors?: string[]) => {
        return getComponent(
            ErrorTooltip,
            {},
            {},
            {
                errors,
            },
            {},
        );
    };

    test('renders error tooltip', () => {
        // Arrange:
        const wrapper = getErrorTooltipWrapper();

        // Act + Assert:
        expect(wrapper.find('tooltip').exists()).toBe(true);
    });

    test('field error returns null when no errors', () => {
        // Arrange:
        const wrapper = getErrorTooltipWrapper();
        const component = wrapper.vm as ErrorTooltipTs;

        // Assert:
        expect(component.fieldError).toBe(null);
        expect(component.displayedError).toBe('');
        expect(component.errored).toBe(false);
    });

    test('field error returns null when errors are empty', () => {
        // Arrange:
        const errors = [];
        const wrapper = getErrorTooltipWrapper(errors);
        const component = wrapper.vm as ErrorTooltipTs;

        // Assert:
        expect(component.fieldError).toBe(null);
    });

    test('field error returns first error from error list', () => {
        // Arrange:
        const firstErrorItem = 'error 1';
        const errors = [firstErrorItem, 'error 2'];
        const wrapper = getErrorTooltipWrapper(errors);
        const component = wrapper.vm as ErrorTooltipTs;

        // Assert:
        expect(component.fieldError).toBe(firstErrorItem);
        expect(component.displayedError).toBe(firstErrorItem);
        expect(component.errored).toBe(true);
    });
});
