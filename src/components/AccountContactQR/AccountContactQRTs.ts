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
import { ContactQR } from 'symbol-qr-library';
import { PublicAccount } from 'symbol-sdk';
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel';
// resources
import { mapGetters } from 'vuex';
// @ts-ignore
import QRCodeDisplay from '@/components/QRCode/QRCodeDisplay/QRCodeDisplay.vue';
@Component({
    components: {
        QRCodeDisplay,
    },
    computed: {
        ...mapGetters({
            generationHash: 'network/generationHash',
        }),
    },
})
export class AccountContactQRTs extends Vue {
    @Prop({
        default: null,
    })
    account: AccountModel;

    /**
     * Current network's generation hash
     * @var {string}
     */
    public generationHash: string;

    /// region computed properties getter/setter
    get qrCodeArgs(): ContactQR {
        if (!this.account) {
            return null;
        }

        try {
            const publicAccount: PublicAccount = AccountModel.getObjects(this.account).publicAccount;
            return new ContactQR(this.account.name, publicAccount.publicKey, publicAccount.address.networkType, this.generationHash);
        } catch (error) {
            return null;
        }
    }

    get downloadName(): string {
        return this.account ? `address-qr-${this.account.name}.png` : '';
    }
    /// end-region computed properties getter/setter
}
