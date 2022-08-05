/*
 * (C) Symbol Contributors 2022
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
import MessageDisplay from '@/components/MessageDisplay/MessageDisplay.vue';
import { MessageDisplayTs } from '@/components/MessageDisplay/MessageDisplayTs';
import { NotificationType } from '@/core/utils/NotificationType';
import { getComponent } from '@MOCKS/Components';
import { WalletsModel1, account1 } from '@MOCKS/Accounts';
import { Account, Address, EncryptedMessage, NamespaceId, PlainMessage, PublicAccount, UnresolvedAddress } from 'symbol-sdk';

type Props = InstanceType<typeof MessageDisplayTs>['$props'];

describe('components/MessageDisplay', () => {
    const networkType = 152;
    const defaultRecipientPublicAccount = Account.generateNewAccount(networkType).publicAccount;

    const getMessageDisplayWrapper = (
        props: Props,
        recipientPublicAccount = defaultRecipientPublicAccount,
        linkedAddress: null | Address = null,
        dispatch?: () => any,
    ) => {
        const mockStore = {
            account: {
                namespaced: true,
                getters: {
                    currentAccount: () => WalletsModel1,
                    currentRecipient: () => recipientPublicAccount,
                },
            },
            namespace: {
                namespaced: true,
                getters: {
                    linkedAddress: () => linkedAddress,
                },
            },
        };

        return getComponent(MessageDisplay, mockStore, {}, props, {}, dispatch);
    };

    describe('loadDetails()', () => {
        const runLoadDetailsTest = async (
            unannounced: boolean,
            message: PlainMessage | EncryptedMessage,
            expectedMessageDisplay: string,
        ) => {
            // Arrange:
            const props = {
                message,
                unannounced,
            };
            const mockT = jest.fn().mockImplementation((_) => _);

            // Act:
            const wrapper = getMessageDisplayWrapper(props);
            const vm = wrapper.vm as MessageDisplayTs;
            vm['$t'] = mockT;
            vm['loadDetails']();
            const messageDisplay = vm['messageDisplay'];

            // Assert:
            expect(messageDisplay).toBe(expectedMessageDisplay);
        };

        test('message is encrypted and tx is unannounced', async () => {
            // Arrange:
            const unannounced = true;
            const message = EncryptedMessage.create('message', account1.publicAccount, account1.privateKey);
            const expectedMessageDisplay = `${message.payload} (encrypted_message)`;

            // Act + Assert:
            await runLoadDetailsTest(unannounced, message, expectedMessageDisplay);
        });

        test('message is encrypted and tx is announced', async () => {
            // Arrange:
            const unannounced = false;
            const message = EncryptedMessage.create('message', account1.publicAccount, account1.privateKey);
            const expectedMessageDisplay = '******';

            // Act + Assert:
            await runLoadDetailsTest(unannounced, message, expectedMessageDisplay);
        });

        test('message is unencrypted', async () => {
            // Arrange:
            const unannounced = false;
            const message = PlainMessage.create('message');
            const expectedMessageDisplay = 'message';

            // Act + Assert:
            await runLoadDetailsTest(unannounced, message, expectedMessageDisplay);
        });
    });

    describe('onAccountUnlocked()', () => {
        const runUnlockAccountTest = async (
            recipient: UnresolvedAddress,
            linkedAddress: Address | null,
            decryptAddress: Address | null,
            expectations: {
                getLinkedAddressToBeDispatched: boolean;
                addErrorToBeDispatched: boolean;
                decryptMessageToBeCalled: boolean;
            },
        ) => {
            // Arrange:
            const currentAccount = account1;
            const message = PlainMessage.create('message');
            const unannounced = false;
            const props = {
                message,
                recipient,
                unannounced,
            };
            const mockDispatch = jest.fn().mockImplementation(() => Promise.resolve());
            const mockDecryptMessage = jest.fn();
            const mockT = jest.fn().mockImplementation((_) => _);

            // Act:
            const wrapper = getMessageDisplayWrapper(props, null, linkedAddress, mockDispatch);
            const vm = wrapper.vm as MessageDisplayTs;
            vm['decryptMessage'] = mockDecryptMessage;
            vm['$t'] = mockT;
            vm['onAccountUnlocked'](currentAccount);
            await new Promise(process.nextTick);

            // Assert:
            if (expectations.getLinkedAddressToBeDispatched) {
                expect(mockDispatch).toHaveBeenNthCalledWith(1, 'namespace/GET_LINKED_ADDRESS', recipient);
            } else {
                expect(mockDispatch).not.toHaveBeenNthCalledWith(1, 'namespace/GET_LINKED_ADDRESS', recipient);
            }

            if (expectations.addErrorToBeDispatched) {
                expect(mockDispatch).toHaveBeenNthCalledWith(
                    2,
                    'notification/ADD_ERROR',
                    NotificationType.RECIPIENT_LINKED_ADDRESS_INVALID,
                );
            } else {
                expect(mockDispatch).not.toHaveBeenNthCalledWith(
                    2,
                    'notification/ADD_ERROR',
                    NotificationType.RECIPIENT_LINKED_ADDRESS_INVALID,
                );
            }

            if (expectations.decryptMessageToBeCalled) {
                expect(mockDecryptMessage).toBeCalledWith(currentAccount.privateKey, decryptAddress);
            } else {
                expect(mockDecryptMessage).not.toBeCalledWith(currentAccount.privateKey, decryptAddress);
            }
        };

        test('recipient is instance of NamespaceId and linkedAddress is provided', async () => {
            // Arrange:
            const recipient = new NamespaceId([929036875, 2226345261]);
            const linkedAddress = account1.address;
            const decryptAddress = linkedAddress;

            // Act + Assert:
            await runUnlockAccountTest(recipient, linkedAddress, decryptAddress, {
                getLinkedAddressToBeDispatched: true,
                addErrorToBeDispatched: false,
                decryptMessageToBeCalled: true,
            });
        });

        test('recipient is instance of NamespaceId and no linkedAddress is provided', async () => {
            // Arrange:
            const recipient = new NamespaceId([929036875, 2226345261]);
            const linkedAddress = null;
            const decryptAddress = null;

            // Act + Assert:
            await runUnlockAccountTest(recipient, linkedAddress, decryptAddress, {
                getLinkedAddressToBeDispatched: true,
                addErrorToBeDispatched: true,
                decryptMessageToBeCalled: false,
            });
        });

        test('recipient is instance of Address', async () => {
            // Arrange:
            const recipient = account1.address;
            const linkedAddress = null;
            const decryptAddress = account1.address;

            // Act + Assert:
            await runUnlockAccountTest(recipient, linkedAddress, decryptAddress, {
                getLinkedAddressToBeDispatched: false,
                addErrorToBeDispatched: false,
                decryptMessageToBeCalled: true,
            });
        });
    });

    describe('decryptMessage()', () => {
        const runDecryptMessageTest = async (signer: PublicAccount, recipient: PublicAccount) => {
            // Arrange:
            const currentAccount = account1;
            const message = EncryptedMessage.create('message', recipient, currentAccount.privateKey);
            const expectedDecryptedMessage = PlainMessage.create('message');
            const props = {
                message,
                signer,
                recipient: recipient.address,
            };
            const dispatch = jest.fn().mockImplementation(() => {
                return Promise.resolve();
            });

            // Act:
            const vm = getMessageDisplayWrapper(props, recipient, null, dispatch).vm as MessageDisplayTs;
            vm['decryptMessage'](currentAccount.privateKey, recipient.address);
            await vm.$nextTick();

            // Assert:
            expect(vm['isEncrypted']).toBe(false);
            expect(vm['decryptedMessage']).toStrictEqual(expectedDecryptedMessage);
            expect(vm['messageDisplay']).toBe(expectedDecryptedMessage.payload);
        };

        test('recipient is current account', async () => {
            // Arrange:
            const signer = account1.publicAccount;
            const recipient = signer;

            // Act + Assert:
            await runDecryptMessageTest(signer, recipient);
        });

        test('recipient is random account', async () => {
            // Arrange:
            const signer = account1.publicAccount;
            const recipient = Account.generateNewAccount(networkType).publicAccount;

            // Act + Assert:
            await runDecryptMessageTest(signer, recipient);
        });
    });
});
