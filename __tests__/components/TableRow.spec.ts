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
import { mosaicsMock } from '@MOCKS/mosaics';

describe('components/TableRow', () => {
    const mockMosaicValue = {
        balance: 1000,
        divisibility: 0,
        expiration: 'unlimited',
        hexId: '103165893CD08625',
        metadataList: [
            {
                metadataId: '62FC80CAE173875059E7274E',
                metadataType: 2,
                scopedMetadataKey: 'E3E5E7B070607991',
                sourceAddress: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
                targetAddress: 'TBF43DIZI62PR2W6JQBJR3AI6OZLRXJYMGHLTFI',
                targetId: '80DE90A24D6C0CC4',
                value: 'metadata',
            },
        ],
        name: 'N/A',
        restrictable: true,
        supply: '1,000',
        supplyMutable: true,
        transferable: false,
    };

    const mockNamespaceRowValue = {
        aliasIdentifier: 'N/A',
        aliasType: 'N/A',
        expiration: '29 d 23 h 58 m ',
        expired: false,
        hexId: '80DE90A24D6C0CC4',
        metadataList: [
            {
                metadataId: '62FC8624E173875059E72DE1',
                metadataType: 1,
                scopedMetadataKey: 'A14173CB00ED0041',
                sourceAddress: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
                targetAddress: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
                targetId: '7E77578D00C26DFC',
                value: 'metavalue',
            },
        ],
        name: 'helloworld',
    };

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
            runBasicNamespaceTests(mockMosaicValue, false);
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
                    rowValues: mockMosaicValue,
                },
                false,
            );
        });

        test('renders Poptip component when user owned asset', () => {
            runBasicHasAvailableActionsTests(
                {
                    ownedAssetHexIds: [mockMosaicValue.hexId, mosaicsMock[0].mosaicIdHex, mosaicsMock[1].mosaicIdHex],
                    rowValues: mockMosaicValue,
                },
                true,
            );
        });
    });

    describe('isSupplyMutableMosaic', () => {
        const runBasicSupplyMutableMosaic = (params, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({
                ownedAssetHexIds: [mockMosaicValue.hexId, mosaicsMock[0].mosaicIdHex, mosaicsMock[1].mosaicIdHex],
                rowValues: {
                    ...mockMosaicValue,
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
                ownedAssetHexIds: [mockMosaicValue.hexId, mockNamespaceRowValue.hexId],
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
                    ownedAssetHexIds: [mockMosaicValue.hexId, mockNamespaceRowValue.hexId],
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

            test(`able ${action} metadata when mosaic / namespace contains metadata info`, () => {
                [mockMosaicValue, mockNamespaceRowValue].forEach((rowValue) => {
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

            test(`unable ${action} metadata when mosaic / namespace does not contain metadata info`, () => {
                [mockMosaicValue, mockNamespaceRowValue].forEach((rowValue) => {
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

            test(`unable ${action} metadata when mosaic / namespace metadata info undefined`, () => {
                [mockMosaicValue, mockNamespaceRowValue].forEach((rowValue) => {
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
            [mockMosaicValue, mockNamespaceRowValue].forEach((rowValue) => {
                runBasicHasMetadataTests(
                    {
                        ...rowValue,
                    },
                    true,
                );
            });
        });

        test('returns false when mosaic / namespace does not contain metadata info', () => {
            [mockMosaicValue, mockNamespaceRowValue].forEach((rowValue) => {
                runBasicHasMetadataTests(
                    {
                        ...rowValue,
                        metadataList: [],
                    },
                    false,
                );
            });
        });

        test('returns false when mosaic / namespace metadata info undefined', () => {
            [mockMosaicValue, mockNamespaceRowValue].forEach((rowValue) => {
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

        test('returns alias link when row value is mosaic and not link with namespace', () => {
            runBasicAliasActionLabel(
                {
                    ...mockMosaicValue,
                    name: 'N/A',
                },
                'action_label_alias_link',
            );
        });

        test('returns alias unlink when row value is mosaic and linked with namespace', () => {
            runBasicAliasActionLabel(
                {
                    ...mockMosaicValue,
                    name: mockNamespaceRowValue.name,
                },
                'action_label_alias_unlink',
            );
        });
    });

    describe('visibleRowValues', () => {
        const runBasicVisibleRowValues = (params, expectedResult) => {
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
            runBasicVisibleRowValues(mockMosaicValue, true);
        });

        test('returns namespace value except for hiddenData property', () => {
            runBasicVisibleRowValues(mockNamespaceRowValue, false);
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
            runBasicRenderAmountDisplayTests(mockMosaicValue, true);
        });

        test('hidden amount display component when provided namespace value', () => {
            runBasicRenderAmountDisplayTests(mockNamespaceRowValue, false);
        });
    });
});
