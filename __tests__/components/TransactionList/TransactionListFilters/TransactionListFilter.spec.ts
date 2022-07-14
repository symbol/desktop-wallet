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
                isBlackListFilterActivated: isBlackListFilterActivated,
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
        // @ts-ignore
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
        // @ts-ignore
        vm.onSignerSelectorChange();

        // Assert:
        expect(vm.$store.dispatch).not.toBeCalled();
    });

    test("store commit 'transaction/filterTransactions' with blacklisted contacts", () => {
        // Arrange:
        const wrapper = getTransactionListFilterWrapper(false);
        const vm = wrapper.vm as TransactionListFiltersTs;

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
    });

    test("store commit 'transaction/filterTransactions'", () => {
        // Arrange:
        const wrapper = getTransactionListFilterWrapper(true);
        const vm = wrapper.vm as TransactionListFiltersTs;

        // Act:
        // @ts-ignore
        vm.onSelectBlackListed();

        // Assert:
        expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
            currentSignerAddress: currentSigner.address.plain(),
            filterOption: null,
        });
        expect(vm.$store.commit).toBeCalledWith('transaction/isBlackListFilterActivated', false);
    });

    test('returns emit downloadTransactions', () => {
        // Arrange:
        const wrapper = getTransactionListFilterWrapper(false);
        const vm = wrapper.vm as TransactionListFiltersTs;

        // Act:
        vm.downloadTransactions();

        // Assert:
        expect(wrapper.emitted('downloadTransactions')).toBeTruthy();
        expect(wrapper.emitted('downloadTransactions')).toEqual([[]]);
    });
});
