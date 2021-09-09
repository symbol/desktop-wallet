/*
 * Copyright 2020 NEM (https://nem.io)
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
// external dependencies
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Address, AliasAction, MosaicId, NamespaceId } from 'symbol-sdk';
// internal dependencies
import {
    AssetTableService,
    FilteringTypes,
    SortingDirections,
    TableField,
    TableFilteringOptions,
    TableSortingOptions,
} from '@/services/AssetTableService/AssetTableService';
import { MosaicTableService } from '@/services/AssetTableService/MosaicTableService';
import { NamespaceTableService } from '@/services/AssetTableService/NamespaceTableService';
import { MetadataTableService } from '@/services/AssetTableService/MetadataTableService';
// table asset types
import { TableAssetType } from './TableAssetType';
// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue';
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd';
// @ts-ignore
import ButtonRefresh from '@/components/ButtonRefresh/ButtonRefresh';
// @ts-ignore
import ModalFormWrap from '@/views/modals/ModalFormWrap/ModalFormWrap.vue';
// @ts-ignore
import FormAliasTransaction from '@/views/forms/FormAliasTransaction/FormAliasTransaction.vue';
// @ts-ignore
import FormExtendNamespaceDurationTransaction from '@/views/forms/FormExtendNamespaceDurationTransaction/FormExtendNamespaceDurationTransaction.vue';
// @ts-ignore
import FormMosaicSupplyChangeTransaction from '@/views/forms/FormMosaicSupplyChangeTransaction/FormMosaicSupplyChangeTransaction.vue';
// @ts-ignore
import ModalMetadataDisplay from '@/views/modals/ModalMetadataDisplay/ModalMetadataDisplay.vue';
import { NamespaceModel } from '@/core/database/entities/NamespaceModel';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { Signer } from '@/store/Account';
// @ts-ignore
import SignerListFilter from '@/components/SignerListFilter/SignerListFilter.vue';
import { MetadataModel } from '@/core/database/entities/MetadataModel';
// @ts-ignore
import ModalMetadataUpdate from '@/views/modals/ModalMetadataUpdate/ModalMetadataUpdate.vue';
import { PageInfo } from '@/store/Transaction';
@Component({
    components: {
        TableRow,
        ModalFormWrap,
        FormAliasTransaction,
        FormExtendNamespaceDurationTransaction,
        FormMosaicSupplyChangeTransaction,
        ModalMetadataDisplay,
        SignerListFilter,
        ButtonAdd,
        ModalMetadataUpdate,
        ButtonRefresh,
    },
    computed: {
        ...mapGetters({
            currentHeight: 'network/currentHeight',
            holdMosaics: 'mosaic/holdMosaics',
            ownedNamespaces: 'namespace/ownedNamespaces',
            currentConfirmedPage: 'namespace/currentConfirmedPage',
            attachedMetadataList: 'metadata/accountMetadataList',
            networkConfiguration: 'network/networkConfiguration',
            currentAccountSigner: 'account/currentAccountSigner',
            currentSigner: 'account/currentSigner',
            isFetchingNamespaces: 'namespace/isFetchingNamespaces',
            isFetchingMosaics: 'mosaic/isFetchingMosaics',
            isFetchingMetadata: 'metadata/isFetchingMetadata',
        }),
    },
})
export class TableDisplayTs extends Vue {
    /**
     * Type of assets shown in the table
     * @type {string}
     */
    @Prop({
        default: TableAssetType.Mosaic,
    })
    assetType: TableAssetType;

    @Prop({ default: 'pagination' })
    public paginationType!: 'pagination' | 'scroll';

    /**
     * Current account owned mosaics
     * @protected
     * @type {MosaicModel[]}
     */
    private holdMosaics: MosaicModel[];

    /**
     * Current account owned namespaces
     * @protected
     * @type {NamespaceModel[]}
     */
    private ownedNamespaces: NamespaceModel[];

    /**
     * Current account attached metadata list
     * @protected
     * @type {MetadataModel[]}
     */
    private attachedMetadataList: MetadataModel[];

    /**
     * target mosaic or namespace metadata view
     * @type {MetadataModel[]}
     */
    protected targetedMetadataList: MetadataModel[];

    private currentHeight: number;

    private networkConfiguration: NetworkConfigurationModel;

    private currentSigner: Signer;

    /**
     * current account signer
     */
    public currentAccountSigner: Signer;

    public isFetchingNamespaces: boolean;

    public isFetchingMosaics: boolean;

    public isFetchingMetadata: boolean;

    /**
     * Current confirmed page info
     * @var {PageInfo}
     */
    public currentConfirmedPage: PageInfo;

    /**
     * Loading state of the data to be shown in the table
     * @type {boolean}
     */
    public get isLoading() {
        switch (this.assetType) {
            case TableAssetType.Namespace:
                return this.isFetchingNamespaces;
            case TableAssetType.Metadata:
                return this.isFetchingMetadata;
            default:
                return this.isFetchingMosaics;
        }
    }

    /**
     * Hook called when the signer selector has changed
     * @protected
     */
    protected onSignerSelectorChange(address: string): void {
        // clear previous account transactions
        if (address) {
            this.$store.dispatch('account/SET_CURRENT_SIGNER', {
                address: Address.createFromRawAddress(address),
                reset: true,
                unsubscribeWS: false,
            });
        }
    }

    /**
     * Current table sorting state
     * @var {TableSortingOptions}
     */
    public sortedBy: TableSortingOptions = {
        fieldName: undefined,
        direction: undefined,
    };

    /**
     * Current table filtering state
     * @var {TableFilteringOptions}
     */
    public filteredBy: TableFilteringOptions = {
        fieldName: undefined,
        filteringType: undefined,
    };

    /**
     * Pagination page size
     * @type {number}
     */
    public pageSize: number = 10;

    /**
     * Pagination page number
     * @type {number}
     */
    public currentPage: number = 1;

    public nodata = [...new Array(this.pageSize).keys()];

    protected get ownedAssetHexIds(): string[] {
        return this.assetType === 'namespace'
            ? this.ownedNamespaces.map(({ namespaceIdHex }) => namespaceIdHex)
            : this.holdMosaics
                  .filter(({ ownerRawPlain }) => ownerRawPlain === this.currentSigner.address.plain())
                  .map(({ mosaicIdHex }) => mosaicIdHex);
    }

    /**
     * Modal forms visibility states
     * @protected
     * @type {{
     *     aliasTransaction: boolean
     *     extendNamespaceDuration: boolean
     *     mosaicSupplyChangeTransaction: boolean
     *   }}
     */
    protected modalFormsVisibility: {
        aliasTransaction: boolean;
        extendNamespaceDurationTransaction: boolean;
        mosaicSupplyChangeTransaction: boolean;
    } = {
        aliasTransaction: false,
        extendNamespaceDurationTransaction: false,
        mosaicSupplyChangeTransaction: false,
    };

    /**
     * Action forms props
     * @protected
     * @type {({
     *     namespaceId: NamespaceId
     *     aliasTarget: MosaicId | Address
     *     aliasAction: AliasAction
     *     mosaicId: MosaicId
     *   })}
     */
    protected modalFormsProps: {
        namespaceId: NamespaceId;
        aliasTarget: MosaicId | Address;
        aliasAction: AliasAction;
        mosaicId: MosaicId;
    } = {
        namespaceId: null,
        aliasTarget: null,
        aliasAction: null,
        mosaicId: null,
    };

    // Alias forms props

    /**
     * Instantiate the table service around {assetType}
     * @return {AssetTableService}
     */
    protected getService(): AssetTableService {
        switch (this.assetType) {
            case TableAssetType.Mosaic:
                return new MosaicTableService(this.currentHeight, this.holdMosaics, this.networkConfiguration);

            case TableAssetType.Namespace:
                return new NamespaceTableService(this.currentHeight, this.ownedNamespaces, this.networkConfiguration, this.showExpired);

            case TableAssetType.Metadata:
                return new MetadataTableService(this.currentHeight, this.attachedMetadataList, this.networkConfiguration);

            default:
                throw new Error(`Asset type '${this.assetType}' does not exist in TableDisplay.`);
        }
    }

    /// region getters and setters
    /**
     * Non-filtered table data
     * @var {TableRowValues[]}
     */
    private get tableRows(): any[] {
        return this.getService().getTableRows();
    }

    /**
     * Values displayed in the table
     * @readonly
     * @return {TableRowValues[]}
     */
    get displayedValues(): any[] {
        return this.getService().sort(this.getService().filter(this.tableRows, this.filteredBy), this.sortedBy);
    }

    /**
     * Header fields displayed in the table
     * @readonly
     * @return {TableField[]}
     */
    get tableFields(): TableField[] {
        return this.getService().getTableFields();
    }

    /**
     * Get current page rows
     * @readonly
     * @return {TableRowValues[]}
     */
    get currentPageRows(): any[] {
        return this.paginationType === 'pagination'
            ? this.displayedValues.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            : this.displayedValues;
    }

    /**
     * getter and setter for the showExpired button
     *
     */
    get showExpired(): boolean {
        return this.filteredBy.fieldName === 'expiration' && this.filteredBy.filteringType === 'show';
    }

    set showExpired(newVal: boolean) {
        this.setFilteredBy('expiration');
    }

    /**
     * Alias form modal title
     * @type {string}
     * @protected
     */
    protected get aliasModalTitle(): string {
        return this.modalFormsProps.aliasAction === AliasAction.Link ? 'modal_title_link_alias' : 'modal_title_unlink_alias';
    }

    /// end-region getters and setters

    /**
     * Hook called when the component is created
     * @return {void}
     */
    public async created(): Promise<void> {
        // refresh owned assets
        this.refresh();
        // initialize sorting and filtering
        this.setDefaultFiltering();
        // await this.refresh()
        this.setDefaultSorting();
    }

    /**
     * Refreshes the owned assets
     * @returns {void}
     */
    private async refresh(): Promise<void> {
        switch (this.assetType) {
            case TableAssetType.Mosaic:
                await this.$store.dispatch('mosaic/LOAD_MOSAICS');
                break;

            case TableAssetType.Namespace:
                await this.$store.dispatch('namespace/LOAD_NAMESPACES');
                break;

            case TableAssetType.Metadata:
                await this.$store.dispatch('metadata/LOAD_METADATA_LIST');
                break;
        }
    }

    /**
     * Sets the default filtering state
     */
    public setDefaultFiltering(): void {
        const defaultFilteringType: FilteringTypes = 'hide';
        const defaultFilteringFieldName: string = 'expiration';

        Vue.set(this, 'filteredBy', {
            fieldName: defaultFilteringFieldName,
            filteringType: defaultFilteringType,
        });
    }

    /**
     * Sets the default sorting state and trigger it
     */
    public setDefaultSorting(): void {
        const defaultSort = 'asc';
        const defaultField = 'namespace' === this.assetType ? 'name' : 'hexId';

        Vue.set(this, 'sortedBy', {
            fieldName: defaultField,
            direction: defaultSort,
        });

        this.setSortedBy(defaultField);
    }

    /**
     * Triggers table filtering by setting its filtering options
     * @param {TableFieldNames} fieldName
     */
    public setFilteredBy(fieldName: string): void {
        const filteredBy = { ...this.filteredBy };
        const filteringType: FilteringTypes = filteredBy.fieldName === fieldName && filteredBy.filteringType === 'show' ? 'hide' : 'show';

        this.filteredBy = { fieldName, filteringType };
    }

    /**
     * Sorts the table data
     * @param {TableFieldNames} fieldName
     */
    public setSortedBy(fieldName: string): void {
        const sortedBy = { ...this.sortedBy };
        const direction: SortingDirections = sortedBy.fieldName === fieldName && sortedBy.direction === 'asc' ? 'desc' : 'asc';

        Vue.set(this, 'sortedBy', { fieldName, direction });
    }

    /**
     * Handle pagination page change
     * @param {number} page
     */
    public handlePageChange(page: number): void {
        this.currentPage = page;
    }

    /**
     * Triggers the alias form modal
     * @protected
     * @param {Record<string, string>} rowValues
     * @return {void}
     */
    protected showAliasForm(rowValues: Record<string, string>): void {
        // populate asset form modal props if asset is a mosaic
        if (this.assetType === 'mosaic') {
            this.modalFormsProps.namespaceId = rowValues.name !== 'N/A' ? new NamespaceId(rowValues.name) : null;
            this.modalFormsProps.aliasTarget = new MosaicId(rowValues.hexId);
            this.modalFormsProps.aliasAction = rowValues.name !== 'N/A' ? AliasAction.Unlink : AliasAction.Link;
        }

        /**
         * Helper function to instantiate the alias target if any
         * @param {string} aliasTarget
         * @param {('address' | 'mosaic')} aliasType
         * @returns {(MosaicId | Address)}
         */
        const getInstantiatedAlias = (aliasType: string, aliasTarget: string): MosaicId | Address => {
            if (aliasType === 'mosaic') {
                return new MosaicId(aliasTarget);
            }
            return Address.createFromRawAddress(aliasTarget);
        };

        // populate asset form modal props if asset is a namespace
        if (this.assetType === 'namespace') {
            (this.modalFormsProps.namespaceId = new NamespaceId(rowValues.name)),
                (this.modalFormsProps.aliasTarget =
                    rowValues.aliasIdentifier === 'N/A'
                        ? null
                        : rowValues.aliasIdentifier
                        ? getInstantiatedAlias(rowValues.aliasType, rowValues.aliasIdentifier)
                        : null);
            this.modalFormsProps.aliasAction = rowValues.aliasIdentifier === 'N/A' ? AliasAction.Link : AliasAction.Unlink;
        }

        // show the alias form modal
        Vue.set(this.modalFormsVisibility, 'aliasTransaction', true);
    }

    /**
     * Triggers the extend namespace duration form modal
     * @protected
     * @param {Record<string, string>} rowValues
     * @return {void}
     */
    protected showExtendNamespaceDurationForm(rowValues: Record<string, string>): void {
        this.modalFormsProps.namespaceId = new NamespaceId(rowValues.name);
        Vue.set(this.modalFormsVisibility, 'extendNamespaceDurationTransaction', true);
    }

    /**
     * Triggers the modify mosaic supply form modal
     * @protected
     * @param {Record<string, string>} rowValues
     * @return {void}
     */
    protected showModifyMosaicSupplyForm(rowValues: Record<string, string>): void {
        this.modalFormsProps.mosaicId = new MosaicId(rowValues.hexId);
        Vue.set(this.modalFormsVisibility, 'mosaicSupplyChangeTransaction', true);
    }

    protected showMetadataValue(metadataList: MetadataModel[]) {
        this.targetedMetadataList = metadataList;
        Vue.set(this.modalFormsVisibility, 'targetedMetadataValue', true);
    }

    /**
     * Closes a modal
     * @protected
     * @param {string} modalIdentifier
     * @return {void}
     */
    protected closeModal(modalIdentifier: string): void {
        Vue.set(this.modalFormsVisibility, modalIdentifier, false);
    }

    /**
     * avoid multiple clicks
     * @protected
     * @param {string}
     * @return {void}
     */
    public isRefreshing: boolean = false;

    public loadMore() {
        if (this.currentConfirmedPage && !this.currentConfirmedPage.isLastPage) {
            if (this.assetType === TableAssetType.Namespace) {
                this.$store.dispatch('namespace/LOAD_NAMESPACES', { pageSize: this.pageSize, pageNumber: ++this.currentPage });
            }
        }
    }

    protected async onRefresh() {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
                await this.refresh();
            } catch (e) {
                console.log('Cannot refresh', e);
            }
            this.isRefreshing = false;
        }
    }
    /**
     * open edit metadata modal
     */
    protected showModalUpdateMetadata(metadataList: MetadataModel[]) {
        this.targetedMetadataList = metadataList;
        Vue.set(this.modalFormsVisibility, 'targetValue', true);
    }

    /**
     * Watching if refreshed triggered
     * @param newVal
     */
    @Watch('currentConfirmedPage')
    public watchRefresh(newVal: PageInfo) {
        // if page refresh is triggered then reset page info
        if (newVal && newVal.pageNumber === 1) {
            this.currentPage = 1;
        }
    }

    /**
     * Whether infinite scroll is currently disabled
     */
    protected get infiniteScrollDisabled() {
        return this.paginationType !== 'scroll' || this.isLoading;
    }

    /**
     * Whether it is currently fetching more transactions from repository
     */
    protected get isFetchingMore(): boolean {
        return this.isLoading && this.currentConfirmedPage && this.currentConfirmedPage.pageNumber > 1;
    }
}
