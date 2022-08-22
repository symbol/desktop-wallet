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
import ApprovalAndRemovalInput from '@/components/ApprovalAndRemovalInput/ApprovalAndRemovalInput.vue';
import { ApprovalAndRemovalInputTs } from '@/components/ApprovalAndRemovalInput/ApprovalAndRemovalInputTs';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { getComponent } from '@MOCKS/Components';
import { MultisigAccountInfo } from 'symbol-sdk';

describe('components/ApprovalAndRemovalInput', () => {
    const networkConfiguration = { maxCosignatoriesPerAccount: 25 } as NetworkConfigurationModel;
    const mockNetworkStore = {
        namespaced: true,
        state: { networkConfiguration },
        getters: {
            networkConfiguration: (state) => {
                return state.networkConfiguration;
            },
        },
    };

    const getApprovalAndRemovalInputWrapper = (
        value?: number,
        operation?: 'conversion' | 'modification',
        type?: 'approval' | 'removal',
        multisig?: MultisigAccountInfo,
    ) => {
        const wrapper = getComponent(
            ApprovalAndRemovalInput,
            { network: mockNetworkStore },
            {},
            {
                value,
                operation,
                type,
                multisig,
            },
        );
        return wrapper;
    };

    test('renders component', () => {
        // Arrange + Act:
        const wrapper = getApprovalAndRemovalInputWrapper();

        // Assert:
        expect(wrapper.find('select')).toBeDefined();
    });

    const deltaOptions = (minDelta: number, currentValue: number) => {
        return [...Array(networkConfiguration.maxCosignatoriesPerAccount).keys()].map((index: number) => {
            const delta = minDelta + index;
            const newValue = currentValue + delta;
            return { value: delta, newDelta: newValue };
        });
    };
    test('values when conversion', () => {
        // Arrange:
        const minDelta = 1;
        const expectedDeltaArray = deltaOptions(minDelta, 0);

        // Act:
        const wrapper = getApprovalAndRemovalInputWrapper(0, 'conversion', 'approval', undefined);
        const component = wrapper.vm as ApprovalAndRemovalInputTs;

        // Assert:
        // @ts-ignore - test protected getter
        expect(component.label).toBe('form_label_new_min_approval');
        // @ts-ignore - test protected getter
        expect(component.description).toBe('form_label_description_min_approval');
        // @ts-ignore - test protected getter
        expect(component.currentValue).toBe(0);
        // @ts-ignore - test protected getter
        expect(component.deltaOptions).toStrictEqual(expectedDeltaArray);
    });

    test('emit input when chosen value is set', () => {
        // Arrange + Act:
        const wrapper = getApprovalAndRemovalInputWrapper(0, 'conversion', 'approval', undefined);
        const component = wrapper.vm as ApprovalAndRemovalInputTs;
        // @ts-ignore - protected getter
        component.chosenValue = 2;

        // Assert:
        // @ts-ignore - test protected getter
        expect(wrapper.emitted('input')[0][0]).toBe(2);
    });

    test('values when approval modification', () => {
        // Arrange:
        const multisig = { minApproval: 2 } as MultisigAccountInfo;
        const minDelta = -2;
        const expectedDeltaArray = deltaOptions(minDelta, multisig.minApproval);

        // Act:
        const wrapper = getApprovalAndRemovalInputWrapper(0, 'modification', 'approval', multisig);
        const component = wrapper.vm as ApprovalAndRemovalInputTs;

        // Assert:
        // @ts-ignore - test protected getter
        expect(component.label).toBe('form_label_new_min_approval');
        // @ts-ignore - test protected getter
        expect(component.description).toBe('form_label_description_min_approval');
        // @ts-ignore - test protected getter
        expect(component.currentValue).toBe(2);
        // @ts-ignore - test protected getter
        expect(component.deltaOptions).toStrictEqual(expectedDeltaArray);
    });

    test('values when removal modification', () => {
        // Arrange:
        const multisig = { minRemoval: 2 } as MultisigAccountInfo;
        const minDelta = -2;
        const expectedDeltaArray = deltaOptions(minDelta, multisig.minRemoval);

        // Act:
        const wrapper = getApprovalAndRemovalInputWrapper(0, 'modification', 'removal', multisig);
        const component = wrapper.vm as ApprovalAndRemovalInputTs;

        // Assert:
        // @ts-ignore - test protected getter
        expect(component.label).toBe('form_label_new_min_removal');
        // @ts-ignore - test protected getter
        expect(component.description).toBe('form_label_description_min_removal');
        // @ts-ignore - test protected getter
        expect(component.currentValue).toBe(2);
        // @ts-ignore - test protected getter
        expect(component.deltaOptions).toStrictEqual(expectedDeltaArray);
    });
});
