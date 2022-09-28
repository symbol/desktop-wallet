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
import MnemonicVerification from '@/components/MnemonicVerification/MnemonicVerification.vue';
import { MnemonicVerificationTs } from '@/components/MnemonicVerification/MnemonicVerificationTs';
import { NotificationType } from '@/core/utils/NotificationType';
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof MnemonicVerificationTs>['$props'];

describe('components/MnemonicVerification', () => {
    const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];

    const getMnemonicVerificationWrapper = (props: Props) => {
        return getComponent(MnemonicVerification, {}, {}, props);
    };

    describe('created()', () => {
        test('sort words ASC', async () => {
            // Arrange:
            const props = {
                words,
            };

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;

            // Assert:
            const expectedShuffledWords = {
                0: 'amet',
                1: 'dolor',
                2: 'ipsum',
                3: 'Lorem',
                4: 'sit',
            };
            const expectedShuffledWordsIndexes = [0, 1, 2, 3, 4];
            expect(component.shuffledWords).toStrictEqual(expectedShuffledWords);
            expect(component.shuffledWordsIndexes).toStrictEqual(expectedShuffledWordsIndexes);
        });
    });

    describe('onWordClicked()', () => {
        const runOnWordClickedTest = (
            selectedWordIndexes: number[],
            wordIndexToSelect: number,
            expectations: {
                wordToBeAdded: boolean;
                wordToBeRemoved: boolean;
            },
        ) => {
            // Arrange:
            const props = {
                words,
            };
            const mockAddWord = jest.fn();
            const mockRemoveWord = jest.fn();

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            component.selectedWordIndexes = selectedWordIndexes;
            component.selectedWordIndexes.push = mockAddWord;
            component.removeWord = mockRemoveWord;
            component.onWordClicked(wordIndexToSelect);

            // Assert:
            if (expectations.wordToBeAdded) {
                expect(mockAddWord).toBeCalledWith(wordIndexToSelect);
                expect(mockRemoveWord).not.toBeCalled();
            }
            if (expectations.wordToBeRemoved) {
                expect(mockRemoveWord).toBeCalledWith(wordIndexToSelect);
                expect(mockAddWord).not.toBeCalled();
            }
        };

        test('add word to selectedWordIndexes when word is not added yet', () => {
            // Arrange:
            const selectedWordIndexes = [];
            const wordIndexToSelect = 1;

            // Act + Assert:
            const expectations = {
                wordToBeAdded: true,
                wordToBeRemoved: false,
            };
            runOnWordClickedTest(selectedWordIndexes, wordIndexToSelect, expectations);
        });

        test('remove word from selectedWordIndexes when word is already added', () => {
            // Arrange:
            const selectedWordIndexes = [1];
            const wordIndexToSelect = 1;

            // Act + Assert:
            const expectations = {
                wordToBeAdded: false,
                wordToBeRemoved: true,
            };
            runOnWordClickedTest(selectedWordIndexes, wordIndexToSelect, expectations);
        });
    });

    describe('removeWord()', () => {
        const runRemoveWordTest = (
            initialSelectedWordIndexes: number[],
            wordIndexToRemove: number,
            expectedSelectedWordIndexes: number[],
        ) => {
            // Arrange:
            const props = {
                words,
            };

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            component.selectedWordIndexes = initialSelectedWordIndexes;
            component.removeWord(wordIndexToRemove);

            // Assert:
            expect(component.selectedWordIndexes).toStrictEqual(expectedSelectedWordIndexes);
        };

        test('remove word from selectedWordIndexes when its index is included', () => {
            // Arrange:
            const initialSelectedWordIndexes = [1, 2, 3];
            const wordIndexToRemove = 2;

            // Act + Assert:
            const expectedSelectedWordIndexes = [1, 3];
            runRemoveWordTest(initialSelectedWordIndexes, wordIndexToRemove, expectedSelectedWordIndexes);
        });

        test('not change selectedWordIndexes when word index is not included', () => {
            // Arrange:
            const initialSelectedWordIndexes = [1, 4, 3];
            const wordIndexToRemove = 2;

            // Act + Assert:
            const expectedSelectedWordIndexes = [1, 4, 3];
            runRemoveWordTest(initialSelectedWordIndexes, wordIndexToRemove, expectedSelectedWordIndexes);
        });
    });

    describe('next()', () => {
        const runNextTest = (correctWordsAreSelectedReturnValue: boolean, expectEventToBeEmitted: boolean) => {
            // Arrange:
            const props = {
                words,
            };
            const eventName = 'success';
            const mockCorrectWordsAreSelected = jest.fn().mockReturnValue(correctWordsAreSelectedReturnValue);

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            component.correctWordsAreSelected = mockCorrectWordsAreSelected;
            component.next();
            const isEventEmitted = !!wrapper.emitted(eventName);

            // Assert:
            expect(isEventEmitted).toBe(expectEventToBeEmitted);
        };

        test('emit event when correct words are selected', () => {
            // Arrange:
            const correctWordsAreSelectedReturnValue = true;

            // Act + Assert:
            const expectEventToBeEmitted = true;
            runNextTest(correctWordsAreSelectedReturnValue, expectEventToBeEmitted);
        });

        test('not emit event when incorrect words are selected', () => {
            // Arrange:
            const correctWordsAreSelectedReturnValue = false;

            // Act + Assert:
            const expectEventToBeEmitted = false;
            runNextTest(correctWordsAreSelectedReturnValue, expectEventToBeEmitted);
        });
    });

    describe('correctWordsAreSelected()', () => {
        const runСorrectWordsAreSelectedTest = (selectedWordIndexes: number[], expectedReturnValue: boolean) => {
            // Arrange:
            const props = {
                words,
            };

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            component.selectedWordIndexes = selectedWordIndexes;
            const returnedValue = component.correctWordsAreSelected();

            // Assert:
            expect(returnedValue).toBe(expectedReturnValue);
        };

        test('return true when words match the sequence', () => {
            // Arrange:
            const selectedWordIndexes = [3, 2, 1, 4, 0];

            // Act + Assert:
            const expectedReturnValue = true;
            runСorrectWordsAreSelectedTest(selectedWordIndexes, expectedReturnValue);
        });

        test('return false when words does not match the sequence', () => {
            // Arrange:
            const selectedWordIndexes = [0, 1, 2, 3, 4];

            // Act + Assert:
            const expectedReturnValue = false;
            runСorrectWordsAreSelectedTest(selectedWordIndexes, expectedReturnValue);
        });
    });

    describe('mnemonicCheckerNotification()', () => {
        const runMnemonicCheckerNotificationTest = (
            selectedWordIndexes: number[],
            origin: string,
            rebuilt: string,
            expectations: {
                actionToBeDispatched: string[] | null;
                eventToBeEmitted: string[] | null;
                returnValue: boolean;
            },
        ) => {
            // Arrange:
            const props = {
                words,
            };
            const mockDispatch = jest.fn();
            const mockEmit = jest.fn();

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            component.$store.dispatch = mockDispatch;
            component.$emit = mockEmit;
            component.selectedWordIndexes = selectedWordIndexes;
            const returnedValue = component['mnemonicCheckerNotification'](origin, rebuilt);

            // Assert:
            expect(returnedValue).toBe(expectations.returnValue);
            if (expectations.actionToBeDispatched) {
                expect(mockDispatch).toBeCalledWith(...expectations.actionToBeDispatched);
            }
            if (expectations.eventToBeEmitted) {
                expect(mockEmit).toBeCalledWith(...expectations.eventToBeEmitted);
            }
        };

        test('return false and dispatch error notification when selected order of words does not match origin', () => {
            // Arrange:
            const selectedWordIndexes = [2];
            const origin = 'lorem ipsum dolor';
            const rebuilt = 'ipsum lorem';

            // Act + Assert:
            const expectations = {
                actionToBeDispatched: ['notification/ADD_WARNING', NotificationType.MNEMONIC_INCONSISTENCY_ERROR],
                eventToBeEmitted: ['error', NotificationType.MNEMONIC_INCONSISTENCY_ERROR],
                returnValue: false,
            };
            runMnemonicCheckerNotificationTest(selectedWordIndexes, origin, rebuilt, expectations);
        });

        test('return true when selected order of words match origin', () => {
            // Arrange:
            const selectedWordIndexes = [2];
            const origin = 'lorem ipsum dolor';
            const rebuilt = 'lorem ipsum';

            // Act + Assert:
            const expectations = {
                actionToBeDispatched: null,
                eventToBeEmitted: null,
                returnValue: true,
            };
            runMnemonicCheckerNotificationTest(selectedWordIndexes, origin, rebuilt, expectations);
        });

        test('return true and dispatch success notification when selected 24 words and order match origin', () => {
            // Arrange:
            const selectedWordIndexes = new Array(24).fill(0);
            const origin = 'lorem ipsum dolor';
            const rebuilt = 'lorem ipsum';

            // Act + Assert:
            const expectations = {
                actionToBeDispatched: ['notification/ADD_SUCCESS', NotificationType.MNEMONIC_CORRECT],
                eventToBeEmitted: null,
                returnValue: true,
            };
            runMnemonicCheckerNotificationTest(selectedWordIndexes, origin, rebuilt, expectations);
        });
    });

    describe('onSelectedMnemonicChange()', () => {
        test('call mnemonicCheckerNotification() with stringified arrays of words', () => {
            // Arrange:
            const props = {
                words,
            };
            const selectedWordIndexes = [2, 1];
            const origin = 'Lorem ipsum dolor sit amet';
            const rebuilt = 'ipsum dolor';
            const mockMnemonicCheckerNotification = jest.fn();

            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            component['mnemonicCheckerNotification'] = mockMnemonicCheckerNotification;
            component.selectedWordIndexes = selectedWordIndexes;
            component.onSelectedMnemonicChange();

            // Assert:
            const expectedArguments = [origin, rebuilt];
            expect(mockMnemonicCheckerNotification).toBeCalledWith(...expectedArguments);
        });
    });
});
