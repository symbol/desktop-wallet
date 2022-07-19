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
import ActionDisplay from '@/components/ActionDisplay/ActionDisplay.vue';
import { ActionDisplayTs } from '@/components/ActionDisplay/ActionDisplayTs';
import i18n from '@/language/index';
import { AccountState } from '@/store/Account';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import {
    Address,
    AggregateTransaction,
    Deadline,
    NamespaceId,
    NetworkType,
    PersistentHarvestingDelegationMessage,
    PlainMessage,
    PublicAccount,
    Transaction,
    TransferTransaction,
    UInt64,
} from 'symbol-sdk';

describe('components/ActionDisplay', () => {
    const account = WalletsModel1;
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentAccountAddress: undefined,
        },
        getters: {
            currentAccountAddress: (state) => {
                return state.currentAccountAddress;
            },
        },
    };

    const getActionDisplayWrapper = (stateChanges?: AccountState, transaction?: Transaction, isOptinPayoutTransaction?: boolean) => {
        const wrapper = getComponent(ActionDisplay, { account: mockAccountStore }, stateChanges, {
            transaction,
            isOptinPayoutTransaction,
        });
        return wrapper;
    };

    const testActionDisplay = (transactionDescriptionKey: string, transaction: Transaction, isOptinPayoutTransaction = false) => {
        // Arrange:
        const stateChanges = {
            currentAccountAddress: Address.createFromRawAddress(account.address),
        } as Partial<AccountState>;

        // Act:
        const wrapper = getActionDisplayWrapper(stateChanges as AccountState, transaction, isOptinPayoutTransaction);
        const component = wrapper.vm as ActionDisplayTs;

        // Assert:
        expect(component.transactionDescription).toBe(i18n.t(transactionDescriptionKey));
        expect(wrapper.find('div.overflow_ellipsis span').text()).toBe(i18n.t(transactionDescriptionKey));
    };

    test('renders action display when transaction type is Transfer', () => {
        const transaction = TransferTransaction.create(
            Deadline.create(1573430400),
            new NamespaceId('alias'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
            UInt64.fromUint(1_000_000),
            undefined,
            PublicAccount.createFromPublicKey(account.publicKey, NetworkType.TEST_NET),
        );
        testActionDisplay('transaction_descriptor_16724', transaction);
    });

    test('renders action display when transaction message type is PersistentHarvestingDelegationMessage', () => {
        const delegatedPrivateKey = '8A78C9E9B0E59D0F74C0D47AB29FBD523C706293A3FA9CD9FE0EEB2C10EA924A';
        const vrfPrivateKey = '800F35F1CC66C2B62CE9DD9F31003B9B3E5C7A2F381FB8952A294277A1015D83';
        const recipientPublicKey = '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F';

        const transaction = TransferTransaction.create(
            Deadline.create(1573430400),
            new NamespaceId('alias'),
            [],
            PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, vrfPrivateKey, recipientPublicKey, NetworkType.TEST_NET),
            NetworkType.TEST_NET,
            UInt64.fromUint(1_000_000),
            undefined,
            PublicAccount.createFromPublicKey(account.publicKey, NetworkType.TEST_NET),
        );
        testActionDisplay('transaction_descriptor_harvesting', transaction);
    });

    test('renders action display when transaction is optin payout transaction', () => {
        const deadline = Deadline.create(1573430400);
        const innerTx = TransferTransaction.create(
            deadline,
            new NamespaceId('alias'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
            UInt64.fromUint(1_000_000),
            undefined,
            PublicAccount.createFromPublicKey(account.publicKey, NetworkType.TEST_NET),
        );

        const transaction = AggregateTransaction.createBonded(
            deadline,
            [innerTx],
            NetworkType.TEST_NET,
            undefined,
            UInt64.fromUint(1_000_000),
            undefined,
            PublicAccount.createFromPublicKey(account.publicKey, NetworkType.TEST_NET),
        );
        testActionDisplay('transaction_descriptor_16961_optin', transaction, true);
    });
});
