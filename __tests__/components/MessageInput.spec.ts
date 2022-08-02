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
import MessageInput from '@/components/MessageInput/MessageInput.vue';
import { MessageInputTs } from '@/components/MessageInput/MessageInputTs';
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof MessageInputTs>['$props'];

describe('components/MessageInput', () => {
    const StubComponent = {
        template: '<div><slot /></div>',
    };

    const getMessageInputWrapper = (props: Props) => {
        const stubs = {
            ValidationProvider: StubComponent,
            ErrorTooltip: StubComponent,
        };

        return getComponent(MessageInput, {}, {}, props, stubs);
    };

    test('render value', async () => {
        // Arrange:
        const expectedValue = 'message text';
        const props = {
            value: expectedValue,
        };

        // Act:
        const wrapper = getMessageInputWrapper(props);
        const textArea = wrapper.find('textarea');
        const textAreaElement = textArea.element as HTMLInputElement;

        // Assert:
        expect(textAreaElement.value).toBe(expectedValue);
    });

    test('emit input event', async () => {
        // Arrange:
        const props = {};
        const expectedInputText = 'new message';

        // Act:
        const wrapper = getMessageInputWrapper(props);
        const textArea = wrapper.find('textarea');
        const textAreaElement = textArea.element as HTMLInputElement;
        textAreaElement.value = expectedInputText;
        await textArea.trigger('input');

        // Assert:
        expect(wrapper.emitted()['input'][0][0]).toBe(expectedInputText);
    });
});
