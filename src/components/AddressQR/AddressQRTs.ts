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
import { AddressQR } from 'symbol-qr-library';
import { Address } from 'symbol-sdk';
import { mapGetters } from 'vuex';
import { IContact } from 'symbol-address-book';
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
export class AddressQRTs extends Vue {
    @Prop({
        default: null,
    })
    contact: IContact;

    /**
     * Current network's generation hash
     * @var {string}
     */
    public generationHash: string;

    /// region computed properties getter/setter
    get qrCodeArgs(): AddressQR {
        if (!this.contact) {
            return null;
        }

        try {
            const addressObj = Address.createFromRawAddress(this.contact.address);
            return new AddressQR(this.contact.name, this.contact.address, addressObj.networkType, this.generationHash);
        } catch (error) {
            return null;
        }
    }

    get downloadName(): string {
        return this.contact ? `contact-qr-${this.contact.name}.png` : '';
    }
    /// end-region computed properties getter/setter
}
