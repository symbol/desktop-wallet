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
import SpinnerLoading from '@/components/SpinnerLoading/SpinnerLoading.vue';
import { getComponent } from '@MOCKS/Components';
import { Spin } from 'view-design';

describe('components/SpinnerLoading', () => {
    const getSpinnerLoadingWrapper = (state = {}) => {
        const mockAppStore = {
            namespaced: true,
            state: { loadingOverlayMessage: '', loadingDisableCloseButton: false },
            getters: {
                loadingOverlayMessage: (state) => state.loadingOverlayMessage,
                loadingDisableCloseButton: (state) => state.loadingDisableCloseButton,
            },
        };

        return getComponent(
            SpinnerLoading,
            {
                app: mockAppStore,
            },
            {
                ...state,
            },
            {},
            {},
            undefined,
            {
                $Spin: Spin,
            },
        );
    };

    describe('closeScreen', () => {
        test('store dispatches "app/SET_LOADING_OVERLAY" when provided close screen', () => {
            // Arrange:
            const wrapper = getSpinnerLoadingWrapper();

            // Act:
            // @ts-ignore
            wrapper.vm.closeScreen();

            // Assert:
            expect(wrapper.vm.$store.dispatch).toBeCalledWith('app/SET_LOADING_OVERLAY', {
                show: false,
                message: '',
            });
        });
    });
});
