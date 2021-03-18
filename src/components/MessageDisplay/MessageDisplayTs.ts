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
import { Address, EncryptedMessage, MessageType, Account, UnresolvedAddress, Message } from 'symbol-sdk';
import { Component, Prop, Vue } from 'vue-property-decorator';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';
import { PublicAccount } from 'symbol-sdk';
import { mapGetters } from 'vuex';
import { PlainMessage } from 'symbol-sdk';
import { NamespaceId } from 'symbol-sdk';
import { NotificationType } from '@/core/utils/NotificationType';
import { AccountModel } from '@/core/database/entities/AccountModel';

@Component({
    components: {
        FormWrapper,
        ModalFormProfileUnlock,
    },
    computed: {
        ...mapGetters({
            currentAccount: 'account/currentAccount',
            currentRecipient: 'account/currentRecipient',
            linkedAddress: 'namespace/linkedAddress',
        }),
    },
})
export class MessageDisplayTs extends Vue {
    @Prop({
        default: null,
    })
    message: Message;
    @Prop({
        default: null,
    })
    incoming: boolean;
    @Prop({
        default: null,
    })
    recipient: UnresolvedAddress;
    @Prop({
        default: true,
    })
    unannounced: boolean;
    @Prop({
        default: null,
    })
    signer: PublicAccount;

    private isEncrypted = false;
    private messageDisplay = '';
    private showUnlockAccountModal = false;
    private decryptedMessage: PlainMessage;
    private currentRecipient: PublicAccount;
    private linkedAddress: Address | null;
    private currentAccount: AccountModel;

    /**
     * Hook called when the component is mounted
     * @return {void}
     */
    public created() {
        // - load transaction details
        this.loadDetails();
    }

    /**
     * Load transaction details
     * @return {Promise<void>}
     */
    protected async loadDetails(): Promise<void> {
        this.isEncrypted = this.message.type === MessageType.EncryptedMessage;
        if (this.isEncrypted) {
            this.messageDisplay = this.unannounced ? `${this.message.payload} (${this.$t('encrypted_message')})` : '******';
        } else {
            this.messageDisplay = this.message.payload;
        }
    }

    /**
     * Hook called when the account has been unlocked
     * @param {Account} account
     * @return {boolean}
     */
    protected onAccountUnlocked(account: Account) {
        this.hasAccountUnlockModal = false;
        if (this.recipient instanceof NamespaceId) {
            this.$store.dispatch('namespace/GET_LINKED_ADDRESS', this.recipient).then(() => {
                if (this.linkedAddress) {
                    this.decryptMessage(account.privateKey, this.linkedAddress);
                } else {
                    this.$store.dispatch('notification/ADD_ERROR', this.$t(NotificationType.RECIPIENT_LINKED_ADDRESS_INVALID));
                }
            });
        } else {
            this.decryptMessage(account.privateKey, this.recipient);
        }
    }

    /**
     * Getter for modal visability property
     */
    protected get hasAccountUnlockModal(): boolean {
        return this.showUnlockAccountModal;
    }

    /**
     * Setter for modal visability property
     */
    protected set hasAccountUnlockModal(f: boolean) {
        this.showUnlockAccountModal = f;
    }

    /**
     * Get decrypted message
     * @param privateKey Current account private key
     * @param recipient: recipient address.
     */
    private decryptMessage(privateKey: string, recipient: Address) {
        /**
         * If transaction recipient === current account use signer to decrypt message
         * Otherwise use the recipient for decryption
         * */

        if (recipient.plain() === this.currentAccount.address) {
            this.decryptedMessage = EncryptedMessage.decrypt(this.message, privateKey, this.signer);
            this.isEncrypted = false;
            this.messageDisplay = this.decryptedMessage.payload;
        } else {
            this.$store.dispatch('account/GET_RECIPIENT', this.recipient as Address).then(() => {
                this.decryptedMessage = EncryptedMessage.decrypt(this.message, privateKey, this.currentRecipient);
                this.isEncrypted = false;
                this.messageDisplay = this.decryptedMessage.payload;
            });
        }
    }
}
