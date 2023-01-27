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
import TableDisplay from '@/components/TableDisplay/TableDisplay.vue';
import { TableDisplayTs } from '@/components/TableDisplay/TableDisplayTs';
import { getComponent } from '@MOCKS/Components';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { simpleWallet1, simpleWallet2 } from '@MOCKS/Accounts';
import { mockMosaicRowValue, mosaicsMock } from '@MOCKS/mosaics';
import { mockNamespaceRowValue, createMockNamespace } from '@MOCKS/namespaces';
import { mockMetadatas } from '@MOCKS/metadatas';
import { Signer } from '@/store/Account';
import { Address, NamespaceId, MosaicId } from 'symbol-sdk';
import ModalMetadataDisplay from '@/views/modals/ModalMetadataDisplay/ModalMetadataDisplay.vue';
import ModalMetadataUpdate from '@/views/modals/ModalMetadataUpdate/ModalMetadataUpdate.vue';

describe('components/TableDisplay', () => {
    const getTableRowWrapper = (state = {}, prop = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { networkConfiguration: undefined, currentHeight: 0 },
            getters: {
                networkConfiguration: () =>
                    Object.assign(new NetworkConfigurationModel(), {
                        epochAdjustment: 1637848847,
                        blockGenerationTargetTime: 30,
                        namespaceGracePeriodDuration: 86400,
                    }),
                currentHeight: (state) => {
                    return state.currentHeight;
                },
            },
        };

        const mockMosaicStore = {
            namespaced: true,
            state: { holdMosaics: [], isFetchingMosaics: false },
            getters: {
                holdMosaics: (state) => {
                    return state.holdMosaics;
                },
                isFetchingMosaics: (state) => {
                    return state.isFetchingMosaics;
                },
            },
        };

        const mockNamespaceStore = {
            namespaced: true,
            state: { ownedNamespaces: [], isFetchingNamespaces: false, currentConfirmedPage: { pageNumber: 1, isLastPage: false } },
            getters: {
                ownedNamespaces: (state) => {
                    return state.ownedNamespaces;
                },
                isFetchingNamespaces: (state) => {
                    return state.isFetchingNamespaces;
                },
                currentConfirmedPage: (state) => {
                    return state.currentConfirmedPage;
                },
            },
        };

        const mockMetadataStore = {
            namespaced: true,
            state: { accountMetadataList: [], isFetchingMetadata: false },
            getters: {
                accountMetadataList: (state) => {
                    return state.accountMetadataList;
                },
                isFetchingMetadata: (state) => {
                    return state.isFetchingMetadata;
                },
            },
        };

        const mockAccountStore = {
            namespaced: true,
            state: { currentAccountSigner: null, currentSigner: null },
            getters: {
                currentAccountSigner: (state) => {
                    return state.currentAccountSigner;
                },
                currentSigner: (state) => {
                    return state.currentSigner;
                },
            },
        };

        const mockAccountSigner = {
            label: '',
            address: simpleWallet1.address,
            multisig: false,
            requiredCosigApproval: 0,
        } as Signer;

        const mocks = {
            $route: {
                path: [],
            },
        };

        return getComponent(
            TableDisplay,
            {
                network: mockNetworkStore,
                mosaic: mockMosaicStore,
                namespace: mockNamespaceStore,
                metadata: mockMetadataStore,
                account: mockAccountStore,
            },
            {
                currentSigner: mockAccountSigner,
                currentAccountSigner: mockAccountSigner,
                ...state,
            },
            prop,
            {},
            undefined,
            mocks,
        );
    };

    describe('isLoading', () => {
        const runBasicIsLoadingStatusTests = (assetType, fetchStatus) => {
            test(`returns false fetching ${assetType} status when asset type is ${assetType}`, () => {
                // Arrange:
                const wrapper = getTableRowWrapper(
                    {},
                    {
                        assetType,
                    },
                );
                const vm = wrapper.vm as TableDisplayTs;

                // Act + Assert:
                expect(vm.isLoading).toBe(false);
            });

            test(`returns true fetching ${assetType} status when asset type is ${assetType}`, () => {
                // Arrange:
                const wrapper = getTableRowWrapper(
                    {
                        [fetchStatus]: true,
                    },
                    {
                        assetType,
                    },
                );

                const vm = wrapper.vm as TableDisplayTs;

                // Act + Assert:
                expect(vm.isLoading).toBe(true);
            });
        };

        // Arrange:
        const dataTests = [
            { assetType: 'namespace', fetchStatus: 'isFetchingNamespaces' },
            { assetType: 'metadata', fetchStatus: 'isFetchingMetadata' },
            { assetType: 'mosaic', fetchStatus: 'isFetchingMosaics' },
        ];

        dataTests.forEach((test) => runBasicIsLoadingStatusTests(test.assetType, test.fetchStatus));
    });

    describe('onSignerSelectorChange', () => {
        const runBasicOnSignerSelectorChangeTests = (address, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            // @ts-ignore - this is a protected method
            vm.onSignerSelectorChange(address);

            // Assert:
            if (expectedResult) {
                expect(vm.$store.dispatch).toBeCalledWith('account/SET_CURRENT_SIGNER', {
                    address: Address.createFromRawAddress(address),
                    reset: true,
                    unsubscribeWS: false,
                });
            } else {
                expect(vm.$store.dispatch).not.toBeCalledWith('account/SET_CURRENT_SIGNER');
            }
        };

        test("store dispatches 'account/SET_CURRENT_SIGNER' when provided address", () => {
            runBasicOnSignerSelectorChangeTests(simpleWallet1.address.plain(), true);
        });

        test("store does not dispatch 'account/SET_CURRENT_SIGNER' when address not provided", () => {
            runBasicOnSignerSelectorChangeTests(undefined, false);
        });
    });

    describe('ownedAssetHexIds', () => {
        const runBasicOwnedAssetHexIdsTests = (assetType, expectedResult) => {
            // Arrange:
            const commonMosaicProperties = {
                metadataList: [],
                transferable: true,
                supplyMutable: false,
                restrictable: false,
                revokable: false,
                duration: 0,
                height: 258924,
                supply: 50,
                divisibility: 0,
            };

            const mockMosaics = [
                {
                    addressRawPlain: simpleWallet1.address.plain(),
                    ownerRawPlain: simpleWallet1.address.plain(),
                    mosaicIdHex: '75E00B2F9BDAA7EE',
                    ...commonMosaicProperties,
                },
                {
                    addressRawPlain: simpleWallet1.address.plain(),
                    ownerRawPlain: simpleWallet1.address.plain(),
                    mosaicIdHex: '49DB04D43E714646',
                    ...commonMosaicProperties,
                },
                {
                    addressRawPlain: simpleWallet1.address.plain(),
                    ownerRawPlain: simpleWallet2.address.plain(),
                    mosaicIdHex: '331E8FFA6EE27BC3',
                    ...commonMosaicProperties,
                },
            ];

            const mockOwnedNamespaces = [
                {
                    namespaceIdHex: '80DE90A24D6C0CC4',
                    name: 'helloworld',
                    isRoot: true,
                    aliasType: 0,
                    ownerAddressRawPlain: simpleWallet1.address.plain(),
                    startHeight: 1,
                    endHeight: 100,
                    depth: 1,
                    metadataList: [],
                },
            ];

            const wrapper = getTableRowWrapper(
                {
                    ownedNamespaces: mockOwnedNamespaces,
                    holdMosaics: mockMosaics,
                },
                {
                    assetType,
                },
            );

            const vm = wrapper.vm as TableDisplayTs;

            // Act + Assert:
            // @ts-ignore - this is a protected method
            expect(vm.ownedAssetHexIds).toEqual(expectedResult);
        };

        test('returns owned namespace hex id when assert type is namespace', () => {
            runBasicOwnedAssetHexIdsTests('namespace', ['80DE90A24D6C0CC4']);
        });

        test('returns owned mosaic hex id when assert type is mosaic', () => {
            runBasicOwnedAssetHexIdsTests('mosaic', ['75E00B2F9BDAA7EE', '49DB04D43E714646']);
        });
    });

    describe('tableFields', () => {
        const runBasicTableFieldsTests = (assetType, expectedResult) => {
            test(`returns name and label for ${assetType} table header when asset type is ${assetType}`, () => {
                // Arrange:
                const wrapper = getTableRowWrapper(
                    {},
                    {
                        assetType,
                    },
                );

                const vm = wrapper.vm as TableDisplayTs;

                // Act + Assert:
                expect(vm.tableFields).toEqual(expectedResult);
            });
        };

        // Arrange:
        const tables = [
            {
                assetType: 'mosaic',
                expectedResult: [
                    { name: 'hexId', label: 'table_header_hex_id' },
                    { name: 'name', label: 'table_header_name' },
                    { name: 'supply', label: 'table_header_supply' },
                    { name: 'balance', label: 'table_header_balance' },
                    { name: 'expiration', label: 'table_header_expiration' },
                    { name: 'divisibility', label: 'table_header_divisibility' },
                    { name: 'transferable', label: 'table_header_transferable' },
                    { name: 'supplyMutable', label: 'table_header_supply_mutable' },
                    { name: 'restrictable', label: 'table_header_restrictable' },
                    { name: 'revokable', label: 'table_header_revokable' },
                ],
            },
            {
                assetType: 'namespace',
                expectedResult: [
                    { name: 'hexId', label: 'table_header_hex_id' },
                    { name: 'name', label: 'table_header_name' },
                    { name: 'expiration', label: 'table_header_expiration' },
                    { name: 'expired', label: 'table_header_expired' },
                    { name: 'aliasType', label: 'table_header_alias_type' },
                    { name: 'aliasIdentifier', label: 'table_header_alias_identifier' },
                ],
            },
            {
                assetType: 'metadata',
                expectedResult: [
                    { name: 'targetAddress', label: 'table_header_target_address' },
                    { name: 'targetID', label: 'table_header_target_id' },
                    { name: 'targetType', label: 'table_header_target_type' },
                    { name: 'scopedMetadataKey', label: 'table_header_scoped_key' },
                    { name: 'status', label: 'table_header_status' },
                    { name: 'changeTimes', label: 'table_header_change_times' },
                ],
            },
        ];

        tables.forEach(({ assetType, expectedResult }) => runBasicTableFieldsTests(assetType, expectedResult));
    });

    describe('tableRows', () => {
        const runBasicTableRowsTests = (assetType, state, expectedResult) => {
            test(`returns ${assetType} row value when asset type is ${assetType}`, () => {
                // Arrange:
                const wrapper = getTableRowWrapper(
                    {
                        ...state,
                    },
                    {
                        assetType,
                    },
                );

                const vm = wrapper.vm as TableDisplayTs;

                // Act + Assert:
                // @ts-ignore - this is a private method
                expect(vm.tableRows).toEqual(expectedResult);
            });
        };

        // Arrange:
        const rows = [
            {
                assetType: 'mosaic',
                state: { holdMosaics: mosaicsMock.slice(0, 2) },
                expectedResult: [
                    {
                        balance: 15,
                        divisibility: 6,
                        expiration: 'unlimited',
                        hexId: '519FC24B9223E0B4',
                        metadataList: [],
                        name: 'symbol.xym',
                        restrictable: false,
                        revokable: false,
                        supply: '7,841,148,552.567058',
                        supplyMutable: false,
                        transferable: true,
                    },
                    {
                        balance: 0,
                        divisibility: 0,
                        expiration: 'unlimited',
                        hexId: '2C56C7D764F17B09',
                        metadataList: [],
                        name: 'N/A',
                        restrictable: true,
                        revokable: true,
                        supply: '500,000,000',
                        supplyMutable: true,
                        transferable: true,
                    },
                ],
            },
            {
                assetType: 'namespace',
                state: {
                    ownedNamespaces: [
                        createMockNamespace('helloworld', 0, undefined, 611920, 621920),
                        createMockNamespace('city.access', 1, '632B3D23282A51E8', 611920, 621920),
                        createMockNamespace('symbolcity', 2, 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI', 611920, 621920),
                    ],
                    currentHeight: 612920,
                },
                expectedResult: [
                    {
                        hexId: '80DE90A24D6C0CC4',
                        name: 'helloworld',
                        expiration: '2 d 3 h 0 m ',
                        expired: false,
                        aliasType: 'N/A',
                        aliasIdentifier: 'N/A',
                        metadataList: [],
                    },
                    {
                        hexId: '80DE90A24D6C0CC4',
                        name: 'city.access',
                        expiration: '2 d 3 h 0 m ',
                        expired: false,
                        aliasType: 'mosaic',
                        aliasIdentifier: '632B3D23282A51E8',
                        metadataList: [],
                    },
                    {
                        hexId: '80DE90A24D6C0CC4',
                        name: 'symbolcity',
                        expiration: '2 d 3 h 0 m ',
                        expired: false,
                        aliasType: 'address',
                        aliasIdentifier: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
                        metadataList: [],
                    },
                ],
            },
            {
                assetType: 'metadata',
                state: { accountMetadataList: mockMetadatas },
                expectedResult: [
                    {
                        hexId: '62FC80CAE173875059E7274E',
                        scopedMetadataKey: 'E3E5E7B070607991',
                        targetAddress: 'TBF43DIZI62PR2W6JQBJR3AI6OZLRXJYMGHLTFI',
                        targetId: '80DE90A24D6C0CC4',
                        value: 'metadata',
                    },
                    {
                        hexId: '6303F2DC6CF8F07F3107CEB9',
                        scopedMetadataKey: 'B660AB4DEF66DFFA',
                        targetAddress: 'TBF43DIZI62PR2W6JQBJR3AI6OZLRXJYMGHLTFI',
                        targetId: '4151C48416E93B75',
                        value: 'metadata',
                    },
                ],
            },
        ];

        rows.forEach(({ assetType, state, expectedResult }) => runBasicTableRowsTests(assetType, state, expectedResult));
    });

    describe('displayedValues', () => {
        const runBasicExpirationFilteredTests = (assetType, params, expectedDefaultResult, expectedExpiredResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                { ...params },
                {
                    assetType,
                },
            );

            const vm = wrapper.vm as TableDisplayTs;

            test(`returns only unexpired ${assetType} when filter expiration is hide`, () => {
                // Act + Assert:
                expect(vm.displayedValues).toEqual(expectedDefaultResult);
            });

            test(`returns expired ${assetType} when filter expiration is show`, () => {
                // Arrange:
                vm.$set(vm, 'filteredBy', {
                    fieldName: 'expiration',
                    filteringType: 'show',
                });

                // Act + Assert:
                expect(vm.displayedValues).toEqual(expectedExpiredResult);
            });
        };

        describe('mosaicAssetType', () => {
            // Arrange:
            const mockMosaics = [
                {
                    addressRawPlain: 'TAD5BAHLOIXCRRB6GU2H72HPXMBBVAEUQRYPHBY',
                    ownerRawPlain: 'TAWJ2M7BGKWGBPOUGD5NDKHYDDQ7OQD26HJMMQQ',
                    name: 'symbol.xym',
                    isCurrencyMosaic: true,
                    balance: 15000000,
                    mosaicIdHex: '519FC24B9223E0B4',
                    divisibility: 6,
                    transferable: true,
                    supplyMutable: false,
                    restrictable: false,
                    revokable: false,
                    duration: 0,
                    height: 1,
                    supply: 7841148552567058,
                },
                {
                    addressRawPlain: 'TAD5BAHLOIXCRRB6GU2H72HPXMBBVAEUQRYPHBY',
                    ownerRawPlain: 'TAWJ2M7BGKWGBPOUGD5NDKHYDDQ7OQD26HJMMQQ',
                    name: 'root-name-space',
                    isCurrencyMosaic: false,
                    balance: 0,
                    mosaicIdHex: '534CD11F6D984B4B',
                    divisibility: 5,
                    transferable: true,
                    supplyMutable: false,
                    restrictable: false,
                    revokable: false,
                    duration: 1000,
                    height: 82104,
                    supply: 500000000,
                },
            ];

            const expectedResult = [
                {
                    balance: 0,
                    divisibility: 5,
                    expiration: 'expired',
                    hexId: '534CD11F6D984B4B',
                    metadataList: [],
                    name: 'root-name-space',
                    restrictable: false,
                    revokable: false,
                    supply: '5,000.00000',
                    supplyMutable: false,
                    transferable: true,
                },
                {
                    balance: 15,
                    divisibility: 6,
                    expiration: 'unlimited',
                    hexId: '519FC24B9223E0B4',
                    metadataList: [],
                    name: 'symbol.xym',
                    restrictable: false,
                    revokable: false,
                    supply: '7,841,148,552.567058',
                    supplyMutable: false,
                    transferable: true,
                },
            ];

            runBasicExpirationFilteredTests(
                'mosaic',
                { holdMosaics: mockMosaics, currentHeight: 84104 },
                [expectedResult[1]],
                expectedResult,
            );
        });

        describe('namespaceAssetType', () => {
            // Arrange:
            const mockNamespaces = [
                createMockNamespace('helloworld', 0, undefined, 611920, 612920),
                createMockNamespace('city.access', 1, '632B3D23282A51E8', 611920, 621920),
            ];

            const expectedResult = [
                {
                    aliasIdentifier: 'N/A',
                    aliasType: 'N/A',
                    expiration: '- 8 h 20 m ',
                    expired: true,
                    hexId: '80DE90A24D6C0CC4',
                    metadataList: [],
                    name: 'helloworld',
                },
                {
                    aliasIdentifier: '632B3D23282A51E8',
                    aliasType: 'mosaic',
                    expiration: '1 d 18 h 40 m ',
                    expired: false,
                    hexId: '80DE90A24D6C0CC4',
                    metadataList: [],
                    name: 'city.access',
                },
            ];

            runBasicExpirationFilteredTests(
                'namespace',
                { ownedNamespaces: mockNamespaces, currentHeight: 613920 },
                [expectedResult[1]],
                expectedResult,
            );
        });

        describe('metadataAssetType', () => {
            test('returns default metadata when asset type is metadata', () => {
                // Arrange:
                const wrapper = getTableRowWrapper(
                    { accountMetadataList: mockMetadatas },
                    {
                        assetType: 'metadata',
                    },
                );

                const vm = wrapper.vm as TableDisplayTs;

                // Act + Assert:
                expect(vm.displayedValues).toEqual([
                    {
                        hexId: '6303F2DC6CF8F07F3107CEB9',
                        scopedMetadataKey: 'B660AB4DEF66DFFA',
                        targetAddress: 'TBF43DIZI62PR2W6JQBJR3AI6OZLRXJYMGHLTFI',
                        targetId: '4151C48416E93B75',
                        value: 'metadata',
                    },
                    {
                        hexId: '62FC80CAE173875059E7274E',
                        scopedMetadataKey: 'E3E5E7B070607991',
                        targetAddress: 'TBF43DIZI62PR2W6JQBJR3AI6OZLRXJYMGHLTFI',
                        targetId: '80DE90A24D6C0CC4',
                        value: 'metadata',
                    },
                ]);
            });
        });
    });

    describe('showExpired', () => {
        const runBasicCheckBoxShowExpiredTests = (isCheck) => {
            test(`returns ${isCheck} when set showExpired to ${isCheck}`, () => {
                // Arrange:
                const wrapper = getTableRowWrapper({}, {});

                const vm = wrapper.vm as TableDisplayTs;

                vm.showExpired = isCheck;

                // Act + Assert:
                // @ts-ignore - this is a protected method
                expect(vm.showExpired).toBe(isCheck);
            });
        };

        [true, false].forEach((checkStatus) => runBasicCheckBoxShowExpiredTests(checkStatus));
    });

    describe('aliasModalTitle', () => {
        const runBasicAliasModalTitle = (aliasAction, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper({}, {});

            const vm = wrapper.vm as TableDisplayTs;

            vm.$set(vm, 'modalFormsProps', {
                aliasAction,
            });

            // Act + Assert:
            // @ts-ignore - this is a protected method
            expect(vm.aliasModalTitle).toBe(expectedResult);
        };

        test('returns link title when alias action is link', () => {
            runBasicAliasModalTitle(1, 'modal_title_link_alias');
        });

        test('returns unlink title when alias action is unlink', () => {
            runBasicAliasModalTitle(0, 'modal_title_unlink_alias');
        });
    });

    describe('refresh', () => {
        const runBasicRefreshAssetTests = async (assetType, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {},
                {
                    assetType,
                },
            );

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            // @ts-ignore - this is a protected method
            await vm.refresh();

            // Assert:
            expect(vm.$store.dispatch).toHaveBeenCalledWith('metadata/LOAD_METADATA_LIST');
            expect(vm.$store.dispatch).toHaveBeenCalledWith(expectedResult);
        };

        test("store dispatch 'mosaic/LOAD_MOSAICS' when asset type is mosaic", async () => {
            await runBasicRefreshAssetTests('mosaic', 'mosaic/LOAD_MOSAICS');
        });

        test("store dispatch 'namespace/LOAD_NAMESPACES' when asset type is namespace", async () => {
            await runBasicRefreshAssetTests('namespace', 'namespace/LOAD_NAMESPACES');
        });
    });

    describe('setDefaultFiltering', () => {
        test('set default filtered status', () => {
            // Arrange:
            const wrapper = getTableRowWrapper({}, {});

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            vm.setDefaultFiltering();

            // Assert:
            expect(vm.filteredBy).toEqual({
                fieldName: 'expiration',
                filteringType: 'hide',
            });
        });
    });

    describe('setDefaultSorting', () => {
        const runBasicSetDefaultSortingTests = (assetType, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {},
                {
                    assetType,
                },
            );

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            vm.setDefaultSorting();

            // Assert:
            expect(vm.sortedBy).toEqual({
                fieldName: expectedResult,
                direction: 'desc',
            });
        };

        const runBasicSetSortedByTests = (fromDirection, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            const fieldName = 'name';

            vm.$set(vm, 'sortedBy', {
                fieldName: fieldName,
                direction: fromDirection,
            });

            // Act:
            vm.setSortedBy(fieldName);

            // Assert:
            expect(vm.sortedBy).toEqual({
                fieldName: fieldName,
                direction: expectedResult,
            });
        };

        test('set default sorting filed to name when asset type is namespace', () => {
            runBasicSetDefaultSortingTests('namespace', 'name');
        });

        test('set default sorting filed to hexId when asset type is mosaic', () => {
            runBasicSetDefaultSortingTests('mosaic', 'hexId');
        });

        test('switch sorting direction from desc to asc when provided field name', () => {
            runBasicSetSortedByTests('desc', 'asc');
        });

        test('switch sorting direction from asc to desc when provided field name', () => {
            runBasicSetSortedByTests('asc', 'desc');
        });

        test('remain sorting direction when field name is different from current name', () => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            vm.$set(vm, 'sortedBy', {
                fieldName: 'name',
                direction: 'asc',
            });

            // Act:
            vm.setSortedBy('hexId');

            // Assert:
            expect(vm.sortedBy).toEqual({
                fieldName: 'hexId',
                direction: 'asc',
            });
        });
    });

    describe('pagination', () => {
        describe('currentPageRows', () => {
            const createWrapper = (paginationType) => {
                const wrapper = getTableRowWrapper(
                    { holdMosaics: mosaicsMock.slice(0, 3) },
                    {
                        assetType: 'mosaic',
                        paginationType,
                    },
                );

                return wrapper.vm as TableDisplayTs;
            };

            const expectedRows = [
                {
                    balance: 0,
                    divisibility: 5,
                    expiration: '31 d 23 h 32 m ',
                    hexId: '534CD11F6D984B4B',
                    metadataList: [],
                    name: 'root-name-space',
                    restrictable: false,
                    revokable: false,
                    supply: '5,000.00000',
                    supplyMutable: false,
                    transferable: true,
                },
                {
                    balance: 15,
                    divisibility: 6,
                    expiration: 'unlimited',
                    hexId: '519FC24B9223E0B4',
                    metadataList: [],
                    name: 'symbol.xym',
                    restrictable: false,
                    revokable: false,
                    supply: '7,841,148,552.567058',
                    supplyMutable: false,
                    transferable: true,
                },
                {
                    balance: 0,
                    divisibility: 0,
                    expiration: 'unlimited',
                    hexId: '2C56C7D764F17B09',
                    metadataList: [],
                    name: 'N/A',
                    restrictable: true,
                    revokable: true,
                    supply: '500,000,000',
                    supplyMutable: true,
                    transferable: true,
                },
            ];

            test('returns first page rows when pagination type is pagination', () => {
                // Arrange:
                const wrapper = createWrapper('pagination');

                wrapper.$set(wrapper, 'currentPage', 1);
                wrapper.$set(wrapper, 'pageSize', 2);

                // Act + Assert:
                expect(wrapper.currentPageRows).toEqual([expectedRows[0], expectedRows[1]]);
            });

            test('returns second page rows when pagination type is pagination', () => {
                // Arrange:
                const wrapper = createWrapper('pagination');

                wrapper.$set(wrapper, 'currentPage', 2);
                wrapper.$set(wrapper, 'pageSize', 2);

                // Act + Assert:
                expect(wrapper.currentPageRows).toEqual([expectedRows[2]]);
            });

            test('returns full rows when pagination type is scroll', () => {
                // Arrange:
                const wrapper = createWrapper('scroll');

                // Act + Assert:
                expect(wrapper.currentPageRows).toEqual(expectedRows);
            });
        });

        describe('handlePageChange', () => {
            test('set current page when provided page number', () => {
                // Arrange:
                const wrapper = getTableRowWrapper();

                const vm = wrapper.vm as TableDisplayTs;

                // Act:
                vm.handlePageChange(10);

                // Assert:
                expect(vm.currentPage).toEqual(10);
            });
        });
    });

    describe('showAliasForm', () => {
        const runBasicShowAliasForm = (assetType, params, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {},
                {
                    assetType,
                },
            );

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            // @ts-ignore - this is a protected method
            vm.showAliasForm({
                ...params,
            });

            // Assert:
            // @ts-ignore - this is a protected property
            expect(vm.modalFormsProps).toEqual(expectedResult);
            // @ts-ignore - this is a protected property
            expect(vm.modalFormsVisibility.aliasTransaction).toBe(true);
        };

        describe('assetType Mosaic', () => {
            test('returns model form props when name is N/A', () => {
                runBasicShowAliasForm(
                    'mosaic',
                    { ...mockMosaicRowValue, name: 'N/A' },
                    {
                        namespaceId: null,
                        aliasTarget: new MosaicId(mockMosaicRowValue.hexId),
                        aliasAction: 1,
                        mosaicId: null,
                    },
                );
            });

            test('returns model form props when name is available', () => {
                runBasicShowAliasForm(
                    'mosaic',
                    { ...mockMosaicRowValue, name: 'hello' },
                    {
                        namespaceId: new NamespaceId('hello'),
                        aliasTarget: new MosaicId(mockMosaicRowValue.hexId),
                        aliasAction: 0,
                        mosaicId: null,
                    },
                );
            });
        });

        describe('assetType Namespace', () => {
            test('returns model form props when alias identifier is N/A', () => {
                runBasicShowAliasForm(
                    'namespace',
                    {
                        ...mockNamespaceRowValue,
                        aliasIdentifier: 'N/A',
                    },
                    {
                        namespaceId: new NamespaceId(mockNamespaceRowValue.name),
                        aliasTarget: null,
                        aliasAction: 1,
                        mosaicId: null,
                    },
                );
            });

            test('returns model form props when alias identifier is mosaic', () => {
                // Arrange:
                const alias = {
                    aliasType: 'mosaic',
                    aliasIdentifier: '103165893CD08625',
                };

                runBasicShowAliasForm(
                    'namespace',
                    {
                        ...mockNamespaceRowValue,
                        ...alias,
                    },
                    {
                        namespaceId: new NamespaceId(mockNamespaceRowValue.name),
                        aliasTarget: new MosaicId(alias.aliasIdentifier),
                        aliasAction: 0,
                        mosaicId: null,
                    },
                );
            });

            test('returns model form props when alias identifier is address', () => {
                // Arrange:
                const alias = {
                    aliasType: 'address',
                    aliasIdentifier: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
                };

                runBasicShowAliasForm(
                    'namespace',
                    {
                        ...mockNamespaceRowValue,
                        ...alias,
                    },
                    {
                        namespaceId: new NamespaceId(mockNamespaceRowValue.name),
                        aliasTarget: Address.createFromRawAddress(alias.aliasIdentifier),
                        aliasAction: 0,
                        mosaicId: null,
                    },
                );
            });

            test('returns model form props when alias identifier is undefined', () => {
                // Arrange:
                const alias = {
                    aliasType: 'metadata',
                    aliasIdentifier: undefined,
                };

                runBasicShowAliasForm(
                    'namespace',
                    {
                        ...mockNamespaceRowValue,
                        ...alias,
                    },
                    {
                        namespaceId: new NamespaceId(mockNamespaceRowValue.name),
                        aliasTarget: null,
                        aliasAction: 0,
                        mosaicId: null,
                    },
                );
            });
        });
    });

    describe('modelForm', () => {
        describe('showExtendNamespaceDurationForm', () => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            const mockNamespace = 'hello';

            test('open model for extend namespace duration form', async () => {
                // Act:
                // @ts-ignore - this is a protected method
                vm.showExtendNamespaceDurationForm({
                    name: mockNamespace,
                });

                await vm.$nextTick();

                // Assert:
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsProps.namespaceId).toEqual(new NamespaceId(mockNamespace));
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsVisibility.extendNamespaceDurationTransaction).toBe(true);
                expect(wrapper.findComponent({ name: 'ModalFormWrap' }).attributes().title).toBe('modal_title_extend_namespace_duration');
            });

            test('close model for extend namespace duration form', async () => {
                // Arrange:
                // @ts-ignore - this is a protected method
                vm.showExtendNamespaceDurationForm({
                    name: mockNamespace,
                });

                // Act:
                // @ts-ignore - this is a protected method
                vm.closeModal('extendNamespaceDurationTransaction');

                await vm.$nextTick();
                // Assert:
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsVisibility.extendNamespaceDurationTransaction).toBe(false);
                expect(wrapper.findComponent({ name: 'ModalFormWrap' }).exists()).toBe(false);
            });
        });

        describe('showModifyMosaicSupplyForm', () => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            const mockHexId = '103165893CD08625';

            test('open model for mosaic supply form', async () => {
                // Act:
                // @ts-ignore - this is a protected method
                vm.showModifyMosaicSupplyForm({
                    hexId: mockHexId,
                });

                await vm.$nextTick();

                // Assert:
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsProps.mosaicId).toEqual(new MosaicId('103165893CD08625'));
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsVisibility.mosaicSupplyChangeTransaction).toBe(true);
                expect(wrapper.findComponent({ name: 'ModalFormWrap' }).attributes().title).toBe('modal_title_mosaic_supply_change');
            });

            test('close model for mosaic supply form', async () => {
                // Arrange:
                // @ts-ignore - this is a protected method
                vm.showModifyMosaicSupplyForm({
                    hexId: mockHexId,
                });

                // Act:
                // @ts-ignore - this is a protected method
                vm.closeModal('mosaicSupplyChangeTransaction');

                await vm.$nextTick();

                // Assert:
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsProps.mosaicId).toEqual(new MosaicId('103165893CD08625'));
                // @ts-ignore - this is a protected method
                expect(vm.modalFormsVisibility.mosaicSupplyChangeTransaction).toBe(false);
                expect(wrapper.findComponent({ name: 'ModalFormWrap' }).exists()).toBe(false);
            });
        });

        describe('MetadataValueModel', () => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            const mockMetadataValues = [
                {
                    metadataId: '62FC80CAE173875059E7274E',
                    metadataType: 2,
                    scopedMetadataKey: 'E3E5E7B070607991',
                    sourceAddress: simpleWallet1.address.plain(),
                    targetAddress: simpleWallet1.address.plain(),
                    targetId: '80DE90A24D6C0CC4',
                    value: 'metadata',
                },
            ];

            const runBasicMetadataValueModelTests = async (expectedResult) => {
                // Act:
                // @ts-ignore - this is a protected method
                vm.showMetadataValue(mockMetadataValues);

                if (!expectedResult) {
                    // Act:
                    // @ts-ignore - this is a protected method
                    vm.closeModal('targetedMetadataValue');
                }

                await vm.$nextTick();

                // Assert:
                // @ts-ignore - this is a protected method
                const formValue = vm.modalFormsVisibility.targetedMetadataValue;
                const formComponent = wrapper.findComponent(ModalMetadataDisplay).exists();

                // @ts-ignore - this is a protected method
                expect(vm.targetedMetadataList).toEqual(mockMetadataValues);
                expect(formValue).toBe(expectedResult);
                expect(formComponent).toBe(expectedResult);
            };

            const runBasicUpdateMetadataValueModelTests = async (expectedResult) => {
                // Act:
                // @ts-ignore - this is a protected method
                vm.showModalUpdateMetadata(mockMetadataValues);

                if (!expectedResult) {
                    // Act:
                    // @ts-ignore - this is a protected method
                    vm.closeModal('targetValue');
                }

                await vm.$nextTick();

                // Assert:
                // @ts-ignore - this is a protected method
                const formValue = vm.modalFormsVisibility.targetValue;
                const formComponent = wrapper.findComponent(ModalMetadataUpdate).exists();

                // @ts-ignore - this is a protected method
                expect(vm.targetedMetadataList).toEqual(mockMetadataValues);
                expect(formValue).toBe(expectedResult);
                expect(formComponent).toBe(expectedResult);
            };

            test('open model for metadata value form', async () => {
                await runBasicMetadataValueModelTests(true);
            });

            test('close model for metadata value form', async () => {
                await runBasicMetadataValueModelTests(false);
            });

            test('open model for update metadata value', async () => {
                await runBasicUpdateMetadataValueModelTests(true);
            });

            test('close model for update metadata value', async () => {
                await runBasicUpdateMetadataValueModelTests(false);
            });
        });
    });

    describe('loadMore', () => {
        const runBasicLoadMoreTests = async (assetType, isLastPage, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {
                    currentConfirmedPage: { pageNumber: 1, isLastPage },
                },
                {
                    assetType,
                },
            );

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            vm.loadMore();

            // Assert:
            if (expectedResult) {
                expect(vm.$store.dispatch).toBeCalledWith('namespace/LOAD_NAMESPACES', {
                    pageNumber: 2,
                    pageSize: 10,
                });
            } else {
                expect(vm.$store.dispatch).not.toBeCalledWith('namespace/LOAD_NAMESPACES');
            }
        };

        test('store does not dispatch "namespace/LOAD_NAMESPACES" when current page is last page', () => {
            runBasicLoadMoreTests('namespace', true, false);
        });

        test('store does not dispatch "namespace/LOAD_NAMESPACES" when asset type is mosaic and current page is not last page', () => {
            runBasicLoadMoreTests('mosaic', false, false);
        });

        test('store dispatches "namespace/LOAD_NAMESPACES" when asset type is namespace and current page is not last page', () => {
            runBasicLoadMoreTests('namespace', false, true);
        });
    });

    describe('onRefresh', () => {
        const runBasicRefreshingTests = async (mockStatus, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper();

            const vm = wrapper.vm as TableDisplayTs;

            vm.$set(vm, 'isRefreshing', mockStatus);

            // @ts-ignore - this is a private method
            jest.spyOn(vm, 'refresh');

            // Act:
            // @ts-ignore - this is a protected method
            await vm.onRefresh();

            // Assert:
            if (expectedResult) {
                // @ts-ignore - this is a private method
                expect(vm.refresh).toHaveBeenCalledWith();
                expect(vm.isRefreshing).toBe(false);
            } else {
                // @ts-ignore - this is a private method
                expect(vm.refresh).not.toHaveBeenCalledWith();
                expect(vm.isRefreshing).toBe(true);
            }
        };

        test('called refresh when isRefreshing status is false', async () => {
            await runBasicRefreshingTests(false, true);
        });

        test('skip refresh when isRefreshing in progress', async () => {
            await runBasicRefreshingTests(true, false);
        });
    });

    describe('watchRefresh', () => {
        const runWatchRefreshTests = (pageInfo, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper();
            const vm = wrapper.vm as TableDisplayTs;

            vm.currentPage = 4;

            // Act:
            vm.watchRefresh(pageInfo);

            // Assert:
            expect(vm.currentPage).toBe(expectedResult);
        };

        test('reset page info when page number in first page', () => {
            runWatchRefreshTests({ pageNumber: 1, isLastPage: false }, 1);
        });

        test('ignore reset page info when page number is not first page', () => {
            runWatchRefreshTests({ pageNumber: 3, isLastPage: false }, 4);
        });
    });

    describe('infiniteScrollDisabled', () => {
        const runBasicInfiniteScrollDisabledTest = (wrapper, expectedResult) => {
            // Arrange:
            const vm = wrapper.vm as TableDisplayTs;

            // Act + Assert:
            // @ts-ignore
            expect(vm.infiniteScrollDisabled).toBe(expectedResult);
        };

        test('returns true when paginationType is pagination', () => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {
                    isFetchingMosaics: false,
                },
                { paginationType: 'pagination' },
            );

            runBasicInfiniteScrollDisabledTest(wrapper, true);
        });

        test('returns true when paginationType is pagination with isLoading is true', () => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {
                    isFetchingMosaics: true,
                },
                { paginationType: 'pagination' },
            );

            runBasicInfiniteScrollDisabledTest(wrapper, true);
        });

        test('returns true when paginationType is scroll', () => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {
                    isFetchingMosaics: true,
                },
                { paginationType: 'scroll' },
            );

            runBasicInfiniteScrollDisabledTest(wrapper, true);
        });

        test('returns false when paginationType is scroll', () => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {
                    isFetchingMosaics: false,
                },
                { paginationType: 'scroll' },
            );

            runBasicInfiniteScrollDisabledTest(wrapper, false);
        });
    });

    describe('isFetchingMore', () => {
        const runBasicIsFetchingMoreTests = (isLoading, pageNumber, expectedResult) => {
            // Arrange:
            const wrapper = getTableRowWrapper(
                {
                    isFetchingMosaics: isLoading,
                    currentConfirmedPage: {
                        pageNumber,
                        isLastPage: false,
                    },
                },
                {},
            );

            const vm = wrapper.vm as TableDisplayTs;

            // Act:
            // @ts-ignore - this is a protected method
            const result = vm.isFetchingMore;

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('returns true when isLoading is true and page number greater than 1', () => {
            runBasicIsFetchingMoreTests(true, 2, true);
        });

        test('returns false when isLoading is false and page number less than 1', () => {
            runBasicIsFetchingMoreTests(false, 0, false);
        });

        test('returns false when isLoading is true and page number less than 1', () => {
            runBasicIsFetchingMoreTests(true, 0, false);
        });

        test('returns false when isLoading is false and page number greater than 1', () => {
            runBasicIsFetchingMoreTests(false, 2, false);
        });
    });
});
