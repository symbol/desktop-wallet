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
import DivisibilityInput from '@/components/DivisibilityInput/DivisibilityInput.vue';
import { StandardValidationRules } from '@/core/validation/StandardValidationRules';
import i18n from '@/language/index';
import { createLocalVue, mount } from '@vue/test-utils';
import { ValidationProvider } from 'vee-validate';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

StandardValidationRules.register();

describe('components/DivisibilityInput', () => {
    const getDivisibilityInputWrapper = (value?: string) => {
        const localVue = createLocalVue();
        localVue.component('ValidationProvider', ValidationProvider);
        localVue.use(Vuex);
        localVue.use(VueI18n);
        const options = {
            localVue,
            i18n,
            propsData: { value },
            stubs: ['Tooltip'],
            sync: false,
        };
        const wrapper = mount(DivisibilityInput, options);
        return wrapper;
    };

    const testDivisibilityInputWithGivenPropValue = (value, expectedValue = value) => {
        // Arrange + Act:
        const wrapper = getDivisibilityInputWrapper(value);

        // Assert:
        const element = wrapper.find('input[type="number"]').element as HTMLInputElement;
        expect(element.value).toBe(expectedValue);
    };

    test('renders component with the valid values given', async () => {
        ['0', '1', '2', '3', '4', '5', '6'].forEach((value) => testDivisibilityInputWithGivenPropValue(value));
    });

    const testDivisibilityInputWithValueInput = async (value, expectedValue = value) => {
        // Arrange:
        const wrapper = getDivisibilityInputWrapper(value);

        // Act:
        wrapper.find('input[type="number"]').setValue(value);
        await wrapper.vm.$nextTick();

        // Assert:
        expect(wrapper.emitted('input')[0][0]).toBe(expectedValue);
    };

    test('value is set to 0 when a negative value given', async () => {
        ['-10', '-5', '-1'].forEach(async (value) => await testDivisibilityInputWithValueInput(value, '0'));
    });

    test('value is set to 6 when a larger value given', async () => {
        ['7', '10', '20'].forEach(async (value) => await testDivisibilityInputWithValueInput(value, '6'));
    });
});
