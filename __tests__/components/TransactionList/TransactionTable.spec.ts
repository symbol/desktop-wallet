import TransactionTable from '@/components/TransactionList/TransactionTable/TransactionTable.vue';
import { TransactionTableTs } from '@/components/TransactionList/TransactionTable/TransactionTableTs';
import Transaction from '@/store/Transaction';
import { getComponent } from '@MOCKS/Components';
import TransactionListHeader from '@/components/TransactionList/TransactionListHeader/TransactionListHeader.vue';

describe('TransactionList/TransactionTable', () => {
    const getTransactionTableWrapper = (state = {}, props = {}) => {
        return getComponent(
            TransactionTable,
            {
                transaction: Transaction,
            },
            state,
            props,
            { Spin: true },
        );
    };

    test('renders table header', () => {
        // Arrange:
        const wrapper = getTransactionTableWrapper(
            {
                isFetchingTransactions: false,
                currentConfirmedPage: '2',
            },
            { transactions: [] },
        );

        // Act + Assert:
        expect(wrapper.findComponent(TransactionListHeader).exists()).toBe(true);
    });

    describe('isFetchingMoreTransactions', () => {
        const runBasicIsFetchingMoreTransactionsTest = (wrapper, expectedResult) => {
            // Arrange:
            const vm = wrapper.vm as TransactionTableTs;

            // Act:
            // @ts-ignore
            const result = vm.isFetchingMoreTransactions;

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('returns true when isFetchingTransactions is true and page number more than 1', () => {
            // Arrange:
            const wrapper = getTransactionTableWrapper(
                {
                    isFetchingTransactions: true,
                    currentConfirmedPage: {
                        pageNumber: 2,
                        isLastPage: false,
                    },
                },
                { transactions: [] },
            );

            runBasicIsFetchingMoreTransactionsTest(wrapper, true);
        });

        test('returns false when isFetchingTransactions is false and page number less than 1', () => {
            // Arrange:
            const wrapper = getTransactionTableWrapper(
                {
                    isFetchingTransactions: false,
                    currentConfirmedPage: {
                        pageNumber: 1,
                        isLastPage: false,
                    },
                },
                { transactions: [] },
            );

            runBasicIsFetchingMoreTransactionsTest(wrapper, false);
        });
    });

    describe('infiniteScrollDisabled', () => {
        const runBasicInfiniteScrollDisabledTest = (wrapper, expectedResult) => {
            // Arrange:
            const vm = wrapper.vm as TransactionTableTs;

            // Act:
            // @ts-ignore
            const result = vm.infiniteScrollDisabled;

            // Assert:
            expect(result).toBe(expectedResult);
        };

        test('returns true when paginationType is not scroll', () => {
            // Arrange:
            const wrapper = getTransactionTableWrapper(
                {
                    isFetchingTransactions: false,
                },
                { transactions: [], paginationType: 'pagination' },
            );

            runBasicInfiniteScrollDisabledTest(wrapper, true);
        });

        test('returns false when paginationType is scroll', () => {
            // Arrange:
            const wrapper = getTransactionTableWrapper(
                {
                    isFetchingTransactions: false,
                },
                { transactions: [], paginationType: 'scroll' },
            );

            runBasicInfiniteScrollDisabledTest(wrapper, false);
        });
    });
});
