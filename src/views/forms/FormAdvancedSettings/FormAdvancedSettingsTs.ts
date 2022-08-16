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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { NotificationType } from '@/core/utils/NotificationType';
import { SettingsModel } from '@/core/database/entities/SettingsModel';
import Alert from '@/components/Alert/Alert.vue';
import FormLabel from '@/components/FormLabel/FormLabel.vue';
import FormRow from '@/components/FormRow/FormRow.vue';
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';

@Component({
    components: {
        Alert,
        FormLabel,
        FormRow,
        FormWrapper,
        ModalFormProfileUnlock,
    },
    computed: {
        ...mapGetters({
            settings: 'app/settings',
            symbolDocsScamAlertUrl: 'app/symbolDocsScamAlertUrl',
        }),
    },
})
export class FormAdvancedSettingsTs extends Vue {
    public settings: SettingsModel;
    public symbolDocsScamAlertUrl: string;
    public showProfileUnlockModal: boolean = false;
    public formValues = {
        allowUnknownMultisigTransactions: false,
    };
    public isSubmitDisabled: boolean = true;
    public allowUnknownMultisigTransactionsOptions = [
        { value: 0, label: this.$t('disallow') },
        { value: 1, label: this.$t('allow') },
    ];

    public get allowUnknownMultisigTransactions(): number {
        return this.formValues.allowUnknownMultisigTransactions === true ? 1 : 0;
    }

    public set allowUnknownMultisigTransactions(value: number) {
        this.formValues.allowUnknownMultisigTransactions = !!value;
        this.onChange();
    }

    public created() {
        this.refresh();
    }

    public onChange() {
        this.isSubmitDisabled = false;
    }

    public refresh() {
        Object.assign(this.formValues, this.settings);
    }

    public submit() {
        this.showProfileUnlockModal = true;
    }

    public async onAccountUnlocked() {
        try {
            await this.$store.dispatch('app/SET_SETTINGS', this.formValues);
            this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.SUCCESS_SETTINGS_UPDATED);
            this.$emit('submit', this.formValues);
            this.$emit('close');
        } catch (e) {
            this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.');
        }
    }
}
