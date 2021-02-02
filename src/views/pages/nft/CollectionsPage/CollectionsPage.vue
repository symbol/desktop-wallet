<template>
    <div style="display: flex; flex-wrap: wrap;">
        <NFTCardDisplay
            v-for="(item, index) in cardInfo"
            :key="index"
            :title="item.nftData.title"
            :mosaic-id="item.hexId"
            :cid="item.nftData.CID"
        />
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';

// child components
import AssetFormPageWrap from '@/views/pages/assets/AssetFormPageWrap/AssetFormPageWrap.vue';
import FormMosaicDefinitionTransaction from '@/views/forms/FormMosaicDefinitionTransaction/FormMosaicDefinitionTransaction.vue';
import NFTCardDisplay from '@/components/NFTCardDisplay/NFTCardDisplay.vue';
import { mapGetters } from 'vuex';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { MosaicService } from '@/services/MosaicService';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { MetadataModel } from '@/core/database/entities/MetadataModel';

// @ts-ignore
@Component({
    components: { AssetFormPageWrap, FormMosaicDefinitionTransaction, NFTCardDisplay },
    computed: {
        ...mapGetters({
            currentHeight: 'network/currentHeight',
            currentAccount: 'account/currentAccount',
            holdMosaics: 'mosaic/holdMosaics',
            networkConfiguration: 'network/networkConfiguration',
            attachedMetadataList: 'metadata/accountMetadataList',
            isFetchingMosaics: 'mosaic/isFetchingMosaics',
            isFetchingMetadata: 'metadata/isFetchingMetadata',
        }),
    },
})
export default class CollectionsPage extends Vue {
    /**
     * Current account owned mosaics
     * @protected
     * @type {MosaicModel[]}
     */
    private holdMosaics: MosaicModel[];
    private currentHeight: number;
    private networkConfiguration: NetworkConfigurationModel;
    protected parseMetaData(metaData: MetadataModel[]) {
        return metaData.map((metaItem) => {
            try {
                return JSON.parse(metaItem.value);
            } catch (e) {
                return;
            }
        });
    }
    get cardInfo() {
        const mosaicsInfo = this.holdMosaics;
        console.log(mosaicsInfo);
        return mosaicsInfo
            .map((mosaicInfo) => {
                const expiration = MosaicService.getExpiration(
                    mosaicInfo,
                    this.currentHeight,
                    this.networkConfiguration.blockGenerationTargetTime,
                );
                const metadata = this.parseMetaData(mosaicInfo.metadataList);
                if (metadata.length === 0 || mosaicInfo.balance === 0) {
                    return;
                }
                // - map table fields
                return {
                    hexId: mosaicInfo.mosaicIdHex,
                    name: mosaicInfo.name || 'N/A',
                    supply: mosaicInfo.supply.toLocaleString(),
                    balance: (mosaicInfo.balance || 0) / Math.pow(10, mosaicInfo.divisibility),
                    expiration: expiration,
                    divisibility: mosaicInfo.divisibility,
                    transferable: mosaicInfo.transferable,
                    supplyMutable: mosaicInfo.supplyMutable,
                    restrictable: mosaicInfo.restrictable,
                    nftData: metadata[0],
                };
            })
            .filter((x) => x);
    }
}
</script>
