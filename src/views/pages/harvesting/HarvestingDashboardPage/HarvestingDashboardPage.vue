<template>
    <AssetDashboardWrap :parent-route-name="'harvesting'" />
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';

// child components
import AssetDashboardWrap from '@/views/pages/assets/AssetDashboardWrap/AssetDashboardWrap.vue';

@Component({
    components: { AssetDashboardWrap },
    data() {
        return {};
    },
})
export default class HarvestingDashboardPage extends Vue {}
</script>
