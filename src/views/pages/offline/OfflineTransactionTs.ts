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
import { mapGetters } from 'vuex';

// @ts-ignore
import FormOfflineTransferTransaction from '@/views/forms/FormOfflineTransferTransaction/FormOfflineTransferTransaction.vue';
// @ts-ignore
import QRCodeDisplay from '@/components/QRCode/QRCodeDisplay/QRCodeDisplay.vue';
// @ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';

import { NetworkType, SignedTransaction } from 'symbol-sdk';
import { SignedTransactionQR } from 'symbol-qr-library';
import { TabEntry } from '@/router/TabEntry';
import { officialIcons } from '@/views/resources/Images';

@Component({
    components: {
        FormOfflineTransferTransaction,
        QRCodeDisplay,
        NavigationTabs,
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

    get customTabEntries(): TabEntry {
        // @ts-ignore
        return TabEntry.getFromRoutes(this.$router.routes[3].children[0].children);
    }

    get loginIcon() {
        return officialIcons.customerAlice;
    }

    public async onLoginClick() {
        await this.$store.dispatch('profile/LOG_OUT');
        this.$router.push('/login');
    }

    public parentRouteName = 'offlineTransaction';
}
