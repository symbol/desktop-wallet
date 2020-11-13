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

import { MetadataModel } from '@/core/database/entities/MetadataModel';

@Component({
    computed: mapGetters({
        accountMetadataList: 'metadata/accountMetadataList',
    }),
})
export class AccountMetadataDisplayTs extends Vue {
    /**
     * account metadata list
     */
    protected accountMetadataList: MetadataModel[];

    /**
     * selected metadata model id
     */
    protected value: string = '';

    set chosenValue(newValue: string) {
        this.value = newValue;
    }

    get chosenValue(): string {
        return this.value;
    }

    /**
     * action show M
     */
    protected showMetadataDetail() {
        const selectedMetadata: MetadataModel = this.accountMetadataList.find((metadata) => metadata.metadataId === this.value);
        this.$emit('on-view-metadata', selectedMetadata);
    }

    /**
     * Hook called when the layout is mounted
     * @return {void}
     */
    public mounted(): void {
        // set default value to the first namespace in the list
        if (this.accountMetadataList.length) {
            this.chosenValue = this.accountMetadataList[0].metadataId;
        }
    }
}
