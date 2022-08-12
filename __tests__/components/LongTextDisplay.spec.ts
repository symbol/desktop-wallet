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
import LongTextDisplay from '@/components/LongTextDisplay/LongTextDisplay.vue';
import LongTextDisplayTs from '@/components/LongTextDisplay/LongTextDisplayTs';
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof LongTextDisplayTs>['$props'];

describe('components/LongTextDisplay', () => {
    const getLongTextDisplayWrapper = (props: Props) => {
        return getComponent(LongTextDisplay, {}, {}, props);
    };

    const runGettersTest = (props: Props, getterName: string, expectedValue: any) => {
        // Act:
        const wrapper = getLongTextDisplayWrapper(props);
        const component = wrapper.vm as LongTextDisplayTs;
        const value = component[getterName];

        // Assert:
        expect(value).toBe(expectedValue);
    };

    describe('lastCharsCount', () => {
        test('rightPartSize is less than text length', () => {
            const props = {
                rightPartSize: 2,
                text: '123',
            };
            const getterName = 'lastCharsCount';
            const expectedValue = 2;

            // Act + Assert:
            runGettersTest(props, getterName, expectedValue);
        });

        test('rightPartSize is greater than text length', () => {
            const props = {
                rightPartSize: 3,
                text: '12',
            };
            const getterName = 'lastCharsCount';
            const expectedValue = 2;

            // Act + Assert:
            runGettersTest(props, getterName, expectedValue);
        });
    });

    describe('leftPart', () => {
        test('rightPartSize is less than text length', () => {
            const props = {
                rightPartSize: 2,
                text: '123456789',
            };
            const getterName = 'leftPart';
            const expectedValue = '1234567';

            // Act + Assert:
            runGettersTest(props, getterName, expectedValue);
        });

        test('rightPartSize is greater than text length', () => {
            const props = {
                rightPartSize: 10,
                text: '123456789',
            };
            const getterName = 'leftPart';
            const expectedValue = '';

            // Act + Assert:
            runGettersTest(props, getterName, expectedValue);
        });
    });

    describe('rightPart', () => {
        test('rightPartSize is less than text length', () => {
            const props = {
                rightPartSize: 2,
                text: '123456789',
            };
            const getterName = 'rightPart';
            const expectedValue = '89';

            // Act + Assert:
            runGettersTest(props, getterName, expectedValue);
        });

        test('rightPartSize is greater than text length', () => {
            const props = {
                rightPartSize: 10,
                text: '123456789',
            };
            const getterName = 'rightPart';
            const expectedValue = '123456789';

            // Act + Assert:
            runGettersTest(props, getterName, expectedValue);
        });
    });

    test('render component', async () => {
        // Arrange:
        const props = {
            rightPartSize: 2,
            text: '123456789',
            popTipTitle: 'This is title',
            popTipWidth: 20,
        };
        const expectedPoptipContent = '123456789';
        const expectedPoptipTitle = 'This is title';
        const expectedPoptipWidth = '20';
        const expectedLeftPart = '1234567';
        const expectedRightPart = '89';

        // Act:
        const wrapper = getLongTextDisplayWrapper(props);
        const poptip = wrapper.find('poptip');
        const poptipContent = poptip.attributes('content');
        const poptipTitle = poptip.attributes('title');
        const poptipWidth = poptip.attributes('width');
        const leftPart = poptip.element.firstChild.textContent;
        const rightPart = poptip.element.lastChild.textContent;

        // Assert:
        expect(poptipContent).toBe(expectedPoptipContent);
        expect(poptipTitle).toBe(expectedPoptipTitle);
        expect(poptipWidth).toBe(expectedPoptipWidth);
        expect(leftPart).toBe(expectedLeftPart);
        expect(rightPart).toBe(expectedRightPart);
    });
});
