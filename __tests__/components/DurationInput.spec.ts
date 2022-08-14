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
import DurationInput from '@/components/DurationInput/DurationInput.vue';
import { DurationInputTs } from '@/components/DurationInput/DurationInputTs';
import { networkConfig } from '@/config';
import { StandardValidationRules } from '@/core/validation/StandardValidationRules';
import i18n from '@/language/index';
import { NetworkState } from '@/store/Network';
import { createLocalVue, mount } from '@vue/test-utils';
import { NetworkType } from 'symbol-sdk';
import { ValidationProvider } from 'vee-validate';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

StandardValidationRules.register();

interface DurationInputProps {
    value?: string;
    targetAsset?: 'mosaic' | 'namespace';
    label?: string;
    showRelativeTime?: boolean;
}

describe('components/DurationInput', () => {
    const networkConfiguration = { blockGenerationTargetTime: 30 };
    const mockNetworkStore = {
        namespaced: true,
        state: { networkType: undefined, networkConfiguration },
        getters: {
            networkType: (state) => state.networkType,
            networkConfiguration: (state) => state.networkConfiguration,
        },
    };
    const getDurationInputWrapper = (props?: DurationInputProps, networkStateChange?: NetworkState) => {
        const localVue = createLocalVue();
        localVue.component('ValidationProvider', ValidationProvider);
        localVue.use(Vuex);
        localVue.use(VueI18n);
        const effectiveMockNetworkStore = { ...mockNetworkStore };
        effectiveMockNetworkStore.state = { ...effectiveMockNetworkStore.state, ...networkStateChange };

        const store = new Vuex.Store({
            modules: {
                network: {
                    ...effectiveMockNetworkStore,
                },
            },
        });
        const options = {
            localVue,
            i18n,
            store,
            propsData: { ...props },
            stubs: ['Tooltip'],
        };
        const wrapper = mount(DurationInput, options);
        return wrapper;
    };

    test('renders component', () => {
        // Arrange + Act:
        const wrapper = getDurationInputWrapper();

        // Assert:
        expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    });

    test('relative time is unlimited when no value is set', () => {
        // Arrange + Act:
        const wrapper = getDurationInputWrapper({ showRelativeTime: true });

        // Assert:
        expect(wrapper.find('span.relative-time').text()).toContain(i18n.t('label_duration_unlimited'));
    });

    test('relative time is unlimited when value is zero', async () => {
        // Arrange:
        const wrapper = getDurationInputWrapper({ showRelativeTime: true, value: '0' });

        // Assert:
        expect(wrapper.find('span.relative-time').text()).toContain(i18n.t('label_duration_unlimited'));
    });

    test('relative time is presented when value is valid', async () => {
        // Arrange + Act:
        const wrapper = getDurationInputWrapper({ showRelativeTime: true, value: '10000' });

        // Assert:
        expect(wrapper.find('span.relative-time').text()).toContain('3 d 11 h 20 m');
    });

    test('emits input event when chosen value is set', async () => {
        // Arrange:
        const chosenValue = '20000';
        const wrapper = getDurationInputWrapper({ showRelativeTime: true, targetAsset: 'namespace', value: '10000' });
        const component = wrapper.vm as DurationInputTs;

        // Act:
        component.chosenValue = chosenValue;

        // Assert:
        expect(wrapper.emitted('input')[0][0]).toBe(chosenValue);
    });

    test('duration validation rule when the target asset is mosaic', async () => {
        // Arrange:
        const wrapper = getDurationInputWrapper({ targetAsset: 'mosaic', value: '10000' });
        const component = wrapper.vm as DurationInputTs;

        // Act:
        const durationValidationRule = component.validationRule;

        // Assert:
        expect(durationValidationRule).toContain(
            `max_value:${networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.maxMosaicDuration}`,
        );
    });

    test('duration validation rule when the target asset is namespace', async () => {
        // Arrange:
        const wrapper = getDurationInputWrapper({ targetAsset: 'namespace', value: '10000' });
        const component = wrapper.vm as DurationInputTs;

        // Act:
        const durationValidationRule = component.validationRule;

        // Assert:
        expect(durationValidationRule).toContain(
            `min_value:${
                networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.minNamespaceDuration /
                networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.blockGenerationTargetTime
            }`,
        );
    });

    test('effective network configuration is default given no network configuration found in the store', () => {
        // Arrange + Act:
        const wrapper = getDurationInputWrapper();
        const component = wrapper.vm as DurationInputTs;

        // Act + Assert:
        expect(component.effectiveNetworkConfiguration).toEqual(networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults);
    });

    test('effective network configuration is merge of network configuration from store and default configs', () => {
        // Arrange + Act:
        const minNamespaceDurationFromStore = 1296000;
        const minNamespaceDurationFromDefault = networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.minNamespaceDuration;
        const networkState = {
            networkConfiguration: {
                ...networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults,
                minNamespaceDuration: minNamespaceDurationFromStore,
            },
        };
        const wrapper = getDurationInputWrapper({ targetAsset: 'namespace', value: '10000' }, networkState as NetworkState);
        const component = wrapper.vm as DurationInputTs;

        // Act + Assert:
        expect(component.effectiveNetworkConfiguration.minNamespaceDuration).toEqual(minNamespaceDurationFromStore);
        expect(component.effectiveNetworkConfiguration.minNamespaceDuration).not.toEqual(minNamespaceDurationFromDefault);
    });
});
