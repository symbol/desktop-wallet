<template>
    <div class="main-delegated-container">
        <div class="info-text">
            <span>
                Storj, IoDLT and Nem have come together to create a unique storage soluton to facilitate faster syncing time when setting up
                a node on the Symbol network, whether that is rebuilding an old node or starting a new one. The Tardigrade Connector
                Streamlines the amount of time it takes to...
            </span>
        </div>
        <div class="bottom-container">
            <button class="button-style inverted-button fat-button" style="cursor: pointer;">
                <!-- TODO: Add onClick action. -->
                {{ $t('stop_harvesting') }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';

// @ts-ignore
@Component({
    components: {},
})
export default class DelegatedHarvestingPage extends Vue {}
</script>
<style lang="less" scoped>
@import './DelegatedHarvestingPage.less';
</style>
