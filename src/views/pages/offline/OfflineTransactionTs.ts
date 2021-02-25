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
import Vue from 'vue';
import Component from 'vue-class-component';
import {mapGetters} from "vuex";

// @ts-ignore
import FormOfflineTransferTransaction from "@/views/forms/FormOfflineTransferTransaction/FormOfflineTransferTransaction.vue";
// @ts-ignore
import QRCodeDisplay from "@/components/QRCode/QRCodeDisplay/QRCodeDisplay.vue";

import {Account, Address, NetworkType, SignedTransaction} from "symbol-sdk";
import {QRCode, SignedTransactionQR} from "symbol-qr-library";

@Component({
    components: {
        FormOfflineTransferTransaction,
        QRCodeDisplay,
    },
    computed: {
        ...mapGetters({
            networkType: 'network/networkType',
            generationHash: 'network/generationHash',
        }),
    },
})
export default class OfflineTransactionTs extends Vue {

    public networkType: NetworkType;

    public generationHash: string;

    public qrCode: SignedTransactionQR = null;

    /**
     * Hook called when the child component ModalTransactionConfirmation triggers
     * the event 'signed'
     */
    public onSignedOfflineTransaction(signedTransaction: SignedTransaction) {
        this.qrCode = new SignedTransactionQR(signedTransaction, this.networkType, this.generationHash);
    }
}
