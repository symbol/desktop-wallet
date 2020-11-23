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

import { MetadataModel } from '@/core/database/entities/MetadataModel';

@Component({})
export class AccountMetadataDisplayTs extends Vue {
    /**
     * account metadata list
     */
    @Prop({
        default: [],
    })
    protected metadataList: MetadataModel[];

    @Prop({
        default: false,
    })
    visible: boolean;
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
     * Visibility state
     * @type {boolean}
     */
    get show(): boolean {
        return this.visible;
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
    public emitMetadataValue() {
        const metadataEntry = this.metadataList.find((item) => item.metadataId == this.chosenValue);
        this.$emit('on-edit-metadata', metadataEntry);
    }
}
