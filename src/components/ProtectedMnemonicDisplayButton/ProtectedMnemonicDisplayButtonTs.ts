/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
import { UIHelpers } from '@/core/utils/UIHelpers';
// child components
// @ts-ignore
import ModalMnemonicDisplay from '@/views/modals/ModalMnemonicDisplay/ModalMnemonicDisplay.vue';

@Component({
    components: {
        ModalMnemonicDisplay,
    },
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            networkType: 'network/networkType',
            generationHash: 'network/generationHash',
        }),
    },
})
export class ProtectedMnemonicDisplayButtonTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;

    /**
     * UI Helpers
     * @var {UIHelpers}
     */
    public uiHelpers = UIHelpers;

    /**
     * Whether currently viewing export
     * @var {boolean}
     */
    public isViewingExportModal: boolean = false;

    /// region computed properties getter/setter
    public get hasMnemonicExportModal(): boolean {
        return this.isViewingExportModal;
    }

    public set hasMnemonicExportModal(f: boolean) {
        this.isViewingExportModal = f;
    }
    /// end-region computed properties getter/setter

    /**
     * Hook called when the account unlock modal must open
     * @return {void}
     */
    public onClickDisplay() {
        this.hasMnemonicExportModal = true;
    }
}
