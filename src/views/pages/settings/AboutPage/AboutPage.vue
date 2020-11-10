<template>
    <div class="about-container">
        <div class="form-container">
            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_app_release') }}
                </div>
                <div class="value">{{ configs.package.description }} v{{ configs.package.version }}</div>
            </div>
            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_app_url') }}
                </div>
                <div class="value">
                    <a :href="configs.package.homepage" target="_blank">{{ configs.package.homepage }}</a>
                </div>
            </div>
            <!-- <div class="form-row"></div> -->

            <div class="subtitle">
                {{ $t('about_network') }}
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_default_node') }}
                </div>
                <div class="value">
                    <a :href="nodeLink" target="_blank">{{ configs.network.defaultNodeUrl }}</a>
                </div>
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_network_type') }}
                </div>
                <div class="value">
                    <span v-if="isNetworkType(types.MAIN_NET)">MAINNET</span>
                    <span v-else-if="isNetworkType(types.TEST_NET)">TESTNET</span>
                    <span v-else-if="isNetworkType(types.MIJIN)">MIJIN</span>
                    <span v-else-if="isNetworkType(types.MIJIN_TEST)">MIJIN_TEST</span>
                </div>
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_generation_hash') }}
                </div>
                <div class="value">
                    {{ generationHash }}
                </div>
            </div>
            <!-- <div class="form-row about-list"></div> -->

            <div class="subtitle">
                {{ $t('about_dependencies') }}
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_sdk_version') }}
                </div>
                <div class="value">
                    {{ configs.package.dependencies['symbol-sdk'] }}
                </div>
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_typescript_version') }}
                </div>
                <div class="value">
                    {{ configs.package.dependencies['typescript'] }}
                </div>
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_rxjs_version') }}
                </div>
                <div class="value">
                    {{ configs.package.dependencies['rxjs'] }}
                </div>
            </div>

            <div class="form-row about-list">
                <div class="label">
                    {{ $t('about_vue_version') }}
                </div>
                <div class="value">
                    {{ configs.package.dependencies['vue'] }}
                </div>
            </div>
            <!-- <div class="form-row"></div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NetworkType } from 'symbol-sdk';
// child components
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
import FormLabel from '@/components/FormLabel/FormLabel.vue';
// configuration
import { appConfig } from '@/config';
import { feesConfig } from '@/config';
import { networkConfig } from '@/config';
import packageConfig from '@/../package.json';
import { mapGetters } from 'vuex';
import { NetworkModel } from '@/core/database/entities/NetworkModel';

@Component({
    components: {
        FormWrapper,
        FormLabel,
    },
    computed: {
        ...mapGetters({
            networkModel: 'network/networkModel',
        }),
    },
})
export default class AboutPage extends Vue {
    private networkModel: NetworkModel;

    public configs = {
        package: packageConfig,
        app: appConfig,
        fees: feesConfig,
        network: networkConfig,
    };
    public types = NetworkType;

    public isNetworkType(type): boolean {
        return networkConfig.defaultNetworkType === type;
    }

    public get generationHash(): string {
        return this.networkModel.generationHash;
    }

    public get nodeLink(): string {
        return `${this.configs.network.defaultNodeUrl}/node/info`;
    }
}
</script>

<style lang="less" scoped>
@import '../../../resources/css/variables.less';
.about-container {
    display: block;
    width: 100%;
    clear: both;
    min-height: 1rem;
    padding-left: 6%;
    padding-top: 0.8rem;
    padding-bottom: 0.4rem;

    .form-row {
        width: 100%;
        display: grid;
        grid-template-columns: 20% 80%;
        font-size: @smallFont;
        color: @primary;
        min-height: unset;
    }

    .subtitle {
        font-size: @normalFont;
        font-weight: @bold;
        color: @primary;
        margin-top: 50px;
    }
}
</style>
