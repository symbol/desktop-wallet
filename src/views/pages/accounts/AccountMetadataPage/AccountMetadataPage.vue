<template>
    <div class="account-detail-outer-container">
        <div class="account-detail-inner-container">
            <AssetListPageWrap>
                <template v-slot:table-section>
                    <TableDisplay asset-type="metadata" class="table-section">
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('metadata') }}
                            </h1>
                        </template>
                    </TableDisplay>
                </template>
            </AssetListPageWrap>
        </div>
    </div>
</template>

<script lang="ts">
import { AccountMetadataPageTs } from './AccountMetadataPageTs';

export default class AccountMetadataPage extends AccountMetadataPageTs {}
</script>

<style lang="less" scoped>
@import './AccountMetadataPage.less';
</style>