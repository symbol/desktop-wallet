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
import FormInputEditable from '@/components/FormInputEditable/FormInputEditable.vue';
import { FormInputEditableTs } from '@/components/FormInputEditable/FormInputEditableTs';
import { StandardValidationRules } from '@/core/validation/StandardValidationRules';
import i18n from '@/language/index';
import { createLocalVue, mount } from '@vue/test-utils';
import { ValidationProvider } from 'vee-validate';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

StandardValidationRules.register();

interface FormInputEditableProps {
    model?: any;
    label: string;
    value: string;
    rules?: string;
    onEdit?: (value: string) => void;
}

describe('components/FormInputEditable', () => {
    const getFormInputEditableWrapper = (props?: FormInputEditableProps) => {
        const localVue = createLocalVue();
        localVue.component('ValidationProvider', ValidationProvider);
        localVue.use(Vuex);
        localVue.use(VueI18n);
        const store = new Vuex.Store({
            modules: {},
        });
        const options = {
            localVue,
            i18n,
            store,
            propsData: { ...props },
            stubs: ['Tooltip'],
        };
        const wrapper = mount(FormInputEditable, options);
        return wrapper;
    };

    test('renders component', () => {
        // Arrange + Act:
        const props = {
            value: 'myAccountName',
            label: 'myLabel',
        };
        const wrapper = getFormInputEditableWrapper(props);

        // Assert:
        expect(wrapper.find('span.accountName').text()).toBe(props.value);
        expect(wrapper.find('div.label').text()).toBe(props.label + ':');
    });

    const testEditingSuccess = async (valueProp?: string) => {
        // Arrange:
        const props = {
            value: valueProp,
            model: {},
            label: 'myLabel',
            rules: '',
            onEdit: jest.fn(),
        };
        const newAccountName = 'myNewAccountName';
        const wrapper = getFormInputEditableWrapper(props);
        const component = wrapper.vm as FormInputEditableTs;

        // Act:
        await wrapper.find('button').trigger('click');
        await wrapper.find('input').setValue(newAccountName);
        component.finishEdition();

        // Assert:
        expect(component.value).toBe(newAccountName);
        expect(props.onEdit).toHaveBeenCalledWith(newAccountName);
    };

    test('complete editing with success when value is not empty', async () => {
        testEditingSuccess('myAccountName');
    });

    test('complete editing with success when value is empty', async () => {
        testEditingSuccess();
    });

    test('cancel editing', async () => {
        // Arrange:
        const props = {
            value: 'myAccountName',
            model: {},
            label: 'myLabel',
            rules: '',
            onEdit: jest.fn(),
        };
        const newAccountName = 'myNewAccountName';
        const wrapper = getFormInputEditableWrapper(props);
        const component = wrapper.vm as FormInputEditableTs;

        // Act:
        await wrapper.find('button').trigger('click');
        await wrapper.find('input').setValue(newAccountName);
        component.cancelEdition();

        // Assert:
        expect(component.editing).toBe(false);
        expect(props.onEdit).not.toHaveBeenCalled();
    });
});
