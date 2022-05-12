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
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import i18n from '@/language';
import VueI18n from 'vue-i18n';
import iView from 'view-design';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import ModalTransactionCosignature from '@/views/modals/ModalTransactionCosignature/ModalTransactionCosignature.vue';
import { ModalTransactionCosignatureTs } from '@/views/modals/ModalTransactionCosignature/ModalTransactionCosignatureTs.ts';
import { WalletsModel1, getTestAccount } from '@MOCKS/Accounts';
import { networkMock } from '@MOCKS/network';
import { getTestProfile } from '@MOCKS/profiles';
import {
    PublicAccount,
    Address,
    NetworkType,
    TransferTransaction,
    Deadline,
    PlainMessage,
    TransactionStatus,
    Transaction,
    AggregateTransaction,
    UInt64,
} from 'symbol-sdk';
import { TransactionGroupEnum } from 'symbol-openapi-typescript-fetch-client';
import { AddressBook } from 'symbol-address-book';

const epochAdjustment = 1573430400;
const transactionHash = 'DC1C6F081A948C682874E4A70F1E251A8B5FADEAF2784E055DCF8744F3B4434D';
const currentPublicKey = WalletsModel1.publicKey;
const currentAccount = PublicAccount.createFromPublicKey(currentPublicKey, NetworkType.TEST_NET);
const router = new VueRouter();
const localVue = createLocalVue();
localVue.use(iView);
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(VueRouter);

function createAggregateBondedTransaction(signerAccount, targetAccount) {
    const transferTransaction = TransferTransaction.create(
        Deadline.create(epochAdjustment),
        signerAccount.address,
        [],
        PlainMessage.create(''),
        NetworkType.TEST_NET,
    );
    return AggregateTransaction.createBonded(
        Deadline.create(epochAdjustment),
        [transferTransaction.toAggregate(targetAccount)],
        NetworkType.TEST_NET,
        [],
        UInt64.fromUint(2000000),
        null,
        signerAccount,
    );
}

function createStore(transaction: Transaction, transactionGroup: TransactionGroupEnum, addressBook: AddressBook) {
    const accountModule = {
        namespaced: true,
        getters: {
            currentAccount: () => WalletsModel1,
            knownAccounts: () => [WalletsModel1],
            currentSigner: () => {
                return {
                    label: 'test-1',
                    address: Address.createFromRawAddress(WalletsModel1.address),
                    multisig: WalletsModel1.isMultisig,
                    requiredCosignatures: 0,
                };
            },
        },
    };
    const addressBookModule = {
        namespaced: true,
        getters: {
            getAddressBook: () => addressBook,
        },
    };
    const transactionModule = {
        namespaced: true,
        actions: {
            async FETCH_TRANSACTION_STATUS() {
                return new TransactionStatus(transactionGroup, '0', Deadline.create(epochAdjustment));
            },
            async LOAD_TRANSACTION_DETAILS() {
                return transaction;
            },
        },
    };
    const networkModule = {
        namespaced: true,
        getters: {
            currentHeight: () => 100,
            feesConfig: () => networkMock.fees,
            networkConfiguration: () => new NetworkConfigurationModel(),
            epochAdjustment: () => epochAdjustment,
            networkType: () => NetworkType.TEST_NET,
        },
    };
    const profileModule = {
        namespaced: true,
        getters: {
            currentProfile: () => getTestProfile('profile1'),
        },
    };
    const store = new Vuex.Store({
        modules: {
            account: accountModule,
            addressBook: addressBookModule,
            network: networkModule,
            profile: profileModule,
            transaction: transactionModule,
        },
    });

    store.commit = jest.fn();

    return store;
}

