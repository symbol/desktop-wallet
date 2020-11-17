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

// import internal components
import { MetadataModel } from '@/core/database/entities/MetadataModel';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';

@Component({
    components: {
        FormRow,
    },
})
export class ModalMetadataDisplayTs extends Vue {
    /**
     * Modal visibility
     */
    @Prop({
        default: false,
    })
    public visible: boolean;

    /**
     * Metadata models
     * @param {MetadataModel[]} metadataList
     */
    @Prop({
        required: true,
    })
    protected metadataList: MetadataModel[];

    /**
     * selected metadata key value
     */
    public metadataKey: string = '';

    /**
     * get selected metadata model by current key
     */
    protected get selectedMetadata(): MetadataModel {
        return this.metadataList.find((metadata) => metadata.scopedMetadataKey === this.metadataKey);
    }

    /**
     * Visibility state
     * @type {boolean}
     */
    get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     */
    set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    /**
     * Hook called when the layout is mounted
     * @return {void}
     */
    public mounted(): void {
        // set default value to the first namespace in the list
        if (this.metadataList.length) {
            this.metadataKey = this.metadataList[0].scopedMetadataKey;
        }
    }
}
