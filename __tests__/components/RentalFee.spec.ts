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
import RentalFee from '@/components/RentalFees/RentalFee.vue';
import { render } from '@testing-library/vue';
import { getStore } from '@MOCKS/Store';
import i18n from '@/language/index';
import { networkMock } from '@MOCKS/network';
import { UInt64 } from 'symbol-sdk';

describe('components/RentalFee', () => {
    const renderComponent = (stateChanges = {}, props = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { rentalFeeEstimation: undefined },
            getters: {
                rentalFeeEstimation: (state) => {
                    return state.rentalFeeEstimation;
                },
            },
        };

        const mockMosaicStore = {
            namespaced: true,
            state: {
                networkCurrency: networkMock.currency,
            },
            getters: {
                networkCurrency: (state) => state.networkCurrency,
            },
        };

        const store = getStore(
            {
                network: mockNetworkStore,
                mosaic: mockMosaicStore,
            },
            stateChanges,
            undefined,
            true,
            undefined,
            false,
        );

        return {
            ...render(RentalFee, {
                store,
                i18n,
                props,
            }),
            store,
        };
    };

    const createRentalFeeEstimation = {
        rentalFeeEstimation: {
            effectiveRootNamespaceRentalFeePerBlock: UInt64.fromUint(200),
            effectiveChildNamespaceRentalFee: UInt64.fromUint(10000000),
            effectiveMosaicRentalFee: UInt64.fromUint(50000000),
        },
    };

    const runBasicEstimatedRentalFee = (stateChanges, rentalType, expectedResult) => {
        // Arrange:
        const { getByText, getByTestId } = renderComponent(stateChanges, {
            rentalType,
            duration: 100000,
        });

        // Act + Assert:
        expect(getByText('Estimated rental fee:')).toBeDefined();
        expect(getByTestId('fees').textContent).toBe(`${expectedResult}   (XYM)`);
    };

    it('renders estimated rental fee when rental fees type is mosaic', () => {
        runBasicEstimatedRentalFee(createRentalFeeEstimation, 'mosaic', '50');
    });

    it('renders estimated rental fee when rental fees type is root-namespace', () => {
        runBasicEstimatedRentalFee(createRentalFeeEstimation, 'root-namespace', '20');
    });

    it('renders estimated rental fee when rental fees type is root-namespace', () => {
        runBasicEstimatedRentalFee(createRentalFeeEstimation, 'child-namespace', '10');
    });
});
