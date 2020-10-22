<template>
    <AssetListPageWrap>
        <template v-slot:table-section>
            <div>laksjdlkasj</div>
        </template>
    </AssetListPageWrap>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import AssetListPageWrap from '@/views/pages/assets/AssetListPageWrap/AssetListPageWrap.vue';

// @ts-ignore
@Component({
    components: {
        AssetListPageWrap,
    },
})
export default class HarvestingPage extends Vue {}
</script>
