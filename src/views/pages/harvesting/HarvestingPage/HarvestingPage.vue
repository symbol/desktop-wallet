<template>
    <div class="main-delegated-container">
    	<div class="info-text">
    		<span>
    			Storj, IoDLT and Nem have come together to create a unique storage soluton to facilitate faster syncing time when setting up a node on the Symbol network, whether that is rebuilding an old node or starting a new one. The Tardigrade Connector Streamlines the amount of time it takes to...
    		</span>
    	</div>
    	<div>
    		<!-- TODO: FORM HARVESTING-->
    	</div>
    	<div>
    		<button class="info-text inverted-button pl-2 pr-2" style="cursor: pointer;">
    		<!-- TODO: DELEGATED -->
    			STOP HARVESTING
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
export default class HarvestingPage extends Vue {}
</script>
<style lang="less" scoped>
@import './HarvestingPage.less';
</style>