describe('ModalTransactionCosignature', () => {
    it('Warning should not be shown for the transaction signed by account from address book', async () => {
        // arrange
        const signerAccount = getTestAccount('cosigner1').publicAccount;
        const aggregateTransaction = createAggregateBondedTransaction(signerAccount, currentAccount);
        const addressBook = new AddressBook([
            {
                id: '0',
                name: 'Good One',
                address: signerAccount.address.plain(),
            },
        ]);

        const store = createStore(aggregateTransaction, TransactionGroupEnum.Partial, addressBook);
        const wrapper = shallowMount<ModalTransactionCosignatureTs>(ModalTransactionCosignature, {
            localVue,
            i18n,
            store,
            router,
        });

        // act
        await wrapper.setProps({ transactionHash });
        await new Promise(process.nextTick);
        const showWarningForm = wrapper.vm.showWarningForm;
        const showFormSign = wrapper.vm.showFormSign;

        // assert
        expect(showWarningForm).toBe(false);
        expect(showFormSign).toBe(true);

        wrapper.destroy();
    });

    it('Warning should be shown for the transaction signed by unknown account', async () => {
        // arrange
        const signerAccount = getTestAccount('cosigner1').publicAccount;
        const aggregateTransaction = createAggregateBondedTransaction(signerAccount, currentAccount);
        const addressBook = new AddressBook([]);

        const store = createStore(aggregateTransaction, TransactionGroupEnum.Partial, addressBook);
        const wrapper = shallowMount<ModalTransactionCosignatureTs>(ModalTransactionCosignature, {
            localVue,
            i18n,
            store,
            router,
        });

        // act
        await wrapper.setProps({ transactionHash });
        await new Promise(process.nextTick);
        const showWarningForm = wrapper.vm.showWarningForm;
        const showFormUnkownAddressOptions = wrapper.vm.showFormUnkownAddressOptions;
        const showFormUnkownAddressRejected = wrapper.vm.showFormUnkownAddressRejected;
        const showFormUnkownAddressAccepted = wrapper.vm.showFormUnkownAddressAccepted;
        const showFormSign = wrapper.vm.showFormSign;
        const showFormBlacklistedAddress = wrapper.vm.showFormBlacklistedAddress;

        // assert
        expect(showWarningForm).toBe(true);
        expect(showFormUnkownAddressOptions).toBe(true);
        expect(showFormUnkownAddressRejected).toBe(false);
        expect(showFormUnkownAddressAccepted).toBe(false);
        expect(showFormSign).toBe(false);
        expect(showFormBlacklistedAddress).toBe(false);

        wrapper.destroy();
    });

    it('Warning should be shown for the transaction signed by blocked account from address book', async () => {
        // arrange
        const signerAccount = getTestAccount('cosigner1').publicAccount;
        const aggregateTransaction = createAggregateBondedTransaction(signerAccount, currentAccount);
        const addressBook = new AddressBook([
            {
                id: '0',
                name: 'Bad One',
                address: signerAccount.address.plain(),
                isBlackListed: true,
            },
        ]);

        const store = createStore(aggregateTransaction, TransactionGroupEnum.Partial, addressBook);
        const wrapper = shallowMount<ModalTransactionCosignatureTs>(ModalTransactionCosignature, {
            localVue,
            i18n,
            store,
            router,
        });

        // act
        await wrapper.setProps({ transactionHash });
        await new Promise(process.nextTick);
        const showWarningForm = wrapper.vm.showWarningForm;
        const showFormUnkownAddressOptions = wrapper.vm.showFormUnkownAddressOptions;
        const showFormUnkownAddressRejected = wrapper.vm.showFormUnkownAddressRejected;
        const showFormUnkownAddressAccepted = wrapper.vm.showFormUnkownAddressAccepted;
        const showFormSign = wrapper.vm.showFormSign;
        const showFormBlacklistedAddress = wrapper.vm.showFormBlacklistedAddress;

        // assert
        expect(showWarningForm).toBe(true);
        expect(showFormUnkownAddressOptions).toBe(false);
        expect(showFormUnkownAddressRejected).toBe(false);
        expect(showFormUnkownAddressAccepted).toBe(false);
        expect(showFormSign).toBe(false);
        expect(showFormBlacklistedAddress).toBe(true);

        wrapper.destroy();
    });
});
