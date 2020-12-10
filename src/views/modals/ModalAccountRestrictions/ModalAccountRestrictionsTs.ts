/*
 * Copyright 2020 NEM (https://nem.io)
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
// @ts-ignore
import FormAccountRestrictionTransaction from '@/views/forms/FormAccountRestrictionTransaction/FormAccountRestrictionTransaction.vue';
// @ts-ignore
import AboutPage from '@/views/pages/settings/AboutPage/AboutPage.vue';
// @ts-ignore
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';
//@ts-ignore
import FormNodeEdit from '@/views/forms/FormNodeEdit/FormNodeEdit.vue';
//@ts-ignore
import AccountRestrictionsList from '@/components/AccountRestrictionsList/AccountRestrictionsList.vue';
//@ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue';
import { AccountRestriction } from 'symbol-sdk';

/**
 * Settings pages
 */
enum AccountRestrictionsTabs {
    ADDRESS = 0,
    MOSAIC = 1,
    OPERATION = 2,
}

@Component({
    components: {
        FormAccountRestrictionTransaction,
        AboutPage,
        FormNodeEdit,
        NavigationLinks,
        AccountRestrictionsList,
        ButtonAdd,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
        }),
    },
})
export class ModalAccountRestrictionsTs extends Vue {
    /// region component properties
    @Prop({ default: false }) visible: boolean;

    public addNewFormVisible = false;
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
    protected knownTabs = AccountRestrictionsTabs;

    /**
     * Items that will be shown in the ModalWizardDisplay
     */
    protected availableTabs = Object.keys(this.knownTabs).filter((key) => Number.isNaN(parseInt(key)));

    /**
     * Currently active tab
     * In case of unauthenticated user, network tab is default
     */
    protected currentTabIndex = 0;

    /**
     * Restriction object to be deleted recieved from the list(delete button click)
     */
    protected restrictionToBeDeleted: AccountRestriction;

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
        this.hideAddNewForm();
        this.resetRestrictionToBeDeleted();
    }

    /**
     * AccountRestriction Delete Event Handler
     * @param restriction
     */
    protected onDeleteRestriction(restriction: AccountRestriction) {
        this.restrictionToBeDeleted = restriction;
        this.addNewFormVisible = true;
    }

    /**
     * resets restriction obj to be deleted
     */
    protected resetRestrictionToBeDeleted() {
        this.restrictionToBeDeleted = null;
    }

    /**
     * Shows AddNew Form (and resets restriction obj to be deleted)
     *
     */
    protected showAddNewForm() {
        this.resetRestrictionToBeDeleted();
        this.addNewFormVisible = true;
    }

    /**
     * Hides AddNew Form (and resets restriction obj to be deleted)
     *
     */
    protected hideAddNewForm() {
        this.resetRestrictionToBeDeleted();
        this.addNewFormVisible = false;
    }
}
