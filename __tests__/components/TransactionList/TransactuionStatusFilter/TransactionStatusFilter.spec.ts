//@ts-ignore
import TransactionStatusFilter from '@/components/TransactionList/TransactionListFilters/TransactionStatusFilter/TransactionStatusFilter.vue';
import { TransactionStatusFilterTs } from '@/components/TransactionList/TransactionListFilters/TransactionStatusFilter/TransactionStatusFilterTs';
import { getComponent } from '@MOCKS/Components';
import { getTestAccount } from '@MOCKS/Accounts';
import AccountStore from '@/store/Account';
import TransactionStore from '@/store/Transaction';
import { FilterOption, TransactionFilterOptions } from '@/store/Transaction';

describe('TransactionStatusFilter', () => {
    describe('TransactionStatusFilter', () => {
        let wrapper, vm;

        const currentSigner = getTestAccount('remoteTestnet');

        const getTransactionStatusFilterWrapper = () => {
            return getComponent(
                TransactionStatusFilter,
                { account: AccountStore, transaction: TransactionStore },
                { currentSigner: currentSigner },
                {},
                {},
            );
        };

        beforeEach(() => {
            // Arrange:
            wrapper = getTransactionStatusFilterWrapper();
            vm = wrapper.vm as TransactionStatusFilterTs;
        });

        test('render selection when click on filter dropdown', () => {
            // Arrange:
            jest.spyOn(vm, 'toggleSelection');

            // Act:
            wrapper.find('.filter-button').trigger('click');

            // Assert:
            expect(vm.toggleSelection).toHaveBeenCalled();
            expect(wrapper.find('.filter-options-container').exists()).toBe(true);
        });

        test('returns isSelectionShown to true', () => {
            // Act:
            vm.toggleSelection();

            // Assert:
            expect(vm.isSelectionShown).toBe(true);
        });

        test('returns isSelectionShown to false', () => {
            // Arrange:
            vm.isSelectionShown = true;

            // Act:
            vm.closeSelection();

            // Assert:
            expect(vm.isSelectionShown).toBe(false);
        });

        test('store commit transaction/filterTransactions when trigger on onChange', () => {
            // Act:
            vm.onChange(TransactionFilterOptions.confirmed, true);

            // Assert:
            expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
                filterOption: new FilterOption(TransactionFilterOptions.confirmed, true),
                currentSignerAddress: currentSigner.address.plain(),
            });
        });

        test('store commit transaction/filterTransactions when trigger on onCurrentSignerChange', () => {
            // Act:
            vm.onCurrentSignerChange();

            // Assert:
            expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
                filterOption: null,
                currentSignerAddress: currentSigner.address.plain(),
            });
        });
    });
});
