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
import TransactionOptinPayoutDetails from '@/components/TransactionDetails/TransactionOptinPayoutDetails.vue';
import { getComponent } from '@MOCKS/Components';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { getTestAccount, WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { TransactionGroupEnum } from 'symbol-openapi-typescript-fetch-client';
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
    MultisigAccountModificationTransaction,
    MosaicId,
    Message,
    PlainMessage,
    TransactionStatus,
} from 'symbol-sdk';
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';

describe('components/TransactionDetails/TransactionOptinPayoutDetails', () => {
    const currentSigner = getTestAccount('remoteTestnet');

    const mockSignature =
        'F4E954AEC49B99E2773A3B05273A31BE25683F852559CF11BDB61DE47195D82BC5DE9ED61C966F1668769CE782F8673E7F0C65099D967E3E806EE9AD27F3D70D';
    const mockDeadline = Deadline.createFromDTO('1');
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

    const createMockAggregateTransaction = (innerTransactions: InnerTransaction[] = []) => {
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
                '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7',
            ),
        );
    };

    const createMockMultisigAccountModificationTransaction = () => {
        return new MultisigAccountModificationTransaction(
            NetworkType.TEST_NET,
            1,
            mockDeadline,
            UInt64.fromUint(100),
            2,
            1,
            [],
            [],
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
        );
    };

    const getTransactionOptinPayoutDetailsWrapper = (props = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { networkConfiguration: undefined },
            getters: {
                networkConfiguration: () => Object.assign(new NetworkConfigurationModel(), { epochAdjustment: 1573430400 }),
            },
        };

        return getComponent(
            TransactionOptinPayoutDetails,
            {
                network: mockNetworkStore,
            },
            {},
            props,
            {
                Spin: true,
            },
            dispatch,
        );
    };

    describe('component title', () => {
        test('renders title, amount and description label', async () => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction(),
            });

            // @ts-ignore
            jest.spyOn(wrapper.vm, 'hasTransfers', 'get').mockReturnValue(true);

            await wrapper.vm.$nextTick();

            // Act + Assert:
            expect(wrapper.find('.title-text').text()).toBe('Post-launch opt-in');
            expect(wrapper.find('.content-text.text-description').text()).toBe('Success! Your opt-in payment is complete.');
            expect(wrapper.find('table .table-header-text').text()).toBe('The amount you have received:');
        });
    });

    describe('referenceInnerTransactions', () => {
        const runNoReferenceInnerTransactionsTests = (currentAccount, innerTransactions) => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount,
                transaction: createMockAggregateTransaction(innerTransactions),
            });

            // Act + Assert:
            // @ts-ignore
            expect(wrapper.vm.referenceInnerTransactions).toEqual([]);
            // @ts-ignore
            expect(wrapper.vm.hasTransfers).toBe(false);
            expect(wrapper.find('table').exists()).toBe(false);
        };

        test('returns transaction when transfer transaction included mosaic', () => {
            // Arrange:
            const transferTransaction = createMockTransferTransaction([new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(0))]);

            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([transferTransaction, createMockMultisigAccountModificationTransaction()]),
            });

            // Act:
            // @ts-ignore
            const transactions = wrapper.vm.referenceInnerTransactions;

            // Assert:
            expect(transactions.length).toBe(1);
            expect(transactions[0]).toEqual(transferTransaction);
            // @ts-ignore
            expect(wrapper.vm.hasTransfers).toBe(true);
            expect(wrapper.find('table').exists()).toBe(true);
        });

        test('returns an empty array when transaction type is not transfer transaction', () => {
            runNoReferenceInnerTransactionsTests(WalletsModel1, [createMockMultisigAccountModificationTransaction()]);
        });

        test('returns an empty array when the transfer transaction does not include mosaic', () => {
            runNoReferenceInnerTransactionsTests(WalletsModel1, [createMockTransferTransaction()]);
        });

        test("returns an empty array when the transaction's recipient is not current account", () => {
            // Arrange:
            const transferTransaction = createMockTransferTransaction([new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(0))]);

            runNoReferenceInnerTransactionsTests(WalletsModel2, [transferTransaction]);
        });
    });

    describe('transferredMosaics', () => {
        const runBasicTransferredMosaicsTests = (mockMosaics, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([createMockTransferTransaction(mockMosaics)]),
            });

            // Act + Assert:
            // @ts-ignore
            expect(wrapper.vm.transferredMosaics).toEqual(expectedResult);
        };

        test('returns first mosaic when transaction attached mosaics', () => {
            // Arrange:
            const mockFirstMosaic = new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(10));
            const mockSecondMosaic = new Mosaic(new MosaicId('119C8A107ACADD5F'), UInt64.fromUint(10));

            runBasicTransferredMosaicsTests([mockFirstMosaic, mockSecondMosaic], [mockFirstMosaic]);
        });

        test('returns empty mosaic when transaction not attached mosaics', () => {
            runBasicTransferredMosaicsTests([], []);
        });
    });

    describe('amount', () => {
        const runBasicAmountTests = (mockMosaics, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([createMockTransferTransaction(mockMosaics)]),
            });

            // Act + Assert:
            // @ts-ignore
            expect(wrapper.vm.amount).toEqual(expectedResult);
            expect(wrapper.findComponent(MosaicAmountDisplay)).toBeDefined();
        };

        test('returns 0 when transferredMosaics is empty', () => {
            runBasicAmountTests([], UInt64.fromUint(0));
        });

        test('returns amount when transferredMosaics contain mosaics', () => {
            // Arrange:
            const mockMosaic = new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(10));

            runBasicAmountTests([mockMosaic], UInt64.fromUint(10));
        });

        test('hide MosaicAmountDisplay when amount is null', () => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([createMockTransferTransaction()]),
            });

            // Act + Assert:
            expect(wrapper.findComponent(MosaicAmountDisplay).exists()).toBe(false);
        });
    });

    describe('mosaicId', () => {
        const runBasicMosaicIdTests = (mockMosaics, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([createMockTransferTransaction(mockMosaics)]),
            });

            // Act + Assert:
            // @ts-ignore
            expect(wrapper.vm.mosaicId).toEqual(expectedResult);
        };

        test('returns first mosaic id when transferredMosaics is not empty', () => {
            // Arrange:
            const mockFirstMosaic = new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(10));
            const mockSecondMosaic = new Mosaic(new MosaicId('119C8A107ACADD5F'), UInt64.fromUint(10));

            runBasicMosaicIdTests([mockFirstMosaic, mockSecondMosaic], new MosaicId('461A9811A1DC1FBB'));
        });

        test('returns undefined when transferredMosaics is empty', () => {
            runBasicMosaicIdTests([], undefined);
        });
    });

    describe('NISAddresses', () => {
        const runBasicNISAddressesTests = (message, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([
                    createMockTransferTransaction([new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(0))], message),
                ]),
            });

            // Act:
            // @ts-ignore
            const addresses = wrapper.vm.NISAddresses;
            const addressComponent = wrapper.find('.address-text');

            // Assert:
            expect(addresses).toEqual(expectedResult);

            if (expectedResult.length > 0) {
                expect(addressComponent.text()).toBe(expectedResult[0]);
                expect(addressComponent.exists()).toBe(true);
            } else {
                expect(addressComponent.exists()).toBe(false);
            }
        };

        test('returns empty array when throw error', () => {
            runBasicNISAddressesTests(PlainMessage.create('test'), []);
        });

        test('returns addresses when message payload contain NIS address', () => {
            runBasicNISAddressesTests(PlainMessage.create('{"nisAddress": "NAXFMZKDIR2IX4BLY2VIWEYJ4OF5VHCBSDGNSHWM"}'), [
                'NAXFMZKDIR2IX4BLY2VIWEYJ4OF5VHCBSDGNSHWM',
            ]);
        });
    });

    describe('fetchTransactionDetails', () => {
        let mockTransaction, wrapper;

        beforeEach(() => {
            mockTransaction = createMockAggregateTransaction([createMockTransferTransaction([])]);

            wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: mockTransaction,
            });
        });

        test('calls store dispatch "transaction/LOAD_TRANSACTION_DETAILS" when transaction status confirmed', async () => {
            // Arrange:
            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/FETCH_TRANSACTION_STATUS') {
                    return Promise.resolve(new TransactionStatus(TransactionGroupEnum.Confirmed, '1', mockDeadline));
                } else if (type === 'transaction/LOAD_TRANSACTION_DETAILS') {
                    return Promise.resolve(mockTransaction);
                }
            });

            // Act:
            // @ts-ignore
            await wrapper.vm.fetchTransactionDetails();

            // Assert:
            expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('transaction/FETCH_TRANSACTION_STATUS', {
                transactionHash: mockTransaction.transactionInfo.hash,
            });
            expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('transaction/LOAD_TRANSACTION_DETAILS', {
                group: TransactionGroupEnum.Confirmed,
                transactionHash: mockTransaction.transactionInfo.hash,
            });
        });

        test('skips store dispatch "transaction/LOAD_TRANSACTION_DETAILS" when transaction status failed', async () => {
            // Arrange:
            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/FETCH_TRANSACTION_STATUS') {
                    return Promise.resolve(new TransactionStatus(TransactionGroupEnum.Failed, '1', mockDeadline));
                } else if (type === 'transaction/LOAD_TRANSACTION_DETAILS') {
                    return Promise.resolve(mockTransaction);
                }
            });

            // Act:
            // @ts-ignore
            await wrapper.vm.fetchTransactionDetails();

            // Assert:
            expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('transaction/FETCH_TRANSACTION_STATUS', {
                transactionHash: mockTransaction.transactionInfo.hash,
            });

            expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalledWith('transaction/LOAD_TRANSACTION_DETAILS');
        });

        test('throw error when fetch transaction details failed', async () => {
            // Arrange:
            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/FETCH_TRANSACTION_STATUS') {
                    return Promise.reject(new Error('error'));
                }
            });

            // Act:
            // @ts-ignore
            await wrapper.vm.fetchTransactionDetails();

            // Assert:
            expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalledWith('transaction/FETCH_TRANSACTION_STATUS');
            expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalledWith('transaction/LOAD_TRANSACTION_DETAILS');
        });
    });

    describe('onDetailsClick', () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const runOnDetailsClickTests = async (onDetailsClickStatus, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionOptinPayoutDetailsWrapper({
                currentAccount: WalletsModel1,
                transaction: createMockAggregateTransaction([createMockTransferTransaction([])]),
            });

            // @ts-ignore
            wrapper.vm.isDetailsShown = onDetailsClickStatus;
            // @ts-ignore
            wrapper.vm.isExpanded = onDetailsClickStatus;

            // Act:
            // @ts-ignore
            wrapper.vm.onDetailsClick();

            jest.runAllTimers();

            await wrapper.vm.$nextTick();

            // Assert:
            // @ts-ignore
            expect(wrapper.vm.isDetailsShown).toBe(expectedResult);
            // @ts-ignore
            expect(wrapper.vm.isExpanded).toBe(expectedResult);
            expect(wrapper.findComponent(TransactionDetails).exists()).toBe(expectedResult);
        };

        test('renders TransactionDetails component when click for open', async () => {
            await runOnDetailsClickTests(false, true);
        });

        test('hide TransactionDetails component when click for close', async () => {
            await runOnDetailsClickTests(true, false);
        });
    });
});
