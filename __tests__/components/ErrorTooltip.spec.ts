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

    test('displayed error returns null when errors undefined', () => {
        // Arrange:
        const wrapper = getErrorTooltipWrapper();
        const component = wrapper.vm as ErrorTooltipTs;

        // Act + Assert:
        expect(component.displayedError).toBe(null);
        expect(component.errored).toBe(false);
    });

    test('displayed error returns null when errors are empty', () => {
        // Arrange:
        const errors = [];
        const wrapper = getErrorTooltipWrapper(errors);
        const component = wrapper.vm as ErrorTooltipTs;

        // Act + Assert:
        expect(component.displayedError).toBe(null);
        expect(component.errored).toBe(false);
    });

    test('displayed error returns errors as concatenated string', () => {
        // Arrange:
        const errors = ['error 1', 'error 2'];
        const wrapper = getErrorTooltipWrapper(errors);
        const component = wrapper.vm as ErrorTooltipTs;

        // Act + Assert:
        expect(component.displayedError).toBe('* error 1\n* error 2');
        expect(component.errored).toBe(true);
    });

    test('displayed error trims errors and filters that are empty strings', () => {
        // Arrange:
        const errors = ['error 1', 'error 2 ', ' error 3 ', ' ', ''];
        const wrapper = getErrorTooltipWrapper(errors);
        const component = wrapper.vm as ErrorTooltipTs;

        // Act + Assert:
        expect(component.displayedError).toBe('* error 1\n* error 2\n* error 3');
        expect(component.errored).toBe(true);
    });

    test('displayed error returns null when errors are empty string', () => {
        // Arrange:
        const errors = ['', ''];
        const wrapper = getErrorTooltipWrapper(errors);
        const component = wrapper.vm as ErrorTooltipTs;

        // Act + Assert:
        expect(component.displayedError).toBe(null);
        expect(component.errored).toBe(false);
    });
});
