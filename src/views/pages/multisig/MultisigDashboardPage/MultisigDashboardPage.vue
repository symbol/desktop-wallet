<template>
    <div class="multisig-outer-container">
        <div class="multisig-inner-container">
            <div class="bottom-container">
                <NavigationTabs direction="horizontal" :parent-route-name="'multisig'" />
                <router-view />
            </div>
        </div>
    </div>
</template>
<script>
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';

@Component({
    components: { NavigationTabs },
    data() {
        return {};
    },
})
export default class MultisigDashboardPage extends Vue {}
</script>

<style lang="less" scoped>
@import '../../../resources/css/variables.less';
.multisig-outer-container {
    position: relative;
    width: 100%;
    height: 100%;

    .multisig-inner-container {
        width: 100%;
        height: 100%;
        background: white;
        overflow-x: hidden;
        overflow-y: auto;
        border-radius: @borderRadius;
        .header-container {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
