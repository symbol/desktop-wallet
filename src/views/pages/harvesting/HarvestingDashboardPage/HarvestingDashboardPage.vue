<template>
	<div class="dashboard-container">
		<div class="dashboard-status-container">
			<HarvestStatisticsPanel/>
		</div>
	    <div class="dashboard-bottom-container">
	    	<div class="dashboard-bottom-left-container">
		        <div class="dashboard-inner-container">
		            <div class="header-container">
		                <NavigationTabs direction="horizontal" :parent-route-name="'harvesting'"/>
		            </div>
		            <div class="bottom-container">
		                <router-view />
		            </div>
		        </div>
		    </div>
	    	<div class="dashboard-bottom-right-container">

	    	</div>
	    </div>
	</div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';

// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
import HarvestStatisticsPanel from '@/components/HarvestStatisticsPanel/HarvestStatisticsPanel.vue'

@Component({
    components: { NavigationTabs, HarvestStatisticsPanel },
    data() {
        return {};
    },
})
export default class HarvestingDashboardPage extends Vue {}
</script>
<style lang="less" scoped>
@import './HarvestingDashboardPage.less';
</style>