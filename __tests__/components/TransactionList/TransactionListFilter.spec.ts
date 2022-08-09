import { Address } from 'symbol-sdk';
import TransactionListFilters from '@/components/TransactionList/TransactionListFilters/TransactionListFilters.vue';
import { TransactionListFiltersTs } from '@/components/TransactionList/TransactionListFilters/TransactionListFiltersTs';
import { getComponent } from '@MOCKS/Components';
import AccountStore from '@/store/Account';
import TransactionStore from '@/store/Transaction';
import AddressBookStore from '@/store/AddressBook';
import { getTestAccount } from '@MOCKS/Accounts';
import { addressBookMock } from '@MOCKS/AddressBookMock';

describe('TransactionList/TransactionListFilters', () => {
    const currentSigner = getTestAccount('remoteTestnet');

    const getTransactionListFilterWrapper = (isBlackListFilterActivated: boolean) => {
        return getComponent(
            TransactionListFilters,
            { account: AccountStore, transaction: TransactionStore, addressBook: AddressBookStore },
            {
                currentAccount: null,
                currentAccountSigner: currentSigner,
                addressBook: addressBookMock,
                isBlackListFilterActivated,
                signers: [],
            },
            {},
            {
                Tooltip: true,
                'font-awesome-icon': true,
            },
        );
    };

    test("store dispatch 'account/SET_CURRENT_SIGNER' when provided address", () => {
        // Arrange:
        const address = 'TAD5BAHLOIXCRRB6GU2H72HPXMBBVAEUQRYPHBY';

        const wrapper = getTransactionListFilterWrapper(false);
        const vm = wrapper.vm as TransactionListFiltersTs;

        // Act:
        // @ts-ignore - this is a private method
        vm.onSignerSelectorChange(address);

        // Assert:
        expect(vm.$store.dispatch).toBeCalledWith('account/SET_CURRENT_SIGNER', {
            address: Address.createFromRawAddress(address),
            reset: true,
            unsubscribeWS: false,
        });
    });

    test("store dispatch ignore 'account/SET_CURRENT_SIGNER' when address not provided", () => {
        // Arrange:
        const wrapper = getTransactionListFilterWrapper(false);
        const vm = wrapper.vm as TransactionListFiltersTs;

        // Act:
        // @ts-ignore - for protected method
        vm.onSignerSelectorChange();

        // Assert:
        expect(vm.$store.dispatch).not.toBeCalled();
    });

    describe('onSelectBlackListed', () => {
        test('toggle isBlackListFilterActivated to true', () => {
            // Arrange:
            const wrapper = getTransactionListFilterWrapper(false);
            const vm = wrapper.vm as TransactionListFiltersTs;

            jest.spyOn(vm, 'refresh');

            // Act:
            // @ts-ignore
            vm.onSelectBlackListed();

            // Assert:
            expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
                filterOption: null,
                currentSignerAddress: currentSigner.address.plain(),
                multisigAddresses: [],
                shouldFilterOptionChange: false,
                blacklistedContacts: addressBookMock.getBlackListedContacts(),
            });
            expect(vm.$store.commit).toBeCalledWith('transaction/isBlackListFilterActivated', true);
            expect(vm.refresh).toBeCalled();
        });

        test('toggle isBlackListFilterActivated to false', () => {
            // Arrange:
            const wrapper = getTransactionListFilterWrapper(true);
            const vm = wrapper.vm as TransactionListFiltersTs;

            jest.spyOn(vm, 'refresh');

            // Act:
            // @ts-ignore
            vm.onSelectBlackListed();

            // Assert:
            expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
                currentSignerAddress: currentSigner.address.plain(),
                filterOption: null,
            });
            expect(vm.$store.commit).toBeCalledWith('transaction/isBlackListFilterActivated', false);
            expect(vm.refresh).toBeCalled();
        });
    });

    test('returns emit downloadTransactions', () => {
        // Arrange:
        const wrapper = getTransactionListFilterWrapper(false);
        const vm = wrapper.vm as TransactionListFiltersTs;

        // Act:
        vm.downloadTransactions();

        // Assert:
        expect(wrapper.emitted('downloadTransactions')).toEqual([[]]);
    });
});
