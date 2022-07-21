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
// @ts-ignore
import Alert, { AlertType } from '@/components/Alert/Alert.vue';
import { getComponent } from '@MOCKS/Components';

describe('components/Alert', () => {
    const getAlertWrapper = (value: string, type?: AlertType, visible?: boolean) => {
        const wrapper = getComponent(
            Alert,
            {},
            {},
            {
                value,
                type,
                visible,
            },
        );
        return wrapper;
    };

    const testAlert = (type: AlertType = 'warning', visible: boolean = true) => {
        // Arrange:
        const value = 'some text to display';

        // Act:
        const wrapper = getAlertWrapper(value, type, visible);
        const component = wrapper.vm as Alert;

        // Assert:
        if (visible) {
            expect(wrapper.find('div.text').text()).toBe(value);
        } else {
            expect(wrapper.find('div.text').exists()).toBe(false);
        }
        // @ts-ignore
        expect(component.rootClass).toBe(`color-${type}`);
        // @ts-ignore
        expect(component.isIconShown).toBe(visible);
    };

    test('renders component with default type warning', () => {
        testAlert('warning');
    });

    test('renders component with type danger', () => {
        testAlert('danger');
    });

    test('renders component with type danger', () => {
        testAlert('success');
    });

    test('text not shown when invisible', () => {
        testAlert('success', false);
    });
});
