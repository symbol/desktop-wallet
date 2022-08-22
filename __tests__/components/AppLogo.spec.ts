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
import { mount } from '@vue/test-utils';
// @ts-ignore
import AppLogo from '@/components/AppLogo/AppLogo';
import { appConfig } from '@/config';

describe('components/AppLogo', () => {
    test('renders component', () => {
        // Arrange + Act:
        const wrapper = mount(AppLogo);
        const element = wrapper.find('img');

        // Assert:
        expect(element.attributes('src')).toBe('symbol_logo.png');
        expect(element.attributes('alt')).toBe(appConfig.title);
        wrapper.destroy();
    });
});
