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
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
import { getComponent } from '@MOCKS/Components';
import { TransactionFees } from 'symbol-sdk';

interface Props {
    value: number;
    hideSubmit?: boolean;
    disableSubmit?: boolean;
    calculatedRecommendedFee?: number;
    showWarnings?: boolean;
    submitButtonText?: string;
    submitButtonClasses?: string;
    size?: number;
}

describe('components/MaxFeeAndSubmit', () => {
    const transactionFees = new TransactionFees(10, 10, 20, 5, 1);
    const mockNetworkStore = {
        namespaced: true,
        state: { transactionFees },
        getters: {
            transactionFees: (state) => {
                return state.transactionFees;
            },
        },
    };

    const getMaxFeeAndSubmitWrapper = (props: Props) => {
        return getComponent(MaxFeeAndSubmit, { network: mockNetworkStore }, {}, props);
    };

    describe('show warning when maxFee is lower than recomended', () => {
        const runWarningsTest = (props: Props, isWarningExpected) => {
            // Act:
            const wrapper = getMaxFeeAndSubmitWrapper(props);
            const component = wrapper.vm as any;

            // Assert:
            expect(component.anyWarnings).toBe(isWarningExpected);
        };

        test('maxFee is greater than recomended', () => {
            // Arrange:
            const props = {
                value: 12,
                calculatedRecommendedFee: 10,
            };
            const isWarningExpected = false;

            // Act + Assert:
            runWarningsTest(props, isWarningExpected);
        });

        test('maxFee is equal to recomended', () => {
            // Arrange:
            const props = {
                value: 10,
                calculatedRecommendedFee: 10,
            };
            const isWarningExpected = false;

            // Act + Assert:
            runWarningsTest(props, isWarningExpected);
        });

        test('maxFee is lower than recomended', () => {
            // Arrange:
            const props = {
                value: 7,
                calculatedRecommendedFee: 8,
            };
            const isWarningExpected = true;

            // Act + Assert:
            runWarningsTest(props, isWarningExpected);
        });
    });

    describe('emit an event when value is changed', () => {
        const runValueChangeTest = (selectorEventToEmit, expectedEventToBeEmmited) => {
            // Arrange:
            const props = {
                value: 10,
                calculatedRecommendedFee: 10,
            };
            const maxFeeToChange = 20;

            // Act:
            const wrapper = getMaxFeeAndSubmitWrapper(props);
            wrapper.findComponent(MaxFeeSelector).vm.$emit(selectorEventToEmit, maxFeeToChange);

            // Assert:
            expect(wrapper.emitted()[expectedEventToBeEmmited][0]).toEqual([maxFeeToChange]);
        };

        test('value is selected', () => {
            // Arrange:
            const selectorEventToEmit = 'value';
            const expectedEventToBeEmmited = 'selected-fee';

            // Act + Assert:
            runValueChangeTest(selectorEventToEmit, expectedEventToBeEmmited);
        });

        test('value is inputted', () => {
            // Arrange:
            const selectorEventToEmit = 'input';
            const expectedEventToBeEmmited = 'input';

            // Act + Assert:
            runValueChangeTest(selectorEventToEmit, expectedEventToBeEmmited);
        });
    });

    describe('calculated fees', () => {
        const runCalculatedFeesTest = (getterName, expectedValue) => {
            // Arrange:
            const props = {
                value: 10,
                size: 12,
            };

            // Act:
            const wrapper = getMaxFeeAndSubmitWrapper(props);
            const result = wrapper.vm[getterName];

            // Assert:
            expect(result).toEqual(expectedValue);
        };

        test('average fee', () => {
            // Arrange:
            const getterName = 'averageFee';
            const expectedValue = 90;

            // Act + Assert:
            runCalculatedFeesTest(getterName, expectedValue);
        });

        test('slow fee', () => {
            // Arrange:
            const getterName = 'slowFee';
            const expectedValue = 54;

            // Act + Assert:
            runCalculatedFeesTest(getterName, expectedValue);
        });

        test('slowest fee', () => {
            // Arrange:
            const getterName = 'slowestFee';
            const expectedValue = 12;

            // Act + Assert:
            runCalculatedFeesTest(getterName, expectedValue);
        });

        test('fast fee', () => {
            // Arrange:
            const getterName = 'fastFee';
            const expectedValue = 120;

            // Act + Assert:
            runCalculatedFeesTest(getterName, expectedValue);
        });
    });
});
