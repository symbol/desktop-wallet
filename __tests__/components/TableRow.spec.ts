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
import TableRow from '@/components/TableRow/TableRow.vue';
import { TableRowTs } from '@/components/TableRow/TableRowTs';
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue';
import { getComponent } from '@MOCKS/Components';
import { mosaicsMock, mockMosaicRowValue } from '@MOCKS/mosaics';
import { mockNamespaceRowValue } from '@MOCKS/namespaces';

describe('components/TableRow', () => {
    const getTableRowWrapper = (prop = {}) => {
        return getComponent(TableRow, {}, {}, prop, {
            Poptip: true,
            Icon: true,
        });
    };

    describe('isNamespace', () => {
        const runBasicNamespaceTests = (rowValues, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                rowValues,
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.isNamespace).toBe(expectedResult);
            // @ts-ignore
            expect(vm.isRootNamespace).toBe(expectedResult);
        };

        test('returns true when root namespace provided', () => {
            runBasicNamespaceTests(mockNamespaceRowValue, true);
        });

        test('returns false when not namespace', () => {
            runBasicNamespaceTests(mockMosaicRowValue, false);
        });

        test('returns false when sub namespace provided', () => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                rowValues: {
                    ...mockNamespaceRowValue,
                    name: 'hello.world',
                },
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.isNamespace).toBe(true);
            // @ts-ignore
            expect(vm.isRootNamespace).toBe(false);
        });
    });

    describe('hasAvailableActions', () => {
        const runBasicHasAvailableActionsTests = (props, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                assetType: 'mosaic',
                ...props,
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.hasAvailableActions).toBe(expectedResult);
            expect(wrapper.find('.pop-tip').exists()).toBe(expectedResult);

            if (expectedResult) {
                wrapper.find('.poptip-actions').trigger('click');
                expect(wrapper.emitted('on-show-alias-form')).toBeDefined();
            } else {
                expect(wrapper.find('.poptip-actions').exists()).toBe(false);
            }
        };

        test('hide Poptip component when asset type is account restrictions', () => {
            runBasicHasAvailableActionsTests(
                {
                    assetType: 'accountRestrictions',
                    rowValues: {
                        ...mockNamespaceRowValue,
                    },
                },
                false,
            );
        });

        test('hide Poptip component when a namespace is expired', () => {
            runBasicHasAvailableActionsTests(
                {
                    rowValues: {
                        ...mockNamespaceRowValue,
                        expiration: 'expired',
                    },
                },
                false,
            );
        });

        test('hide Poptip component when an asset does not belong to the user', () => {
            runBasicHasAvailableActionsTests(
                {
                    ownedAssetHexIds: ['0'.repeat(16)],
                    rowValues: mockMosaicRowValue,
                },
                false,
            );
        });

        test('renders Poptip component when user owned asset', () => {
            runBasicHasAvailableActionsTests(
                {
                    ownedAssetHexIds: [mockMosaicRowValue.hexId, mosaicsMock[0].mosaicIdHex, mosaicsMock[1].mosaicIdHex],
                    rowValues: mockMosaicRowValue,
                },
                true,
            );
        });
    });

    describe('isSupplyMutableMosaic', () => {
        const runBasicSupplyMutableMosaic = (params, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                ownedAssetHexIds: [mockMosaicRowValue.hexId, mosaicsMock[0].mosaicIdHex, mosaicsMock[1].mosaicIdHex],
                rowValues: {
                    ...mockMosaicRowValue,
                    ...params,
                },
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.isSupplyMutableMosaic).toBe(expectedResult);
            expect(wrapper.find('.modify-supply').exists()).toBe(expectedResult);

            if (expectedResult) {
                wrapper.find('.modify-supply').trigger('click');
                expect(wrapper.emitted('on-show-mosaic-supply-change-form')).toBeDefined();
            }
        };

        test('returns true when mosaic supports supply mutable and not expired', () => {
            runBasicSupplyMutableMosaic({}, true);
        });

        test('returns false when mosaic supports supply mutable is expired', () => {
            runBasicSupplyMutableMosaic(
                {
                    expiration: 'expired',
                },
                false,
            );
        });

        test('returns false when mosaics is not support supply mutable', () => {
            runBasicSupplyMutableMosaic(
                {
                    supplyMutable: false,
                },
                false,
            );
        });
    });

    describe('hasMetadata', () => {
        const runBasicHasMetadataTests = (params, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                ownedAssetHexIds: [mockMosaicRowValue.hexId, mockNamespaceRowValue.hexId],
                rowValues: {
                    ...params,
                },
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.hasMetadata).toBe(expectedResult);
        };

        const runBasicViewEditMetadataTests = (action, componentClass, expectedEvent?) => {
            const runBasicComponentTests = (params, componentClass, expectedResult, expectedEvent?) => {
                // Arrange:
                const wrapper = getTableRowWrapper({
                    ownedAssetHexIds: [mockMosaicRowValue.hexId, mockNamespaceRowValue.hexId],
                    rowValues: {
                        ...params,
                    },
                });

                // Act + Assert:
                expect(wrapper.find(componentClass).exists()).toBe(expectedResult);

                if (expectedResult) {
                    wrapper.find(componentClass).trigger('click');
                    expect(wrapper.emitted(expectedEvent)).toBeDefined();
                }
            };

            test(`can ${action} metadata when mosaic / namespace contains metadata info`, () => {
                [mockMosaicRowValue, mockNamespaceRowValue].forEach((rowValue) => {
                    runBasicComponentTests(
                        {
                            ...rowValue,
                        },
                        componentClass,
                        true,
                        expectedEvent,
                    );
                });
            });

            test(`cannot ${action} metadata when mosaic / namespace does not contain metadata info`, () => {
                [mockMosaicRowValue, mockNamespaceRowValue].forEach((rowValue) => {
                    runBasicComponentTests(
                        {
                            ...rowValue,
                            metadataList: [],
                        },
                        componentClass,
                        false,
                    );
                });
            });

            test(`cannot ${action} metadata when mosaic / namespace metadata info is undefined`, () => {
                [mockMosaicRowValue, mockNamespaceRowValue].forEach((rowValue) => {
                    runBasicComponentTests(
                        {
                            ...rowValue,
                            metadataList: undefined,
                        },
                        componentClass,
                        false,
                    );
                });
            });
        };

        test('returns true when mosaic / namespace contains metadata info', () => {
            [mockMosaicRowValue, mockNamespaceRowValue].forEach((rowValue) => {
                runBasicHasMetadataTests(
                    {
                        ...rowValue,
                    },
                    true,
                );
            });
        });

        test('returns false when mosaic / namespace does not contain metadata info', () => {
            [mockMosaicRowValue, mockNamespaceRowValue].forEach((rowValue) => {
                runBasicHasMetadataTests(
                    {
                        ...rowValue,
                        metadataList: [],
                    },
                    false,
                );
            });
        });

        test('returns false when mosaic / namespace metadata info is undefined', () => {
            [mockMosaicRowValue, mockNamespaceRowValue].forEach((rowValue) => {
                runBasicHasMetadataTests(
                    {
                        ...rowValue,
                        metadataList: undefined,
                    },
                    false,
                );
            });
        });

        describe('viewMetadata', () => {
            runBasicViewEditMetadataTests('view', '.view-metadata', 'on-show-metadata');
        });

        describe('editMetadata', () => {
            runBasicViewEditMetadataTests('edit', '.edit-metadata', 'on-show-edit');
        });
    });

    describe('aliasActionLabel', () => {
        const runBasicAliasActionLabel = (params, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                rowValues: {
                    ...params,
                },
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.aliasActionLabel).toBe(expectedResult);
        };

        test('returns alias link when namespace value alias type is N/A', () => {
            runBasicAliasActionLabel(
                {
                    ...mockNamespaceRowValue,
                    aliasType: 'N/A',
                },
                'action_label_alias_link',
            );
        });

        test('returns alias unlink when namespace value alias type is mosaic', () => {
            runBasicAliasActionLabel(
                {
                    ...mockNamespaceRowValue,
                    aliasType: 'mosaic',
                },
                'action_label_alias_unlink',
            );
        });

        test('returns alias link when row value is mosaic and not linked with namespace', () => {
            runBasicAliasActionLabel(
                {
                    ...mockMosaicRowValue,
                    name: 'N/A',
                },
                'action_label_alias_link',
            );
        });

        test('returns alias unlink when row value is mosaic and linked with namespace', () => {
            runBasicAliasActionLabel(
                {
                    ...mockMosaicRowValue,
                    name: mockNamespaceRowValue.name,
                },
                'action_label_alias_unlink',
            );
        });
    });

    describe('visibleRowValues', () => {
        const runBasicVisibleRowValues = (params) => {
            // Arrange:
            const hiddenData = {
                value: 'value',
            };

            const wrapper = getTableRowWrapper({
                rowValues: {
                    ...params,
                    hiddenData,
                },
            });

            const vm = wrapper.vm as TableRowTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.visibleRowValues).toEqual(params);
            // @ts-ignore
            expect(vm.visibleRowValues).not.toHaveProperty('hiddenData');
        };

        test('returns mosaic value except for hiddenData property', () => {
            runBasicVisibleRowValues(mockMosaicRowValue);
        });

        test('returns namespace value except for hiddenData property', () => {
            runBasicVisibleRowValues(mockNamespaceRowValue);
        });
    });

    describe('AmountDisplay', () => {
        const runBasicRenderAmountDisplayTests = (params, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                rowValues: {
                    ...params,
                },
            });

            // Act + Assert:
            expect(wrapper.findComponent(AmountDisplay).exists()).toBe(expectedResult);
        };

        test('display amount display component when provided mosaic value', () => {
            runBasicRenderAmountDisplayTests(mockMosaicRowValue, true);
        });

        test('hidden amount display component when provided namespace value', () => {
            runBasicRenderAmountDisplayTests(mockNamespaceRowValue, false);
        });
    });
});
