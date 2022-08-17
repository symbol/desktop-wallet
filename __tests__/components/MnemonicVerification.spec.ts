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
import { getComponent } from '@MOCKS/Components';

type Props = InstanceType<typeof MnemonicVerificationTs>['$props'];

describe('components/MnemonicVerification', () => {
    const getMnemonicVerificationWrapper = (props: Props) => {
        return getComponent(MnemonicVerification, {}, {}, props);
    };

    describe('created()', () => {
        test('sort words ASC', async () => {
            // Arrange:
            const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
            const props = {
                words,
            };
            const expectedShuffledWords = {
                0: 'amet',
                1: 'dolor',
                2: 'ipsum',
                3: 'Lorem',
                4: 'sit',
            };
            const expectedShuffledWordsIndexes = [0, 1, 2, 3, 4];
    
            // Act:
            const wrapper = getMnemonicVerificationWrapper(props);
            const component = wrapper.vm as MnemonicVerificationTs;
            
            // Assert:
            expect(component.shuffledWords).toStrictEqual(expectedShuffledWords);
            expect(component.shuffledWordsIndexes).toStrictEqual(expectedShuffledWordsIndexes);
        });
    });
});
