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
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';
import { TransactionDetailsTs } from '@/components/TransactionDetails/TransactionDetailsTs';
import { getComponent } from '@MOCKS/Components';
import TransactionDetailsHeader from '@/components/TransactionDetailsHeader/TransactionDetailsHeader.vue';
import DetailView from '@/components/TransactionDetails/DetailView.vue';
import {
    TransferTransaction,
    Deadline,
    EmptyMessage,
    NetworkType,
    UInt64,
    PublicAccount,
    Mosaic,
    AggregateTransaction,
    TransactionInfo,
    Address,
    TransactionType,
    InnerTransaction,
    Message,
} from 'symbol-sdk';
import { getTestAccount, WalletsModel1 } from '@MOCKS/Accounts';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';

describe('components/TransactionDetails', () => {
    const currentSigner = getTestAccount('remoteTestnet');

    const mockSignature =
        'F4E954AEC49B99E2773A3B05273A31BE25683F852559CF11BDB61DE47195D82BC5DE9ED61C966F1668769CE782F8673E7F0C65099D967E3E806EE9AD27F3D70D';
    const mockDeadline = Deadline.createFromDTO('1');
    const mockMerkleComponentHash = '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7';
    const mockTimestamp = UInt64.fromUint(1);
    const mockFeeMultiplier = 100;

    const dispatch = jest.fn();

    const createMockTransferTransaction = (mosaics: Mosaic[] = [], message: Message = EmptyMessage) => {
        return new TransferTransaction(
            NetworkType.TEST_NET,
            1,
            mockDeadline,
            UInt64.fromUint(10),
            Address.createFromPublicKey(WalletsModel1.publicKey, NetworkType.TEST_NET),
            mosaics,
            message,
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
            new TransactionInfo(
                UInt64.fromUint(2),
                0,
                '1',
                mockTimestamp,
                mockFeeMultiplier,
                '3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD',
            ),
        );
    };

    const createMockAggregateTransaction = (
        innerTransactions: InnerTransaction[] = [],
        merkleComponentHash: string = mockMerkleComponentHash,
    ) => {
        return new AggregateTransaction(
            NetworkType.TEST_NET,
            TransactionType.AGGREGATE_BONDED,
            1,
            mockDeadline,
            UInt64.fromUint(100),
            innerTransactions,
            [],
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
            new TransactionInfo(
                UInt64.fromUint(2),
                0,
                '1',
                mockTimestamp,
                mockFeeMultiplier,
                '3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD',
                merkleComponentHash,
            ),
        );
    };

    const getTransactionDetailsWrapper = (props = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { networkConfiguration: undefined },
            getters: {
                networkConfiguration: () => Object.assign(new NetworkConfigurationModel(), { epochAdjustment: 1573430400 }),
            },
        };

        return getComponent(
            TransactionDetails,
            {
                network: mockNetworkStore,
            },
            {},
            props,
            {},
            dispatch,
        );
    };

    describe('views', () => {
        const runBasicTransactionDetailViewTests = (transaction, { expectedDetailSectionTitleDisplay, expectedNumberOfDetailView }) => {
            // Arrange:
            const wrapper = getTransactionDetailsWrapper({
                transaction,
            });

            // Act + Assert:
            expect(wrapper.findComponent(TransactionDetailsHeader)).toBeDefined();
            expect(wrapper.find('.transaction-details-detail-section-title-container').exists()).toBe(expectedDetailSectionTitleDisplay);
            expect(wrapper.findAllComponents(DetailView).length).toBe(expectedNumberOfDetailView);
        };

        test('returns empty when transaction does not exists', () => {
            // Arrange:
            const wrapper = getTransactionDetailsWrapper({});

            // Act + Assert:
            expect(wrapper.find('.transaction-details-main-container').exists()).toBe(false);
        });

        test('returns single detail view when transaction type is not aggregate transaction', () => {
            runBasicTransactionDetailViewTests(createMockTransferTransaction(), {
                expectedDetailSectionTitleDisplay: false,
                expectedNumberOfDetailView: 1,
            });
        });

        test('returns multiple detail view when transaction type is aggregate transaction', () => {
            runBasicTransactionDetailViewTests(
                createMockAggregateTransaction([createMockTransferTransaction(), createMockTransferTransaction()]),
                {
                    expectedDetailSectionTitleDisplay: true,
                    expectedNumberOfDetailView: 2,
                },
            );
        });
    });

    describe('refreshAggregateTransaction', () => {
        test('set aggregateTransaction property when transaction type is aggregate transaction', async () => {
            // Arrange:
            const mockTransaction = createMockAggregateTransaction([createMockTransferTransaction()]);

            const wrapper = getTransactionDetailsWrapper({
                transaction: mockTransaction,
            });

            const vm = wrapper.vm as TransactionDetailsTs;

            // Act:
            await vm.refreshAggregateTransaction();

            // Assert:
            expect(vm.aggregateTransaction).toEqual(mockTransaction);
            expect(vm.$store.dispatch).not.toBeCalledWith('transaction/LOAD_TRANSACTION_DETAILS');
        });

        test("store dispatch 'transaction/LOAD_TRANSACTION_DETAILS' when inner transactions is missing", async () => {
            // Arrange:
            const mockTransaction = createMockAggregateTransaction();

            const wrapper = getTransactionDetailsWrapper({
                transaction: mockTransaction,
            });

            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/LOAD_TRANSACTION_DETAILS') {
                    return Promise.resolve(mockTransaction);
                }
            });

            const vm = wrapper.vm as TransactionDetailsTs;

            // Act:
            await vm.refreshAggregateTransaction();

            // Assert:
            expect(vm.$store.dispatch).toBeCalledWith('transaction/LOAD_TRANSACTION_DETAILS', {
                group: 'confirmed',
                transactionHash: '3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD',
            });
            expect(vm.aggregateTransaction).toEqual(mockTransaction);
        });

        test('skip set aggregateTransaction property when inner transaction and transactionInfo is missing', async () => {
            // Arrange:
            const mockTransaction = new AggregateTransaction(
                NetworkType.TEST_NET,
                TransactionType.AGGREGATE_BONDED,
                1,
                mockDeadline,
                UInt64.fromUint(100),
                [],
                [],
                mockSignature,
                PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
            );

            const wrapper = getTransactionDetailsWrapper({
                transaction: mockTransaction,
            });

            const vm = wrapper.vm as TransactionDetailsTs;

            // Act:
            await vm.refreshAggregateTransaction();

            // Assert:
            expect(vm.aggregateTransaction).toEqual(null);
            expect(vm.$store.dispatch).not.toBeCalledWith('transaction/LOAD_TRANSACTION_DETAILS');
        });
    });
});
