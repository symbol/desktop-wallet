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
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
// child components
// @ts-ignore
import TableDisplay from '@/components/TableDisplay/TableDisplay.vue';
// @ts-ignore
import AssetListPageWrap from '@/views/pages/assets/AssetListPageWrap/AssetListPageWrap.vue';
// @ts-ignore
import ModalMetadataUpdate from '@/views/modals/ModalMetadataUpdate/ModalMetadataUpdate.vue';

@Component({
    components: {
        AssetListPageWrap,
        TableDisplay,
        ModalMetadataUpdate,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
        }),
    },
})
export class AccountMetadataPageTs extends Vue {
    /**
     * Currently active account
     */
    public currentAccount: AccountModel;

    /**
     * Update metadata modal visible
     */
    @Prop({
        default: false,
    })
    public showUpdateModal: boolean;

    /**
     * Triggers the add metadata form modal
     * @protected
     * @return {void}
     */
    protected showAddMetadataModel(): void {
        this.showUpdateModal = !this.showUpdateModal;
    }
}
