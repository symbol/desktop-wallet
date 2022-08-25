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
import MnemonicInput from '@/components/MnemonicInput/MnemonicInput.vue';
import { MnemonicInputTs } from '@/components/MnemonicInput/MnemonicInputTs';
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof MnemonicInputTs>['$props'];

describe('components/MnemonicInput', () => {
    const getMnemonicInputWrapper = (props: Props) => {
        return getComponent(MnemonicInput, {}, {}, props);
    };

    describe('set userInput', () => {
        const runSetUserInputTest = (
            input: string,
            isEditing: boolean,
            wordsArrayLength: number,
            expectations: {
                initInputToBeCalled: boolean;
                inputWordValue: string;
                finalIsEditingValue: boolean;
            },
        ) => {
            // Arrange:
            const wordsArray = new Array(wordsArrayLength).fill('word');
            const props = {
                seed: wordsArray.join(' '),
            };
            const mockInitInput = jest.fn();

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component.initInput = mockInitInput;
            component.isEditing = isEditing;
            component.userInput = input;
            const inputWord = component.inputWord;
            const finalIsEditingValue = component.isEditing;

            // Assert:
            if (expectations.initInputToBeCalled) {
                expect(mockInitInput).toBeCalled();
            } else {
                expect(mockInitInput).not.toBeCalled();
            }
            expect(inputWord).toBe(expectations.inputWordValue);
            expect(finalIsEditingValue).toBe(expectations.finalIsEditingValue);
        };

        test('call initInput() when length of words is 24', () => {
            // Arrange:
            const input = 'word';
            const isEditing = true;
            const wordsArrayLength = 24;
            const expectations = {
                initInputToBeCalled: true,
                inputWordValue: '',
                finalIsEditingValue: true,
            };

            // Act + Assert:
            runSetUserInputTest(input, isEditing, wordsArrayLength, expectations);
        });

        test('set inputWord when length of words is less than 24', () => {
            // Arrange:
            const input = 'word';
            const isEditing = true;
            const wordsArrayLength = 12;
            const expectations = {
                initInputToBeCalled: false,
                inputWordValue: 'word',
                finalIsEditingValue: true,
            };

            // Act + Assert:
            runSetUserInputTest(input, isEditing, wordsArrayLength, expectations);
        });

        test("set isEditing to true when it's value is false", () => {
            // Arrange:
            const input = 'word';
            const isEditing = false;
            const wordsArrayLength = 12;
            const expectations = {
                initInputToBeCalled: false,
                inputWordValue: 'word',
                finalIsEditingValue: true,
            };

            // Act + Assert:
            runSetUserInputTest(input, isEditing, wordsArrayLength, expectations);
        });
    });

    describe('showCopyButton()', () => {
        const runShowCopyButtonTest = (
            wordsArrayLength: number,
            expectations: {
                showCopyButton: boolean;
                showPasteButton: boolean;
            },
        ) => {
            // Arrange:
            const wordsArray = new Array(wordsArrayLength).fill('word');
            const props = {
                seed: wordsArray.join(' '),
            };

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            const result = component.showCopyButton;
            const buttonCopyToClipboard = wrapper.find('buttoncopytoclipboard-stub');
            const buttonPaste = wrapper.find('.paste');

            // Assert:
            expect(result).toBe(expectations.showCopyButton);
            expect(buttonCopyToClipboard.exists()).toBe(expectations.showCopyButton);
            expect(buttonPaste.exists()).toBe(expectations.showPasteButton);
        };

        test('show copy button when length of words is 24', () => {
            // Arrange:
            const wordsArrayLength = 24;
            const expectations = {
                showCopyButton: true,
                showPasteButton: false,
            };

            // Act + Assert:
            runShowCopyButtonTest(wordsArrayLength, expectations);
        });

        test('show paste button when length of words is less than 24', () => {
            // Arrange:
            const wordsArrayLength = 3;
            const expectations = {
                showCopyButton: false,
                showPasteButton: true,
            };

            // Act + Assert:
            runShowCopyButtonTest(wordsArrayLength, expectations);
        });
    });

    describe('addWord()', () => {
        const runAddWordTest = (inputWordLength: number, wordsArrayLength: number, expectedWordToBeAdded: boolean) => {
            // Arrange:
            const inputWord = new Array(inputWordLength).fill('a').join('');
            const wordsArray = new Array(wordsArrayLength).fill('word');
            const props = {
                seed: wordsArray.join(' '),
            };
            const mockInitInput = jest.fn();
            const mockHandleWordsArray = jest.fn();

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component.initInput = mockInitInput;
            component.handleWordsArray = mockHandleWordsArray;
            component.inputWord = inputWord;
            component.addWord();

            // Assert:
            if (expectedWordToBeAdded) {
                expect(mockInitInput).toBeCalled();
                expect(mockHandleWordsArray).toBeCalledWith(inputWord);
                expect(component.inputWord).toBe('');
            } else {
                expect(mockInitInput).not.toBeCalled();
                expect(mockHandleWordsArray).not.toBeCalled();
                expect(component.inputWord).toBe(inputWord);
            }
        };

        test('not add word when input word length is less than 2', () => {
            // Arrange:
            const inputWordLength = 1;
            const wordsArrayLength = 1;
            const expectedWordToBeAdded = false;

            // Act + Assert:
            runAddWordTest(inputWordLength, wordsArrayLength, expectedWordToBeAdded);
        });

        test('not add word when input word length is less than 51', () => {
            // Arrange:
            const inputWordLength = 51;
            const wordsArrayLength = 1;
            const expectedWordToBeAdded = false;

            // Act + Assert:
            runAddWordTest(inputWordLength, wordsArrayLength, expectedWordToBeAdded);
        });

        test('not add word when words array length is more than 23', () => {
            // Arrange:
            const inputWordLength = 12;
            const wordsArrayLength = 24;
            const expectedWordToBeAdded = false;

            // Act + Assert:
            runAddWordTest(inputWordLength, wordsArrayLength, expectedWordToBeAdded);
        });

        test('add word when input word length is [2, 50] and words array length is less than 24', () => {
            // Arrange:
            const inputWordLength = 23;
            const wordsArrayLength = 23;
            const expectedWordToBeAdded = true;

            // Act + Assert:
            runAddWordTest(inputWordLength, wordsArrayLength, expectedWordToBeAdded);
        });
    });

    describe('deleteWord()', () => {
        const runAddWordTest = (
            inputWord: string,
            isEditing: boolean,
            isNeedPressDelTwice: boolean,
            expectations: {
                finalIsNeedPressDelTwice: boolean;
                wordToBeDeleted: boolean;
            },
        ) => {
            // Arrange:
            const props = {
                seed: 'word',
            };
            const mockInitInput = jest.fn();
            const mockHandleWordsArray = jest.fn();

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component.initInput = mockInitInput;
            component.handleWordsArray = mockHandleWordsArray;
            component.inputWord = inputWord;
            component.isEditing = isEditing;
            component.isNeedPressDelTwice = isNeedPressDelTwice;
            component.deleteWord();

            // Assert:
            if (expectations.wordToBeDeleted) {
                expect(mockInitInput).toBeCalled();
                expect(mockHandleWordsArray).toBeCalledWith();
            } else {
                expect(mockInitInput).not.toBeCalled();
                expect(mockHandleWordsArray).not.toBeCalled();
            }
            expect(component.isNeedPressDelTwice).toBe(expectations.finalIsNeedPressDelTwice);
        };

        test('not delete word when inputWord is not empty', () => {
            // Arrange:
            const inputWord = 'word';
            const isEditing = false;
            const isNeedPressDelTwice = false;
            const expectations = {
                finalIsNeedPressDelTwice: true,
                wordToBeDeleted: false,
            };

            // Act + Assert:
            runAddWordTest(inputWord, isEditing, isNeedPressDelTwice, expectations);
        });

        test('not delete word when isNeedPressDelTwice is true', () => {
            // Arrange:
            const inputWord = '';
            const isEditing = true;
            const isNeedPressDelTwice = true;
            const expectations = {
                finalIsNeedPressDelTwice: false,
                wordToBeDeleted: false,
            };

            // Act + Assert:
            runAddWordTest(inputWord, isEditing, isNeedPressDelTwice, expectations);
        });

        test('delete word when inputWord is empty', () => {
            // Arrange:
            const inputWord = '';
            const isEditing = false;
            const isNeedPressDelTwice = false;
            const expectations = {
                finalIsNeedPressDelTwice: false,
                wordToBeDeleted: true,
            };

            // Act + Assert:
            runAddWordTest(inputWord, isEditing, isNeedPressDelTwice, expectations);
        });

        test('delete word when inputWord is empty and isEditing is true', () => {
            // Arrange:
            const inputWord = '';
            const isEditing = true;
            const isNeedPressDelTwice = false;
            const expectations = {
                finalIsNeedPressDelTwice: false,
                wordToBeDeleted: true,
            };

            // Act + Assert:
            runAddWordTest(inputWord, isEditing, isNeedPressDelTwice, expectations);
        });
    });

    describe('handleWordsArray()', () => {
        const runHandleWordsArrayTest = (item: string, expectedWordsArray: string[]) => {
            // Arrange:
            const wordsArray = new Array(2).fill('word');
            const props = {
                seed: wordsArray.join(' '),
            };

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component.handleWordsArray(item);

            // Assert:
            expect(component.wordsArray).toStrictEqual(expectedWordsArray);
            expect(wrapper.emitted('handle-words')).toBeTruthy();
            expect(wrapper.emitted('handle-words')[0]).toStrictEqual([expectedWordsArray]);
        };

        test('add word to wordsArray when it is provided as argument', () => {
            // Arrange:
            const item = 'AnotherWord';
            const expectedWordsArray = ['word', 'word', 'anotherword'];

            // Act + Assert:
            runHandleWordsArrayTest(item, expectedWordsArray);
        });

        test('remove last word from wordsArray when argument is missing', () => {
            // Arrange:
            const item = null;
            const expectedWordsArray = ['word'];

            // Act + Assert:
            runHandleWordsArrayTest(item, expectedWordsArray);
        });
    });

    describe('handlePaste()', () => {
        test('set seed from clipboard event', () => {
            // Arrange:
            const expectedClipboardData = 'clipboard data';
            const props = {
                seed: '',
            };
            const mockHandleSeed = jest.fn();
            const clipboardEvent = {
                clipboardData: {
                    getData: () => ({
                        toString: () => expectedClipboardData,
                    }),
                },
            };

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component['handleSeed'] = mockHandleSeed;
            component.handlePaste(clipboardEvent as any);

            // Assert:
            expect(mockHandleSeed).toBeCalledWith(expectedClipboardData);
        });
    });

    describe('handleClickPaste()', () => {
        test('set seed from navigator clipboard', async () => {
            // Arrange:
            const expectedClipboardData = 'clipboard data';
            const props = {
                seed: '',
            };
            const mockHandleSeed = jest.fn();
            (window as any).__defineGetter__('navigator', () => ({
                clipboard: {
                    readText: () => Promise.resolve(expectedClipboardData),
                },
            }));

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component['handleSeed'] = mockHandleSeed;
            await component.handleClickPaste();

            // Assert:
            expect(mockHandleSeed).toBeCalledWith(expectedClipboardData);
        });
    });

    describe('handleSeed()', () => {
        const runHandleSeedTest = (seed: string, wordsArrayLength: number, expectedHandleWordsArrayCalls: string[][]) => {
            // Arrange:
            const wordsArray = new Array(wordsArrayLength).fill('word');
            const props = {
                seed: wordsArray.join(' '),
            };
            const mockHandleWordsArray = jest.fn();

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component.wordsArray = wordsArray;
            component.handleWordsArray = mockHandleWordsArray;
            component['handleSeed'](seed);

            // Assert:
            expect(mockHandleWordsArray).toBeCalledTimes(expectedHandleWordsArrayCalls.length);
            expect(mockHandleWordsArray.mock.calls).toEqual(expectedHandleWordsArrayCalls);
        };

        test('not add words when seed is an empty string', () => {
            // Arrange:
            const seed = '';
            const wordsArrayLength = 1;
            const expectedWordToBeAdded = [];

            // Act + Assert:
            runHandleSeedTest(seed, wordsArrayLength, expectedWordToBeAdded);
        });

        test('not add words when wordsArray length is more than 23', () => {
            // Arrange:
            const seed = 'lorem ipsum dolor sit';
            const wordsArrayLength = 24;
            const expectedWordToBeAdded = [];

            // Act + Assert:
            runHandleSeedTest(seed, wordsArrayLength, expectedWordToBeAdded);
        });

        test('add words from seed when wordsArray length is less than 24', () => {
            // Arrange:
            const seed = 'lorem ipsum dolor sit';
            const wordsArrayLength = 2;
            const expectedWordToBeAdded = [['lorem'], ['ipsum'], ['dolor'], ['sit']];

            // Act + Assert:
            runHandleSeedTest(seed, wordsArrayLength, expectedWordToBeAdded);
        });
    });

    describe('initInput()', () => {
        test('initialize isNeedPressDelTwice and isEditing', () => {
            // Arrange:
            const props = {
                seed: '',
            };
            const isNeedPressDelTwice = false;
            const isEditing = true;
            const expectedFinalIsNeedPressDelTwice = true;
            const expectedFinalIsEditing = false;

            // Act:
            const wrapper = getMnemonicInputWrapper(props);
            const component = wrapper.vm as MnemonicInputTs;
            component.isNeedPressDelTwice = isNeedPressDelTwice;
            component.isEditing = isEditing;
            component.initInput();

            // Assert:
            expect(component.isNeedPressDelTwice).toBe(expectedFinalIsNeedPressDelTwice);
            expect(component.isEditing).toBe(expectedFinalIsEditing);
        });
    });
});
