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
import { Component, Prop, Vue } from 'vue-property-decorator';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
//@ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';

@Component({
    components: {
        ButtonCopyToClipboard,
    },
})
export class AccountPublicKeyDisplayTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;

    @Prop({
        default: null,
    })
    publicKey: string;
    /// region computed properties getter/setter
    /// end-region computed properties getter/setter
}
