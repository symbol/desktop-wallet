<template v-slot="{ handleSubmit }">
    <div class="card-container">
        <div class="card-container-image">
            <img :src="'https://cloudflare-ipfs.com/ipfs/' + cid" :alt="title" :title="title" class="card-image" />
        </div>
        <div class="card-container-info">
            <a :href="'http://explorer.testnet.symboldev.network/mosaics/' + mosaicId" class="card-info-title" target="_blank">{{
                title
            }}</a>
            <div class="card-actions">
                <button
                    class="button-style inverted-button fat-button"
                    style="cursor: pointer;"
                    type="submit"
                    @click="transferMosaic(mosaicId)"
                >
                    Transfer
                </button>
                <button
                    class="button-style inverted-button fat-button"
                    style="cursor: pointer;"
                    type="submit"
                    @click="sellMosaic(mosaicId)"
                >
                    Sell
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class NFTCardDisplay extends Vue {
    @Prop({ required: true }) readonly title: string;
    @Prop({ required: true }) readonly cid: string;
    @Prop({ required: true }) readonly mosaicId: string;
    transferMosaic(mosaicId: string) {
        alert('Mosaic to transfer: ' + mosaicId);
        console.log(this);
    }
    sellMosaic(mosaicId: string) {
        alert('Mosaic to sell: ' + mosaicId);
    }
}
</script>

<style lang="less" scoped>
@import './NFTCardDisplay.less';
</style>
