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
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector.vue';
import { LanguageSelectorTs } from '@/components/LanguageSelector/LanguageSelectorTs';
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof LanguageSelectorTs>['$props'];

describe('components/LanguageSelector', () => {
    const getLanguageSelectorWrapper = (props: Props, mockDispatch?: jest.Mock, language = 'en') => {
        const mockStore = {
            app: {
                namespaced: true,
                getters: {
                    language: () => language,
                    languages: () => [
                        { value: 'en', label: 'english' },
                        { value: 'eo', label: 'esperanto' },
                    ],
                },
            },
        };

        return getComponent(LanguageSelector, mockStore, {}, props, null, mockDispatch);
    };

    describe('defaultFormStyle', () => {
        const runFormStyleTest = (defaultFormStyle: boolean, expectedClassName: string) => {
            // Arrange:
            const props = {
                defaultFormStyle,
            };

            // Act:
            const wrapper = getLanguageSelectorWrapper(props);
            const selectElement = wrapper.find('i-select');

            // Assert:
            expect(selectElement.attributes().class).toBe(expectedClassName);
        };

        test('set default form styles when positive', () => {
            // Arrange:
            const defaultFormStyle = true;
            const expectedClassName = 'select-size select-style';

            // Act + Assert:
            runFormStyleTest(defaultFormStyle, expectedClassName);
        });

        test('set no style when negative', () => {
            // Arrange:
            const defaultFormStyle = false;
            const expectedClassName = '';

            // Act + Assert:
            runFormStyleTest(defaultFormStyle, expectedClassName);
        });
    });

    describe('autoSubmit', () => {
        const runAutoSubmitTest = async (autoSubmit: boolean, expectedActionToBeDispatched?: string) => {
            // Arrange:
            const props = {
                autoSubmit,
            };
            const mockDispatch = jest.fn();
            const newLanguageValue = 'es';

            // Act:
            const wrapper = getLanguageSelectorWrapper(props, mockDispatch);
            const component = wrapper.vm as LanguageSelectorTs;
            component['language'] = newLanguageValue;
            await component.$nextTick();

            // Assert:
            if (expectedActionToBeDispatched) {
                expect(mockDispatch).toBeCalledWith(expectedActionToBeDispatched, newLanguageValue);
            } else {
                expect(mockDispatch).not.toBeCalled();
            }
        };

        test('dispatch SET_LANGUAGE action when positive', async () => {
            // Arrange:
            const autoSubmit = true;
            const expectedActionToBeDispatched = 'app/SET_LANGUAGE';

            // Act + Assert:
            await runAutoSubmitTest(autoSubmit, expectedActionToBeDispatched);
        });

        test('not dispatch SET_LANGUAGE action when negative', async () => {
            // Arrange:
            const autoSubmit = false;
            const expectedActionToBeDispatched = '';

            // Act + Assert:
            await runAutoSubmitTest(autoSubmit, expectedActionToBeDispatched);
        });
    });

    describe('created', () => {
        const runCreatedHookTest = (currentLanguage: string, expectedLanguage: string) => {
            // Arrange:
            const props = {};

            // Act:
            const wrapper = getLanguageSelectorWrapper(props, null, currentLanguage);
            const component = wrapper.vm as LanguageSelectorTs;
            const language = component['language'];

            // Assert:
            expect(language).toBe(expectedLanguage);
        };

        test('set current language from store', () => {
            // Arrange:
            const currentLanguage = 'es';
            const expectedLanguage = 'es';

            // Act + Assert:
            runCreatedHookTest(currentLanguage, expectedLanguage);
        });

        test('set language from list', () => {
            // Arrange:
            const currentLanguage = '';
            const expectedLanguage = 'en';

            // Act + Assert:
            runCreatedHookTest(currentLanguage, expectedLanguage);
        });
    });

    test('emit set of events when language is selected', async () => {
        // Arrange:
        const props = {};
        const selectChangeEvent = 'input';
        const language = 'en';
        const expectedEventsToBeEmitted = [
            ['on-change', []],
            ['input', [language]],
        ];

        // Act:
        const wrapper = getLanguageSelectorWrapper(props);
        const component = wrapper.vm as LanguageSelectorTs;
        component['language'] = language;
        await wrapper.find('i-select').trigger(selectChangeEvent);

        // Assert:
        expectedEventsToBeEmitted.forEach((event) => {
            const eventName = event[0] as string;
            const eventPayload = event[1];
            const emittedEvent = wrapper.emitted()[eventName];

            expect(emittedEvent[0]).toStrictEqual(eventPayload);
        });
    });
});
