/*
 * (C) Symbol Contributors 2022
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { AccountModel } from '@/core/database/entities/AccountModel';
import AboutPage from '@/views/pages/settings/AboutPage/AboutPage.vue';
import FormAdvancedSettings from '@/views/forms/FormAdvancedSettings/FormAdvancedSettings.vue';
import FormGeneralSettings from '@/views/forms/FormGeneralSettings/FormGeneralSettings.vue';
import FormNodeEdit from '@/views/forms/FormNodeEdit/FormNodeEdit.vue';
import FormProfilePasswordUpdate from '@/views/forms/FormProfilePasswordUpdate/FormProfilePasswordUpdate.vue';
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';

/**
 * Settings pages
 */
enum SettingsTabs {
    GENERAL = 0,
    PASSWORD = 1,
    NETWORK = 2,
    ADVANCED = 3,
    ABOUT = 4,
}

@Component({
    components: {
        AboutPage,
        FormAdvancedSettings,
        FormGeneralSettings,
        FormNodeEdit,
        FormProfilePasswordUpdate,
        NavigationLinks,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
        }),
    },
})
export class ModalSettingsTs extends Vue {
    /// region component properties
    @Prop({ default: false }) visible: boolean;
    @Prop({ default: false }) networkSettingsSelected: boolean;
    /// end-region component properties

    /**
     * Currently active account
     * @see {Store.Account}
     * @var {AccountModel}
     */
    public currentAccount: AccountModel;

    /**
     * Enum representing the available settings tabs
     * @see ModalSettings.vue
     */
    protected knownTabs = SettingsTabs;

    /**
     * Items that will be shown in the ModalWizardDisplay
     */
    protected availableTabs = Object.keys(this.knownTabs).filter((key) => Number.isNaN(parseInt(key)));

    /**
     * Currently active tab
     * In case of unauthenticated user, network tab is default
     */
    protected currentTabIndex = 0;

    created() {
        // when on /profiles route, only the NETWORK tab should be displayed
        this.availableTabs = this.availableTabs.filter((key) => !!this.currentAccount || key === 'NETWORK');
        if (this.networkSettingsSelected) {
            this.currentTabIndex = 2;
        }
    }

    /**
     * Internal visibility state
     * @type {boolean}
     */
    protected get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     */
    protected set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    /**
     * Catches the @selected event
     */
    protected onTabChange(index: number) {
        this.currentTabIndex = index;
    }

    public close() {
        this.$emit('close');
    }
}
