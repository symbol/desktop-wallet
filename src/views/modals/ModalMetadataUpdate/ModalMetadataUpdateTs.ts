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

// import external components
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';
import { MetadataType } from 'symbol-sdk';

// import internal components
import { MetadataModel } from '@/core/database/entities/MetadataModel';
// @ts-ignore
import FormMetadataCreation from '@/views/forms/FormMetadataCreation/FormMetadataCreation.vue';

@Component({
    components: {
        FormMetadataCreation
    },
})
export class ModalMetadataUpdateTs extends Vue {
    @Prop({
        default: false,
    })
    visible: boolean;

    /**
     * @MetadataModel
     * Determine edit or add
     */
    protected metadata: MetadataModel;

    /**
     * Metadata update modal type
     */
    @Prop({
        default: MetadataType.Account
    })
    protected type: MetadataType;

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
     * Modal title from modal type
     * @type {TranslateResult}
     */
    get modalTitle(): TranslateResult {
        var title : TranslateResult = '';
        switch(this.type) {
            case MetadataType.Mosaic:
                title = this.$t('modal_title_mosaic_metadata');
                break;
            
            case MetadataType.Namespace:
                title = this.$t('modal_title_namespace_metadata');
                break;

            default:
                title = this.$t('modal_title_account_metadata');
                break;
        }
        return title;
    }

    /**
     * Save Metadata handler
     * @param {void}
     */
    protected saveMetadata() : void {
        console.log('create metadata handle');
        this.$emit('close');
    }
}
