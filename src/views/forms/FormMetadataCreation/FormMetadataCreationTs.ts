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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { NotificationType } from '@/core/utils/NotificationType';
import { MetadataService } from '@/services/MetadataService';

// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        ErrorTooltip,
        MaxFeeSelector,
        FormRow,
    },
    computed: {
        ...mapGetters({
            knownAccounts: 'account/knownAccounts',
        })
    },
    mounted: function() {
        console.log("----------", this.knownAccounts);
    }
})
export class FormMetadataCreationTs extends Vue {

    @Prop({
        default: ''
    })
    protected title: string;

    /**
     * Form fields
     * @var {Object}
     */
    public formItems = {
        accountAddress: '',
        targetAccount: '',
        scopedKey: '',
        metadataValue: '',
        maxFee: '',
        password: ''
    }

    /**
     * Validation rules
     * @var {ValidationRuleset}
     */
    public validationRules = ValidationRuleset;

    /**
     * Persist created metadata
     * @return {void}
     */
    private persistMetadata() {

    }

}