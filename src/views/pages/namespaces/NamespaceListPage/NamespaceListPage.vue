<template>
    <AssetListPageWrap>
        <template v-slot:table-section>
            <TableDisplay
                asset-type="namespace"
                class="table-section"
                :pagination-type="'scroll'"
                :page-size="20"
                @on-add-metadata="showMetadataModal = true"
            >
                <template v-slot:table-title>
                    <h1 class="section-title">
                        {{ $t('namespace_and_sub_namespace') }}
                    </h1>
                </template>
            </TableDisplay>
            <ModalMetadataUpdate v-if="showMetadataModal" :visible="showMetadataModal" :type="2" @close="showMetadataModal = false" />
        </template>
    </AssetListPageWrap>
</template>

<script lang="ts">
import { NamespaceListPageTs } from './NamespaceListPageTs';
export default class NamespaceListPage extends NamespaceListPageTs {}
</script>

<style scoped lang="less">
.table-section {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: 100%;
}
</style>
