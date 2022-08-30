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
import MosaicAttachmentInput from '@/components/MosaicAttachmentInput/MosaicAttachmentInput.vue';
import { MosaicAttachmentInputTs } from '@/components/MosaicAttachmentInput/MosaicAttachmentInputTs';
import { Formatters } from '@/core/utils/Formatters';
import { getComponent } from '@MOCKS/Components';
import { mosaicsMock } from '@MOCKS/mosaics';

type Props = InstanceType<typeof MosaicAttachmentInputTs>['$props'];

describe('components/MosaicAttachmentInput', () => {
    const mockMosaicAttachment = {
        mosaicHex: '00000000',
        amount: '200',
    };

    const getMosaicAttachmentInputWrapper = (props: Props) => {
        const stubs = {
            FormRow: {
                template: '<div><slot name="label" /><slot name="inputs" /></div>',
            },
        };

        return getComponent(MosaicAttachmentInput, {}, {}, props, stubs);
    };

    test('render component', () => {
        // Arrange:
        const props = {
            mosaicAttachment: mockMosaicAttachment,
            uid: 0,
            mosaicHexIds: mosaicsMock.map((mosaic) => mosaic.mosaicIdHex),
            absolute: false,
            isShowDelete: true,
            isOffline: false,
            isFirstItem: true,
            selectedFeeValue: 10,
            isAggregate: false,
        };
        const expectedMosaicSelectorAttributes = {
            value: props.mosaicAttachment.mosaicHex,
            mosaichexids: mosaicsMock.map((mosaic) => mosaic.mosaicIdHex).join(','),
            defaultmosaic: 'networkMosaic',
        };
        const expectedAmountInputAttributes = {
            value: props.mosaicAttachment.amount,
            mosaichex: props.mosaicAttachment.mosaicHex,
            selectedfeevalue: props.selectedFeeValue.toString(),
        };

        // Act:
        const wrapper = getMosaicAttachmentInputWrapper(props);
        const mosaicSelectorElement = wrapper.find('mosaicselector-stub');
        const amountInputElement = wrapper.find('amountinput-stub');

        // Assert:
        expect(mosaicSelectorElement.attributes('value')).toBe(expectedMosaicSelectorAttributes.value);
        expect(mosaicSelectorElement.attributes('mosaichexids')).toBe(expectedMosaicSelectorAttributes.mosaichexids);
        expect(mosaicSelectorElement.attributes('defaultmosaic')).toBe(expectedMosaicSelectorAttributes.defaultmosaic);
        expect(amountInputElement.attributes('value')).toBe(expectedAmountInputAttributes.value);
        expect(amountInputElement.attributes('mosaichex')).toBe(expectedAmountInputAttributes.mosaichex);
        expect(amountInputElement.attributes('selectedfeevalue')).toBe(expectedAmountInputAttributes.selectedfeevalue);
    });

    describe('delete button', () => {
        const runRenderDeleteButtonTest = (isShowDelete, expectButtonToBeRendered) => {
            // Arrange:
            const props = {
                isShowDelete,
                mosaicAttachment: mockMosaicAttachment,
                uid: 0,
            };
            const expectedButtonStyle = expectButtonToBeRendered ? undefined : 'display: none;';

            // Act:
            const wrapper = getMosaicAttachmentInputWrapper(props);
            const deleteButtonElement = wrapper.find('.delete-mosaic-container');

            // Assert:
            expect(deleteButtonElement.attributes('style')).toBe(expectedButtonStyle);
        };

        test('render delete button when isShowDelete is positive', () => {
            // Arrange:
            const isShowDelete = true;
            const expectButtonToBeRendered = true;

            // Act + Assert:
            runRenderDeleteButtonTest(isShowDelete, expectButtonToBeRendered);
        });

        test('does not render delete button when isShowDelete is negative', () => {
            // Arrange:
            const isShowDelete = false;
            const expectButtonToBeRendered = false;

            // Act + Assert:
            runRenderDeleteButtonTest(isShowDelete, expectButtonToBeRendered);
        });

        test('emit event when click', async () => {
            // Arrange:
            const uid = 2;
            const props = {
                isShowDelete: true,
                mosaicAttachment: mockMosaicAttachment,
                uid,
            };
            const expectedEventName = 'input-deleted';
            const expectedEventPayload = [uid];

            // Act:
            const wrapper = getMosaicAttachmentInputWrapper(props);
            const deleteIconElement = wrapper.find('.delete-mosaic-icon');
            await deleteIconElement.trigger('click');

            // Assert:
            expect(wrapper.emitted(expectedEventName)[0]).toStrictEqual(expectedEventPayload);
        });
    });

    describe('input value', () => {
        const runInputValueTest = (elementSelector, valueToInput, expectedEventPayload) => {
            // Arrange:
            const props = {
                mosaicAttachment: mockMosaicAttachment,
                uid: 0,
            };

            // Act:
            const wrapper = getMosaicAttachmentInputWrapper(props);
            const element = wrapper.find(elementSelector);
            element.vm.$emit('input', valueToInput);

            // Assert:
            expect(wrapper.emitted('input-changed')[0]).toStrictEqual([expectedEventPayload]);
        };

        test('emit event when mosaic is selected', () => {
            // Arrange:
            const elementSelector = 'mosaicselector-stub';
            const valueToInput = '11111111';
            const expectedEventPayload = {
                mosaicAttachment: {
                    ...mockMosaicAttachment,
                    mosaicHex: '11111111',
                },
                inputIndex: 0,
            };

            // Act + Assert:
            runInputValueTest(elementSelector, valueToInput, expectedEventPayload);
        });

        test('emit event when amount is inputted', () => {
            // Arrange:
            const elementSelector = 'amountinput-stub';
            const valueToInput = '333';
            const expectedEventPayload = {
                mosaicAttachment: {
                    ...mockMosaicAttachment,
                    amount: '333',
                },
                inputIndex: 0,
            };

            // Act + Assert:
            runInputValueTest(elementSelector, valueToInput, expectedEventPayload);
        });
    });

    describe('formatted amount', () => {
        const runGetChosenValueTest = (languages, decimalSeparator, mosaicAttachment, expectedResult) => {
            // Arrange:
            const props = {
                mosaicAttachment,
                uid: 0,
            };
            (window as any).__defineGetter__('navigator', () => ({ languages }));
            jest.spyOn(Formatters, 'getDecimalSeparator').mockReturnValue(decimalSeparator);

            // Act:
            const wrapper = getMosaicAttachmentInputWrapper(props);
            const component = wrapper.vm as MosaicAttachmentInputTs;

            // Assert:
            expect(component.formItems.relativeAmount).toBe(expectedResult);
        };

        test('remove all commas from amount string when decimal separator is "."', () => {
            // Arrange:
            const languages = ['en-us'];
            const decimalSeparator = '.';
            const mosaicAttachment = {
                ...mockMosaicAttachment,
                amount: '123,456.78',
            };
            const expectedResult = '123456.78';

            // Act + Assert:
            runGetChosenValueTest(languages, decimalSeparator, mosaicAttachment, expectedResult);
        });

        test('does not remove commas from amount string when decimal separator is ","', () => {
            // Arrange:
            const languages = ['en-us'];
            const decimalSeparator = ',';
            const mosaicAttachment = {
                ...mockMosaicAttachment,
                amount: '123456,78',
            };
            const expectedResult = '123456,78';

            // Act + Assert:
            runGetChosenValueTest(languages, decimalSeparator, mosaicAttachment, expectedResult);
        });

        test('does not remove commas from amount string when languages property is undefined', () => {
            // Arrange:
            const languages = undefined;
            const decimalSeparator = ',';
            const mosaicAttachment = {
                ...mockMosaicAttachment,
                amount: '123,456.78',
            };
            const expectedResult = '123,456.78';

            // Act + Assert:
            runGetChosenValueTest(languages, decimalSeparator, mosaicAttachment, expectedResult);
        });

        test('set "0" when amount is not provided', () => {
            // Arrange:
            const languages = ['en-us'];
            const decimalSeparator = ',';
            const mosaicAttachment = {
                ...mockMosaicAttachment,
                amount: null,
            };
            const expectedResult = '0';

            // Act + Assert:
            runGetChosenValueTest(languages, decimalSeparator, mosaicAttachment, expectedResult);
        });

        test('set "0" when mosaicAttachment is not provided', () => {
            // Arrange:
            const languages = ['en-us'];
            const decimalSeparator = ',';
            const mosaicAttachment = null;
            const expectedResult = '0';

            // Act + Assert:
            runGetChosenValueTest(languages, decimalSeparator, mosaicAttachment, expectedResult);
        });
    });

    describe('onMosaicAttachmentChange()', () => {
        test('update relativeAmount when mosaicAttachment is changed', async () => {
            // Arrange:
            const props = {
                mosaicAttachment: mockMosaicAttachment,
                uid: 0,
            };
            const expectedRelativeAmount = '333';
            const mosaicAttachmentToChange = {
                ...mockMosaicAttachment,
                amount: expectedRelativeAmount,
            };

            // Act:
            const wrapper = getMosaicAttachmentInputWrapper(props);
            const component = wrapper.vm as MosaicAttachmentInputTs;
            await wrapper.setProps({ mosaicAttachment: mosaicAttachmentToChange });

            // Assert:
            expect(component.formItems.relativeAmount).toBe(expectedRelativeAmount);
        });
    });
});
