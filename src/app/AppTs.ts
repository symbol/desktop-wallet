/*
 * (C) Symbol Contributors 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// child components
// @ts-ignore
import SpinnerLoading from '@/components/SpinnerLoading/SpinnerLoading.vue';

@Component({
    computed: {
        ...mapGetters({
            hasLoadingOverlay: 'app/shouldShowLoadingOverlay',
            currentProfile: 'profile/currentProfile',
        }),
    },
    components: {
        SpinnerLoading,
    },
})
export class AppTs extends Vue {
    /**
     * Display the application version. This is injected in the app when built.
     */
    public packageVersion = process.env.PACKAGE_VERSION || '0';

    /**
     * Display the web wallet warning. This is injected in the app when built.
     */
    public web = process.env.WEB || false;
    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: string;

    /**
     * Whether a loading overlay must be displayed
     * @see {Store.App}
     * @var {boolean}
     */
    public hasLoadingOverlay: boolean;

    /**
     * Hook called when the app is started
     * @return {void}
     */
    public created() {
        this.initialize();
    }

    /**
     * Hook called when the app is closed
     * @return {void}
     */
    public destroyed() {
        this.uninitialize();
    }

    /**
     * Initialize the app store
     * @see {Store.AppInfo}
     */
    protected initialize() {
        this.$store.dispatch('initialize').catch((error) => console.log(error));
    }

    /**
     * Uninitialize the app store
     * @see {Store.AppInfo}
     */
    protected uninitialize() {
        this.$store.dispatch('uninitialize');
    }
}
