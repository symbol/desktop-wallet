<template>
    <div class="account-metadata-container">
        <AssetListPageWrap>
            <template v-slot:table-section>
                <TableDisplay class="table-section" asset-type="metadata" @add-metadata="showAddMetadataModel">
                    <template v-slot:table-title>
                        <h1 class="section-title">
                            {{ $t('metadata_attached_to_account') }}
                        </h1>
                    </template>
                </TableDisplay>
            </template>
        </AssetListPageWrap>
        <ModalMetadataUpdate v-if="showUpdateModal" :visible="true" @close="$emit('close')" />
    </div>
</template>

<script lang="ts">
import { AccountMetadataPageTs } from './AccountMetadataPageTs';

export default class AccountMetadataPage extends AccountMetadataPageTs {}
</script>

<style lang="less" scoped>
@import './AccountMetadataPage.less';
</style>
