import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { AccountModel } from '@/core/database/entities/AccountModel';
// @ts-ignore
import FormGeneralSettings from '@/views/forms/FormGeneralSettings/FormGeneralSettings.vue';
// @ts-ignore
import FormProfilePasswordUpdate from '@/views/forms/FormProfilePasswordUpdate/FormProfilePasswordUpdate.vue';
// @ts-ignore
import AboutPage from '@/views/pages/settings/AboutPage/AboutPage.vue';
// @ts-ignore
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';
//@ts-ignore
import FormNodeEdit from '@/views/forms/FormNodeEdit/FormNodeEdit.vue';

/**
 * Settings pages
 */
enum SettingsTabs {
    GENERAL = 0,
    PASSWORD = 1,
    NETWORK = 2,
    ABOUT = 3,
}

@Component({
    components: {
        FormGeneralSettings,
        FormProfilePasswordUpdate,
        AboutPage,
        FormNodeEdit,
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
