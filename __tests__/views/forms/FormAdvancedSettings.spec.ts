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
import { NotificationType } from '@/core/utils/NotificationType';
import FormAdvancedSettings from '@/views/forms/FormAdvancedSettings/FormAdvancedSettings.vue';
import { FormAdvancedSettingsTs } from '@/views/forms/FormAdvancedSettings/FormAdvancedSettingsTs';
import { getComponent } from '@MOCKS/Components';

describe('forms/FormAdvancedSettings', () => {
    const getAccountMultisigGraphWrapper = (allowUnknownMultisigTransactions: boolean) => {
        const mockStore = {
            app: {
                namespaced: true,
                getters: {
                    settings: () => ({
                        profileName: '',
                        language: '',
                        defaultFee: 0,
                        defaultAccount: '',
                        allowUnknownMultisigTransactions,
                    }),
                },
            },
        };

        const stubs = {
            FormRow: {
                template: '<div><slot name="label" /><slot name="inputs" /></div>',
            },
            ModalFormProfileUnlock: {
                template: '<div class="modal" />',
            },
        };

        return getComponent(FormAdvancedSettings, mockStore, null, null, stubs);
    };

    describe('allowUnknownMultisigTransactions', () => {
        const runAllowUnknownMultisigTransactionsTest = (
            settingsValue: boolean,
            expectations: {
                controlValue: number;
                alertToBeRendered: boolean;
            },
        ) => {
            // Act:
            const wrapper = getAccountMultisigGraphWrapper(settingsValue);
            const component = wrapper.vm as FormAdvancedSettingsTs;
            const alertElement = wrapper.find('alert-stub');
            const controlValue = component.allowUnknownMultisigTransactions;
            const isAlertrendered = !!alertElement.attributes('visible');

            // Assert:
            expect(controlValue).toBe(expectations.controlValue);
            expect(isAlertrendered).toBe(expectations.alertToBeRendered);
        };

        test('render negative value', () => {
            // Arrange:
            const settingsValue = false;
            const expectations = {
                controlValue: 0,
                alertToBeRendered: false,
            };

            // Act + Assert:
            runAllowUnknownMultisigTransactionsTest(settingsValue, expectations);
        });

        test('render positive value', () => {
            // Arrange:
            const settingsValue = true;
            const expectations = {
                controlValue: 1,
                alertToBeRendered: true,
            };

            // Act + Assert:
            runAllowUnknownMultisigTransactionsTest(settingsValue, expectations);
        });
    });

    describe('onChange()', () => {
        test('enable submit button', async () => {
            // Arrange:
            const buttonSelector = '[type="submit"]';

            // Act:
            const wrapper = getAccountMultisigGraphWrapper(false);
            const component = wrapper.vm as FormAdvancedSettingsTs;
            component.onChange();
            await component.$nextTick();
            const buttonElement = wrapper.find(buttonSelector);

            // Assert:
            expect(component.isSubmitDisabled).toBe(false);
            expect(buttonElement.attributes('disabled')).toBeFalsy();
        });
    });

    describe('reset()', () => {
        test('override formValues with data from app settings', () => {
            // Arrange:
            const settingsValue = false;
            const controlValue = 1;
            const expectedValue = false;

            // Act:
            const wrapper = getAccountMultisigGraphWrapper(settingsValue);
            const component = wrapper.vm as FormAdvancedSettingsTs;
            component.allowUnknownMultisigTransactions = controlValue;
            component.reset();
            const value = component.formValues.allowUnknownMultisigTransactions;

            // Assert:
            expect(value).toBe(expectedValue);
        });
    });

    describe('submit()', () => {
        test('render ModalFormProfileUnlock', async () => {
            // Arrange:
            const modalSelector = '.modal';

            // Act:
            const wrapper = getAccountMultisigGraphWrapper(false);
            const component = wrapper.vm as FormAdvancedSettingsTs;
            component.submit();
            await component.$nextTick();
            const modalElement = wrapper.find(modalSelector);

            // Assert:
            expect(component.showProfileUnlockModal).toBe(true);
            expect(modalElement.exists()).toBe(true);
        });
    });

    describe('onAccountUnlocked()', () => {
        const runOnAccountUnlockedTest = async (
            formValues: Record<string, any>,
            mockDispatch: jest.Mock,
            expectations: {
                dispatchCalls: [string, any][];
                eventsToBeEmitted: [string, any][];
            },
        ) => {
            // Act:
            const wrapper = getAccountMultisigGraphWrapper(false);
            const component = wrapper.vm as FormAdvancedSettingsTs;
            component.formValues = (formValues as unknown) as any;
            component.$store.dispatch = mockDispatch;
            await component.onAccountUnlocked();

            // Assert:
            expect(mockDispatch.mock.calls).toEqual(expectations.dispatchCalls);
        };

        test('update store and emit submit events', async () => {
            // Arrange:
            const mockDispatch = jest.fn();
            const formValues = {};
            const expectations = {
                dispatchCalls: [
                    ['app/SET_SETTINGS', formValues],
                    ['notification/ADD_SUCCESS', NotificationType.SUCCESS_SETTINGS_UPDATED],
                ] as [string, any][],
                eventsToBeEmitted: [['submit', formValues], ['close']] as [string, any][],
            };

            // Act + Assert:
            await runOnAccountUnlockedTest(formValues, mockDispatch, expectations);
        });

        test('handle error', async () => {
            // Arrange:
            const mockDispatch = jest.fn().mockRejectedValue(null);
            const formValues = {};
            const expectations = {
                dispatchCalls: [
                    ['app/SET_SETTINGS', formValues],
                    ['notification/ADD_ERROR', 'An error happened, please try again.'],
                ] as [string, any][],
                eventsToBeEmitted: [] as [string, any][],
            };

            // Act + Assert:
            await runOnAccountUnlockedTest(formValues, mockDispatch, expectations);
        });
    });
});
