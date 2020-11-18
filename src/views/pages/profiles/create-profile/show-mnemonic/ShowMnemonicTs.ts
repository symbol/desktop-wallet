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
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';
// @ts-ignore
import MnemonicDisplay from '@/components/MnemonicDisplay/MnemonicDisplay.vue';
// @ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';
import { Formatters } from '@/core/utils/Formatters';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { NotificationType } from '@/core/utils/NotificationType';
import { MnemonicQR, QRCodeGenerator } from 'symbol-qr-library';
// @ts-ignore
import failureIcon from '@/views/resources/img/monitor/failure.png';
import { Password } from 'symbol-sdk';
import { IHDAccountInfo, SymbolPaperWallet } from 'symbol-paper-wallets/index';
import { UIHelpers } from '@/core/utils/UIHelpers';
import { AccountService } from '@/services/AccountService';

@Component({
    components: { MnemonicDisplay, ButtonCopyToClipboard },
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            currentMnemonic: 'temporary/mnemonic',
            currentPassword: 'temporary/password',
        }),
    },
})
export default class ShowMnemonicTs extends Vue {
    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    /**
     * Temporary Mnemonic pass phrase
     * @var {MnemonicPassPhrase}
     */
    public currentMnemonic: MnemonicPassPhrase;

    /**
     * Whether mnemonic is shown in plain text
     * @var {boolean}
     */
    public showMnemonic: boolean = false;

    /**
     * Base64 represatation of QR Code
     * @var {string}
     */
    public qrBase64: string = failureIcon;

    /**
     * Temporary stored password
     * @see {Store.Temporary}
     * @var {Password}
     */
    public currentPassword: Password;

    /**
     * Mnemonic QR Code to be exported
     * @var {MnemonicQR}
     */
    public exportMnemonicQR: MnemonicQR;

    /**
     * Hook called when the component is mounted
     */
    public created() {
        this.exportMnemonicQR = QRCodeGenerator.createExportMnemonic(
            this.currentMnemonic.plain,
            this.currentProfile.networkType,
            this.currentProfile.generationHash,
            this.currentPassword.value,
        );
        this.exportMnemonicQR.toBase64().subscribe((base64) => (this.qrBase64 = base64));
    }

    /// region computed properties getter/setter
    get mnemonicWordsList() {
        if (this.currentMnemonic) {
            return this.currentMnemonic.plain.split(' ');
        }
        this.$store.dispatch('notification/ADD_ERROR', NotificationType.NO_MNEMONIC_INFO);
        this.$router.push({ name: 'profiles.createProfile.info' });
    }
    public get waitingCopyString(): string {
        return Formatters.splitArrayByDelimiter(this.mnemonicWordsList);
    }

    public async downloadPaperWallet() {
        const accountService = new AccountService();
        const mnemonicObj = new MnemonicPassPhrase(this.currentMnemonic.plain);
        const account = accountService.getAccountByPath(mnemonicObj, this.currentProfile.networkType);
        const rootAccountInfo: IHDAccountInfo = {
            mnemonic: this.currentMnemonic.plain,
            rootAccountPublicKey: account.publicKey,
            rootAccountAddress: account.address.pretty(),
        };

        const paperWallet = new SymbolPaperWallet(rootAccountInfo, [], this.currentProfile.networkType, this.currentProfile.generationHash);
        const pdfArray: Uint8Array = await paperWallet.toPdf();
        return UIHelpers.downloadBytesAsFile(pdfArray, `paper-wallet-${this.currentProfile.profileName}`, 'application/pdf');
    }
    /// end-region computed properties getter/setter
}
