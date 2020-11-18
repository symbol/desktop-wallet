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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { MetadataModel } from '@/core/database/entities/MetadataModel';
import { AccountModel } from '@/core/database/entities/AccountModel';

@Component({
    computed: mapGetters({
        currentAccount: 'account/currentAccount',
    }),
})
export class AccountMetadataDisplayTs extends Vue {
    /**
     * account metadata list
     */
    @Prop({
        default: [],
    })
    protected metadataList: MetadataModel[];

    /**
     * selected metadata model id
     */
    protected value: string = '';

    protected currentAccount: AccountModel;

    set chosenValue(newValue: string) {
        this.value = newValue;
    }

    get chosenValue(): string {
        if (this.value !== '') {
            const chosenItem = this.metadataList.filter((metadata) => metadata.metadataId === this.value);
            return chosenItem.length && chosenItem[0].metadataId;
        } else if (this.metadataList.length) {
            return this.metadataList[0].metadataId;
        }
    }

    /**
     * Hook called when the layout is mounted
     * @return {void}
     */
    public mounted(): void {
        // set default value to the first namespace in the list
        if (this.metadataList.length) {
            this.chosenValue = this.metadataList[0].metadataId;
        }
    }
}
