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
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
// child components
// @ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
// @ts-ignore
import AccountSelectorPanel from '@/components/AccountSelectorPanel/AccountSelectorPanel.vue';
// @ts-ignore
import ContactSelectorPanel from '@/components/ContactSelectorPanel/ContactSelectorPanel.vue';
// @ts-ignore
import ContactDetailPanel from '@/components/ContactDetailPanel/ContactDetailPanel.vue';
// @ts-ignore
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue';
// @ts-ignore
import ModalMetadataUpdate from '@/views/modals/ModalMetadataUpdate/ModalMetadataUpdate.vue';
// @ts-ignore
import ModalAccountRestrictions from '@/views/modals/ModalAccountRestrictions/ModalAccountRestrictions.vue';
// @ts-ignore
import ModalConfirm from '@/views/modals/ModalConfirm/ModalConfirm.vue';

@Component({
    components: {
        NavigationTabs,
        AccountSelectorPanel,
        ContactSelectorPanel,
        ContactDetailPanel,
        NavigationLinks,
        ButtonAdd,
        ModalMetadataUpdate,
        ModalAccountRestrictions,
        ModalConfirm,
    },
    computed: {
        ...mapGetters({}),
    },
})
export class AccountsTs extends Vue {
    /**
     * Argument passed to the navigation component
     * @var {string}
     */
    public parentRouteName: string = 'accounts';

    public panelItems = ['accounts', 'addressbook'];

    public activeIndex = 0;

    public get activePanel() {
        return this.activeIndex;
    }
    public set activePanel(panel) {
        this.activeIndex = panel;
    }
    /**
     * Show add metadata modal
     */
    public showMetadataModal: boolean = false;
    /**
     * Show confirm open restrictions
     */
    public showConfirmOpenRestrictionsModal: boolean = false;
    /**
     * Show add metadata modal
     */
    public showAccountRestrictionsModal: boolean = false;
}
