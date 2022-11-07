import TransactionList from '@/components/TransactionList/TransactionList.vue';
import { TransactionListTs } from '@/components/TransactionList/TransactionListTs';
import { getComponent } from '@MOCKS/Components';
import { simpleWallet1, WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { Signer } from '@/store/Account';
import { AddressBook } from 'symbol-address-book';
import {
    TransferTransaction,
    Deadline,
    EmptyMessage,
    NetworkType,
    MosaicId,
    UInt64,
    PublicAccount,
    AggregateTransaction,
    TransactionInfo,
    Address,
    TransactionType,
} from 'symbol-sdk';

describe('components/TransactionList', () => {
    const mockSignature =
        'F4E954AEC49B99E2773A3B05273A31BE25683F852559CF11BDB61DE47195D82BC5DE9ED61C966F1668769CE782F8673E7F0C65099D967E3E806EE9AD27F3D70D';
    const mockDeadline = Deadline.createFromDTO('1');
    const mockTimestamp = UInt64.fromUint(1);
    const mockFeeMultiplier = 100;

    const mockSignerAddress = PublicAccount.createFromPublicKey(WalletsModel1.publicKey, NetworkType.TEST_NET);

    const mockTransactionHash = '3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD';
    const mockMerkleComponentHash = '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7';

    const mockTransactionInfo = new TransactionInfo(
        UInt64.fromUint(2),
        0,
        '1',
        mockTimestamp,
        mockFeeMultiplier,
        mockTransactionHash,
        mockMerkleComponentHash,
    );

    const createMockTransferTransaction = (signerPublicAccount: PublicAccount = mockSignerAddress) => {
        return new TransferTransaction(
            NetworkType.TEST_NET,
            1,
            mockDeadline,
            UInt64.fromUint(10),
            Address.createFromPublicKey(WalletsModel1.publicKey, NetworkType.TEST_NET),
            [],
            EmptyMessage,
            mockSignature,
            signerPublicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, '1', mockTimestamp, mockFeeMultiplier, mockTransactionHash, mockMerkleComponentHash),
        );
    };

    const createMockAggregateTransaction = (transactionInfo: TransactionInfo = mockTransactionInfo) => {
        return new AggregateTransaction(
            NetworkType.TEST_NET,
            TransactionType.AGGREGATE_BONDED,
            1,
            mockDeadline,
            UInt64.fromUint(100),
            [],
            [],
            mockSignature,
            mockSignerAddress,
            transactionInfo,
        );
    };

    const getTransactionListWrapper = (state = {}, props = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { generationHash: undefined },
            getters: {
                generationHash: (state) => {
                    return state.generationHash;
                },
            },
        };

        const mockMosaicStore = {
            namespaced: true,
            state: {
                networkMosaicId: null,
            },
            getters: {
                networkMosaic: (state) => {
                    return new MosaicId(state.networkMosaicId);
                },
            },
        };

        const mockAccountStore = {
            namespaced: true,
            state: {
                currentAccount: null,
                currentAccountSigner: null,
            },
            getters: {
                currentAccount: (state) => {
                    return state.currentAccount;
                },
                currentAccountSigner: (state) => {
                    return state.currentAccountSigner;
                },
            },
        };

        const mockTransactionStore = {
            namespaced: true,
            state: {
                filteredTransactions: [],
                currentConfirmedPage: { pageNumber: 1, isLastPage: false },
                isBlackListFilterActivated: false,
            },
            getters: {
                filteredTransactions: (state) => state.filteredTransactions,
                currentConfirmedPage: (state) => state.currentConfirmedPage,
                isBlackListFilterActivated: (state) => state.isBlackListFilterActivated,
            },
        };

        const mockAddressBookStore = {
            namespaced: true,
            state: {
                addressBook: new AddressBook(),
            },
            getters: {
                getAddressBook: (state) => state.addressBook,
            },
        };

        const mocks = {
            $route: {
                params: {
                    transaction: undefined,
                },
            },
            $router: {
                push: jest.fn(),
            },
        };

        return getComponent(
            TransactionList,
            {
                account: mockAccountStore,
                mosaic: mockMosaicStore,
                network: mockNetworkStore,
                transaction: mockTransactionStore,
                addressBook: mockAddressBookStore,
            },
            state,
            props,
            undefined,
            undefined,
            mocks,
        );
    };

    // Todo: unit test for created hook
    // Todo: checkUnspentHashLocks, unable test on setInterval

    describe('countPages', () => {
        test('returns 0 when transaction exists', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                filteredTransactions: [],
            });

            const vm = wrapper.vm as TransactionListTs;

            // Act + Assert:
            expect(vm.countPages).toBe(0);
            expect(vm.totalCountItems).toBe(0);
        });

        test('returns page number when transaction exists', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                filteredTransactions: [createMockTransferTransaction(), createMockTransferTransaction()],
            });

            const vm = wrapper.vm as TransactionListTs;

            // Act + Assert:
            expect(vm.countPages).toBe(1);
            expect(vm.totalCountItems).toBe(2);
        });
    });

    describe('getTransaction', () => {
        const runBasicTransactionPaginationTests = (pagination, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionListWrapper(
                {
                    filteredTransactions: [createMockTransferTransaction(), createMockTransferTransaction()],
                },
                {
                    paginationType: pagination,
                    pageSize: 1,
                },
            );

            const vm = wrapper.vm as TransactionListTs;

            jest.spyOn(vm, 'getCurrentPageTransactions');

            // Act:
            const transaction = vm.getTransactions();

            // Assert:
            expect(transaction.length).toBe(expectedResult);
        };

        const runBasicBlacklistTransactionTests = (isBlackListFilterActivated) => {
            // Arrange:
            const blacklistedAddress = PublicAccount.createFromPublicKey(WalletsModel2.publicKey, NetworkType.TEST_NET);

            const addressBookMock: AddressBook = new AddressBook([
                {
                    id: '5c9093c7-2da2-476e-bc28-87f24a83cd0c',
                    address: blacklistedAddress.address.plain(),
                    name: 'Alice',
                    phone: '+34 000000000',
                    isBlackListed: true,
                },
            ]);

            const wrapper = getTransactionListWrapper({
                filteredTransactions: [createMockTransferTransaction(blacklistedAddress), createMockTransferTransaction()],
                addressBook: addressBookMock,
                isBlackListFilterActivated,
            });

            const vm = wrapper.vm as TransactionListTs;

            // Act:
            const transactions = vm.getTransactions();

            // Assert:
            if (isBlackListFilterActivated) {
                expect(transactions.length).toBe(1);
                expect(transactions[0].signer).toBe(mockSignerAddress);
            } else {
                expect(transactions.length).toBe(2);
                expect(transactions[0].signer).toBe(blacklistedAddress);
                expect(transactions[1].signer).toBe(mockSignerAddress);
            }

            transactions.forEach((tx: TransferTransaction) => {
                expect(tx.deadline).toEqual(mockDeadline);
                expect(tx.maxFee.compact()).toEqual(10);
                expect(tx.mosaics).toEqual([]);
                expect(tx.networkType).toEqual(NetworkType.TEST_NET);
                expect(tx.signature).toEqual(mockSignature);
                expect(tx.recipientAddress.plain()).toEqual('TBUYPO5DPOWXFVB7TNMDMBRFJBG5FGTXNKKZB7I');
            });
        };

        test('returns current page transactions when pagination is pagination', () => {
            runBasicTransactionPaginationTests('pagination', 1);
        });

        test('returns filtered transactions when pagination is scroll', () => {
            runBasicTransactionPaginationTests('scroll', 2);
        });

        test('returns transactions with filter by blacklisted contacts', () => {
            runBasicBlacklistTransactionTests(true);
        });

        test('returns transaction without filter by blacklisted contacts', () => {
            runBasicBlacklistTransactionTests(false);
        });
    });

    describe('aggregateTransactionHash', () => {
        test('returns aggregate transaction hash when transactionInfo exists', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper();

            const vm = wrapper.vm as TransactionListTs;

            vm.activePartialTransaction = createMockAggregateTransaction();

            // Act + Assert:
            expect(vm.aggregateTransactionHash).toBe(mockTransactionHash);
        });

        test('returns new created aggregate transaction hash when transactionInfo is missing', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                generationHash: '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155',
            });

            const vm = wrapper.vm as TransactionListTs;

            vm.activePartialTransaction = createMockAggregateTransaction(null);

            // Act + Assert:
            expect(vm.aggregateTransactionHash).toBe('A9683281822EED5D05FD99D3D9E2C12C8D8A8286012386BBFBDAEF5CE175977A');
        });
    });

    describe('transaction model', () => {
        test('open detail model when click on transfer transaction', () => {
            // Arrange:
            const transferTransaction = createMockTransferTransaction();
            const wrapper = getTransactionListWrapper({
                filteredTransactions: [transferTransaction],
            });
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.onClickTransaction(transferTransaction);

            // Assert:
            expect(vm.activeTransaction).toEqual(transferTransaction);
            expect(vm.hasDetailModal).toBe(true);
        });

        test('close detail model', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper();
            const vm = wrapper.vm as TransactionListTs;

            vm.onClickTransaction(createMockTransferTransaction());

            // Act:
            vm.onCloseDetailModal();

            // Assert:
            expect(vm.activeTransaction).toEqual(undefined);
            expect(vm.hasDetailModal).toBe(false);
        });

        test('open cosignature model when click on aggregate transaction and signature is missing', () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction();
            const wrapper = getTransactionListWrapper({
                filteredTransactions: [aggregateTransaction],
            });
            const vm = wrapper.vm as TransactionListTs;

            jest.spyOn(aggregateTransaction, 'hasMissingSignatures').mockReturnValue(true);

            // Act:
            vm.onClickTransaction(aggregateTransaction);

            // Assert:
            expect(vm.activePartialTransaction).toEqual(aggregateTransaction);
            expect(vm.hasCosignatureModal).toBe(true);
        });

        test('close cosignature model', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                filteredTransactions: [],
            });

            const vm = wrapper.vm as TransactionListTs;

            const aggregateTransaction = createMockAggregateTransaction();

            jest.spyOn(aggregateTransaction, 'hasMissingSignatures').mockReturnValue(true);

            vm.onClickTransaction(aggregateTransaction);

            // Act:
            vm.onCloseCosignatureModal();

            // Assert:
            expect(vm.activePartialTransaction).toEqual(undefined);
            expect(vm.hasCosignatureModal).toBe(false);
            expect(vm.$router.push).toHaveBeenCalledWith({ name: 'dashboard.index' });
        });
    });

    describe('loadMore', () => {
        test('called when current page is not last page', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                currentConfirmedPage: { pageNumber: 3, isLastPage: false },
            });
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.loadMore();

            // Assert:
            expect(vm.$store.dispatch).toBeCalledWith('transaction/LOAD_TRANSACTIONS', {
                pageNumber: 4,
                pageSize: 20,
            });
        });

        test('skip when current page is last page', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                currentConfirmedPage: { pageNumber: 3, isLastPage: true },
            });
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.loadMore();

            // Assert:
            expect(vm.$store.dispatch).not.toBeCalled();
        });
    });

    describe('watchRefresh', () => {
        const runWatchRefreshTests = (pageInfo, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionListWrapper();
            const vm = wrapper.vm as TransactionListTs;

            vm.currentPage = 4;

            // Act:
            vm.watchRefresh(pageInfo);

            // Assert:
            expect(vm.currentPage).toBe(expectedResult);
        };

        test('reset page info when page number in first page', () => {
            runWatchRefreshTests({ pageNumber: 1, isLastPage: false }, 1);
        });

        test('ignore reset page info when page number is not first page', () => {
            runWatchRefreshTests({ pageNumber: 3, isLastPage: false }, 4);
        });
    });

    describe('onCloseContactModal', () => {
        test('set showAddContactModal to false to close contact modal', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper();
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.onCloseContactModal();

            // Assert:
            expect(vm.showAddContactModal).toBe(false);
        });
    });

    describe('isLastPage', () => {
        test('verify current viewed page is last page', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper({
                currentConfirmedPage: { pageNumber: 1, isLastPage: true },
            });
            const vm = wrapper.vm as TransactionListTs;

            // Act: + Assert:
            expect(vm.isLastPage).toBe(true);
        });
    });

    describe('downloadTransactions', () => {
        test('open transaction export modal', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper();
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.downloadTransactions();

            // Assert:
            expect(vm.hasTransactionExportModal).toBe(true);
            expect(vm.isViewingExportModal).toBe(true);
        });
    });

    describe('onBlackListContact', () => {
        test('set show black list pop up to true', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper();
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.onBlackListContact();

            // Assert:
            expect(vm.showBlackListPopup).toBe(true);
        });
    });

    describe('onTransactionSigned', () => {
        test('returns signed transaction info when successfully signed', () => {
            // Arrange:
            const wrapper = getTransactionListWrapper();
            const vm = wrapper.vm as TransactionListTs;

            // Act:
            vm.onTransactionSigned([mockSignerAddress.address.plain(), mockTransactionHash]);

            // Assert:
            expect(vm.transactionSignerAddress).toBe(mockSignerAddress.address.plain());
            expect(vm.transactionHash).toBe(mockTransactionHash);
        });
    });

    describe('destroyed hook', () => {
        test('destroy transaction list components', () => {
            // Arrange:
            const accountSigner = {
                label: '',
                address: simpleWallet1.address,
                multisig: false,
                requiredCosigApproval: 0,
            } as Signer;

            const wrapper = getTransactionListWrapper({
                currentAccountSigner: accountSigner,
            });

            const vm = wrapper.vm as TransactionListTs;

            // Act:
            wrapper.destroy();

            // Assert:
            expect(vm.$store.commit).toBeCalledWith('transaction/isBlackListFilterActivated', false);
            expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
                filterOption: null,
                currentSignerAddress: simpleWallet1.address.plain(),
            });
        });
    });
});
