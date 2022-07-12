/*
 * (C) Symbol Contributors 2021
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
import AccountMetadataDisplay from '@/components/AccountMetadataDisplay/AccountMetadataDisplay.vue';
import { AccountMetadataDisplayTs } from '@/components/AccountMetadataDisplay/AccountMetadataDisplayTs';
import { MetadataModel } from '@/core/database/entities/MetadataModel';
import { getComponent } from '@MOCKS/Components';
import { MetadataType } from 'symbol-sdk';

describe('components/AccountMetadataDisplay', () => {
    const getAccountMetadataDisplayWrapper = (metadataList: MetadataModel[], visible: boolean) => {
        // Arrange:
        const wrapper = getComponent(
            AccountMetadataDisplay,
            {},
            {},
            {
                metadataList,
                visible,
            },
        );
        return wrapper;
    };

    test('renders dropdown with empty option list when metadata list is empty', () => {
        // Arrange:
        const metadataList = [];

        // Act:
        const wrapper = getAccountMetadataDisplayWrapper(metadataList, true);
        const component = wrapper.vm as AccountMetadataDisplayTs;

        // Assert:
        expect(wrapper.find('select option').exists()).toBeFalsy();
        expect(component.chosenValue).toBeFalsy();
    });

    test('renders dropdown when visible is true', () => {
        // Arrange:
        const value = 'someValue';
        const metadataList = [
            {
                metadataId: 'meta',
                sourceAddress: '',
                targetAddress: '',
                metadataType: MetadataType.Account,
                value,
                scopedMetadataKey: 'key',
            },
        ];

        // Act:
        const wrapper = getAccountMetadataDisplayWrapper(metadataList, true);
        const component = wrapper.vm as AccountMetadataDisplayTs;

        // Assert:
        expect(wrapper.find('select')).toBeDefined();
        expect(wrapper.find('select option').attributes('value')).toBe(metadataList[0].metadataId);
        expect(wrapper.find('select option').text()).toBe(`${metadataList[0].scopedMetadataKey} : ${metadataList[0].value}`);
        expect(component.chosenValue).toBe(metadataList[0].metadataId);
    });

    test('dropdown is not rendered when visible is false', () => {
        // Arrange:
        const value = 'someValue';
        const metadataList = [
            {
                metadataId: 'meta',
                sourceAddress: '',
                targetAddress: '',
                metadataType: MetadataType.Account,
                value,
                scopedMetadataKey: 'key',
            },
        ];

        // Act:
        const wrapper = getAccountMetadataDisplayWrapper(metadataList, false);

        // Assert:
        expect(wrapper.find('select option').exists()).toBeFalsy();
    });

    const testDetailButtonEmitsEventOnClick = async (buttonIndex: number, eventName) => {
        // Arrange:
        const value = 'someValue';
        const metadataList = [
            {
                metadataId: 'meta',
                sourceAddress: '',
                targetAddress: '',
                metadataType: MetadataType.Account,
                value,
                scopedMetadataKey: 'key',
            },
        ];

        // Act:
        const wrapper = getAccountMetadataDisplayWrapper(metadataList, true);
        await wrapper.findAll('img').at(buttonIndex).trigger('click');

        // Assert:
        expect(wrapper.emitted(eventName)).toBeDefined();
    };

    test('metadata view detail button emits event on click', async () => {
        testDetailButtonEmitsEventOnClick(0, 'on-view-metadata');
    });

    test('metadata edit detail button emits event on click', async () => {
        testDetailButtonEmitsEventOnClick(1, 'on-edit-metadata');
    });
});
