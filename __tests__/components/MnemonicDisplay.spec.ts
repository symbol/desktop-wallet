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
import MnemonicDisplay from '@/components/MnemonicDisplay/MnemonicDisplay.vue';
import { MnemonicDisplayTs } from '@/components/MnemonicDisplay/MnemonicDisplayTs';
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof MnemonicDisplayTs>['$props'];

describe('components/MnemonicDisplay', () => {
    const getMnemonicDisplayWrapper = (props: Props) => {
        return getComponent(MnemonicDisplay, {}, {}, props);
    };

    test('render component', async () => {
        // Arrange:
        const props = {
            words: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'],
        };

        // Act:
        const wrapper = getMnemonicDisplayWrapper(props);
        const component = wrapper.vm as MnemonicDisplayTs;
        const mnemonicContainerElement = wrapper.find('.mnemonic-list');
        const wordElements = [...mnemonicContainerElement.element.children];
        const wordsExtractedFromElements = wordElements.map((wordElement) => wordElement.textContent);
        const clipboardString = wrapper.find('buttoncopytoclipboard-stub').attributes('value');

        // Assert:
        const expectedWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        const expectedClipboardString = 'Lorem ipsum dolor sit amet';
        expect(wordsExtractedFromElements).toStrictEqual(expectedWords);
        expect(clipboardString).toBe(expectedClipboardString);
        expect(component.waitingCopyString).toBe(expectedClipboardString);
    });
});
